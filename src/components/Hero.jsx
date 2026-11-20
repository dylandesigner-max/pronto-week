import { lazy, Suspense, useRef } from 'react';
import { asset, Button, SplitWords, Tag } from './ui';
import Ribbon, { RIBBON_1 } from './Ribbon';
import { useInView } from '../hooks/useInView';

const HeroShader = lazy(() => import('../webgl/HeroShader'));

export default function Hero({ webgl }) {
  const ref = useRef(null);
  const inView = useInView(ref, '0px');

  return (
    <div className="hero-wrap" id="inicio">
      <section className="hero" ref={ref} aria-labelledby="hero-title">
        {webgl && (
          <div className="hero__gl" aria-hidden="true">
            <Suspense fallback={null}>
              <HeroShader active={inView} />
            </Suspense>
          </div>
        )}

        <div className="hero__content">
          <div className="hero__text">
            <Tag icon="tag-hero.svg">1,2,3... e pronto!</Tag>
            <h1 id="hero-title" className="display hero__title" data-anim="words">
              <SplitWords text="A Pronto week está lançada!" />
            </h1>
            <p className="lead hero__lead" data-anim="fade">
              Uma semana inteira de Lanches, mercado e entregas com os <strong>melhores descontos</strong>
            </p>
          </div>
          <div data-anim="pop">
            <Button href="#download">Baixe o SuperApp</Button>
          </div>
        </div>

        <div className="hero__art" data-hero-art>
          <div className="art-item hero__thumb" data-depth="0.2" data-hero="thumb">
            <img src={asset('hero-thumb-bg.svg')} alt="" width="279" height="315" />
          </div>
          <div className="art-item art-bbox hero__drink" data-depth="0.9" data-hero="drink">
            <div className="art-inner">
              <img src={asset('hero-drink.webp')} alt="Copo de refrigerante com gelo" width="353" height="402" />
            </div>
          </div>
          <div className="art-item art-bbox hero__burger" data-depth="0.7" data-hero="burger">
            <div className="art-inner">
              <img src={asset('hero-burger.webp')} alt="Hambúrguer" width="238" height="358" />
            </div>
          </div>
          <div className="art-item art-bbox hero__scooter" data-depth="0.35" data-hero="scooter">
            <div className="art-inner">
              <img
                src={asset('hero-scooter.webp')}
                alt="Scooter laranja de entregas Pronto"
                width="617"
                height="697"
                fetchpriority="high"
              />
            </div>
          </div>
          <div className="art-item hero__box" data-depth="0.55" data-hero="box">
            <img src={asset('hero-box.webp')} alt="Caixa de comida para viagem" width="516" height="344" />
          </div>
        </div>
      </section>

      <Ribbon id="ribbon-1" className="ribbon--1" viewBox={RIBBON_1.viewBox} bandPath={RIBBON_1.band} textPath={RIBBON_1.text} />
    </div>
  );
}
