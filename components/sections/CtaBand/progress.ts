import { gsap } from 'gsap';

/** Доля отрезка [from, to] внутри общего прогресса, 0…1. */
export const seg = (progress: number, from: number, to: number) => gsap.utils.clamp(0, 1, (progress - from) / (to - from));

export const lerp = (from: number, to: number, t: number) => from + (to - from) * t;

export const easeOut = gsap.parseEase('power3.out');
export const easeInOut = gsap.parseEase('power2.inOut');
export const easeBack = gsap.parseEase('back.out(1.7)');
