'use client';

import Hero from '@/components/sections/Hero/Hero';
import HeroOverlay from '@/components/sections/Hero/HeroOverlay';
import Cases from '@/components/sections/Cases/Cases';
import CasesTilt from '@/components/sections/Cases/CasesTilt';
import CtaSection from '@/components/sections/CtaBand/CtaSection';
import { parseCta } from '@/components/sections/CtaBand/variants';
import ServicesSection from '@/components/sections/Services/ServicesSection';
import { parseServices } from '@/components/sections/Services/variants';
import { parseTibiaDemo } from '@/components/sections/Services/visuals/tibia/variants';
import { parseGameDemo } from '@/components/sections/Services/visuals/game/variants';
import { parseWeb3dDemo } from '@/components/sections/Services/visuals/web3d/variants';
import { parseAiDemo } from '@/components/sections/Services/visuals/ai/variants';
import WhySection from '@/components/sections/Why/WhySection';
import { parseWhy } from '@/components/sections/Why/variants';
import ProcessSection from '@/components/sections/Process/ProcessSection';
import { parseProcess } from '@/components/sections/Process/variants';
import EcosystemSection from '@/components/sections/Ecosystem/EcosystemSection';
import { parseEcosystem } from '@/components/sections/Ecosystem/variants';
import ContactSection from '@/components/sections/Contact/ContactSection';
import { parseContact } from '@/components/sections/Contact/variants';
import HomeTransition from '@/components/sections/HomeTransition/HomeTransition';
import { COVER_VARIANTS, parseTransition } from '@/components/sections/HomeTransition/variants';
import VariantPanel from '@/components/layout/VariantPanel/VariantPanel';
import useVariants from '@/components/layout/VariantPanel/hooks/useVariants';
import { VARIANT_GROUPS } from '@/data/variants';

export interface HomeProps {
  /** Показывать меню вариантов блоков (в деве и на стенде по VARIANT_PANEL=1). */
  variantPanel: boolean;
}

// Секции главной 01–07. Основные варианты: первый экран с кадром во весь экран (HeroOverlay),
// наклонные строки кейсов (CasesTilt), переход 4 «зум и размытие» (см. useHomeTransition).
// Остальные варианты блоков остаются для сравнения и переключаются только меню в углу экрана
// (data/variants.ts): выбор живёт в состоянии клиента, в адрес не пишется.
const Home = ({ variantPanel }: HomeProps) => {
  const { values, pending, select, reset } = useVariants(variantPanel);
  const { hero, cases, transition, cta, services, why, process: processStep, ecosystem, contact, tibia, game, web3d, ai } = values;
  const variant = parseTransition(transition);
  // Ключ из всех вариантов: при переключении из меню страница собирается заново целиком.
  // Пины GSAP переносят секции в свои обёртки и держат отметки прокрутки соседей: точечная
  // замена одного блока ломала и DOM (insertBefore / removeChild), и позиции остальных пинов.
  // Полное пересоздание откатывает все контексты GSAP и заводит пины заново в порядке страницы.
  const variantKey = VARIANT_GROUPS.map((group) => values[group.id] ?? '').join('|');

  return (
    <>
      <div key={variantKey}>
        <HomeTransition variant={variant}>
          {hero === 'reel' ? <Hero coverNext={COVER_VARIANTS.includes(variant)} /> : <HeroOverlay coverNext={COVER_VARIANTS.includes(variant)} />}
          {cases === 'rows' ? <Cases /> : <CasesTilt leadIn={variant === 3} />}
        </HomeTransition>
        <CtaSection variant={parseCta(cta)} />
        <ServicesSection
          variant={parseServices(services)}
          demos={{
            tibia: parseTibiaDemo(tibia),
            game: parseGameDemo(game),
            web3d: parseWeb3dDemo(web3d),
            ai: parseAiDemo(ai),
          }}
        />
        <WhySection variant={parseWhy(why)} />
        <ProcessSection variant={parseProcess(processStep)} />
        <EcosystemSection variant={parseEcosystem(ecosystem)} />
        <ContactSection variant={parseContact(contact)} />
      </div>
      {variantPanel && <VariantPanel values={values} pending={pending} onSelect={select} onReset={reset} />}
    </>
  );
};

export default Home;
