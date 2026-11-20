import { useEffect } from 'react';
import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/** Estado compartilhado do scroll (velocidade usada pelas faixas e pelo WebGL). */
export const scrollState = { velocity: 0, progress: 0, y: 0, lenis: null };

export function useSmoothScroll() {
  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce) {
      const onScroll = () => {
        scrollState.y = window.scrollY;
      };
      window.addEventListener('scroll', onScroll, { passive: true });
      return () => window.removeEventListener('scroll', onScroll);
    }

    const lenis = new Lenis({ duration: 1.15, smoothWheel: true, wheelMultiplier: 0.95 });
    scrollState.lenis = lenis;
    lenis.on('scroll', (e) => {
      scrollState.velocity = e.velocity;
      scrollState.progress = e.progress;
      scrollState.y = e.scroll;
      ScrollTrigger.update();
    });
    const raf = (time) => lenis.raf(time * 1000);
    gsap.ticker.add(raf);
    gsap.ticker.lagSmoothing(0);

    // Links âncora com scroll suave
    const onClick = (ev) => {
      const a = ev.target.closest('a[href^="#"]');
      if (!a) return;
      const id = a.getAttribute('href');
      if (id.length < 2) return;
      const el = document.querySelector(id);
      if (!el) return;
      ev.preventDefault();
      lenis.scrollTo(el, { offset: id === '#inicio' ? -200 : -24, duration: 1.4 });
    };
    document.addEventListener('click', onClick);

    return () => {
      document.removeEventListener('click', onClick);
      gsap.ticker.remove(raf);
      lenis.destroy();
      scrollState.lenis = null;
    };
  }, []);
}

export function scrollToTop() {
  if (scrollState.lenis) scrollState.lenis.scrollTo(0, { duration: 1.6 });
  else window.scrollTo({ top: 0, behavior: 'smooth' });
}
