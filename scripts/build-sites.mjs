import { cp, mkdir, mkdtemp, rm, symlink, writeFile } from 'node:fs/promises';
import { resolve, join } from 'node:path';
import { spawnSync } from 'node:child_process';
import { build } from 'esbuild';

// Export public pages in an isolated staging directory, keep API code in the Worker
// Never rename app/api or disturb the running Next.js development checkout
const root = process.cwd();
await mkdir(join(root, '.sites-runtime'), { recursive: true });
const stage = await mkdtemp(join(root, '.sites-runtime', 'build-'));
try {
  for (const entry of ['app', 'components', 'hooks', 'data', 'styles', 'lib', 'public', 'package.json', 'tsconfig.json', 'next.config.ts']) {
    await cp(join(root, entry), join(stage, entry), { recursive: true });
  }
  await rm(join(stage, 'app/api'), { recursive: true, force: true });
  await symlink(join(root, 'node_modules'), join(stage, 'node_modules'), 'dir');
  const result = spawnSync(process.execPath, [join(root, 'node_modules/next/dist/bin/next'), 'build', '--webpack'], {
    cwd: stage, stdio: 'inherit', env: { ...process.env, FLAME_SITES_EXPORT: '1', NEXT_TELEMETRY_DISABLED: '1' },
  });
  if (result.status !== 0) throw new Error('Sites page build failed');
  const output = resolve(root, 'dist');
  await rm(output, { recursive: true, force: true });
  await mkdir(join(output, 'server'), { recursive: true });
  await cp(join(stage, 'out'), join(output, 'client'), { recursive: true });
  await build({ entryPoints: [join(root, 'sites/worker.ts')], outfile: join(output, 'server/index.js'), bundle: true, format: 'esm', platform: 'browser', target: 'es2022', minify: true, tsconfig: join(root, 'tsconfig.json') });
  await mkdir(join(output, '.openai'), { recursive: true });
  await cp(join(root, '.openai/hosting.json'), join(output, '.openai/hosting.json'));
  await writeFile(join(output, 'client/_headers'), '/_next/static/*\n  Cache-Control: public, max-age=31536000, immutable\n');
  console.log('Sites build ready: static pages and server API');
} finally { await rm(stage, { recursive: true, force: true }); }
