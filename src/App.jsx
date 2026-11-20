import { lazy, Suspense, useEffect, useRef, useState } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import About from './components/About';
import Offers from './components/Offers';
import Scarcity from './components/Scarcity';
import Faq from './components/Faq';
import Footer from './components/Footer';
import { useSmoothScroll } from './hooks/useSmoothScroll';
import { hasWebGL, prefersReducedMotion } from './hooks/useInView';
import { setupAnimations } from './animations';

const FloatingShapes = lazy(() => import('./webgl/FloatingShapes'));

export default function App() {
  const root = useRef(null);
  const [webgl] = useState(() => hasWebGL() && !prefersReducedMotion());
  // formas 3D globais só em telas ≥ 768px (no celular competem com o texto)
  const [shapes] = useState(() => webgl && window.matchMedia('(min-width: 768px)').matches);

  useSmoothScroll();

  useEffect(() => {
    let cleanup = () => {};
    let cancelled = false;
    // espera as fontes para medir corretamente os títulos
    const start = () => {
      if (!cancelled) cleanup = setupAnimations(root.current);
    };
    if (!document.fonts || document.fonts.status === 'loaded') start();
    else document.fonts.ready.then(start);
    return () => {
      cancelled = true;
      cleanup();
    };
  }, []);

  return (
    <>
      <a className="skip-link" href="#conteudo">
        Pular para o conteúdo
      </a>
      {shapes && (
        <Suspense fallback={null}>
          <FloatingShapes />
        </Suspense>
      )}
      <div className="page" ref={root}>
        <Header />
        <main id="conteudo">
          <Hero webgl={webgl} />
          <About />
          <Offers webgl={webgl} />
          <Scarcity />
          <Faq />
        </main>
        <Footer />
      </div>
    </>
  );
}
