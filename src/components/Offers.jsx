import { lazy, Suspense, useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { asset, SplitWords, Tag } from './ui';
import Ribbon, { RIBBON_2 } from './Ribbon';
import { useInView } from '../hooks/useInView';

const DistortImage = lazy(() => import('../webgl/DistortImage'));
const PHOTO = asset('delivery-man.webp');

export default function Offers({ webgl }) {
  const photoRef = useRef(null);
  const glState = useRef({ progress: 0 }).current;
  const inView = useInView(photoRef, '100px');

  // progresso da revelação em WebGL atrelado ao scroll
  useGSAP(
    () => {
      if (!webgl) return;
      gsap.to(glState, {
        progress: 1,
        ease: 'none',
        scrollTrigger: { trigger: photoRef.current, start: 'top 95%', end: 'top 25%', scrub: 0.6 },
      });
    },
    { dependencies: [webgl] },
  );

  return (
    <div className="offers-wrap">
    <section className="offers" id="ofertas" aria-labelledby="offers-title">
      <div className="offers__head">
        <Tag icon="tag-ofertas.svg">Ofertas únicas!</Tag>
        <div className="offers__copy">
          <h2 id="offers-title" className="display" data-anim="words">
            <SplitWords text="Essa semana, o Pronto está ainda melhor!" />
          </h2>
          <p className="lead" data-anim="fade">
            Condições especiais para pedir, comprar e receber.
          </p>
        </div>
      </div>

      <div className="offers__art">
        <div className="offers__square" data-float="-60" aria-hidden="true">
          <div className="offers__square-bg" />
          <img src={asset('ofertas-thumb.svg')} alt="" />
        </div>

        <div className="offers__photo" ref={photoRef} data-offers-photo>
          {webgl ? (
            <Suspense fallback={<Fallback />}>
              <DistortImage src={PHOTO} state={glState} active={inView} />
            </Suspense>
          ) : (
            <Fallback />
          )}
          <span className="sr-only">Entregador sorridente sentado na scooter, fazendo sinal de positivo</span>
        </div>

        <div className="offers__percent" data-spin="-1" data-float="-90" aria-hidden="true">
          <img src={asset('badge-percent.svg')} alt="" />
        </div>
        <div className="offers__pill" data-float="-40" aria-hidden="true">
          <span>seu pedido está pronto!</span>
        </div>
      </div>
    </section>

      <Ribbon
        id="ribbon-2"
        className="ribbon--2"
        viewBox={RIBBON_2.viewBox}
        bandPath={RIBBON_2.band}
        textPath={RIBBON_2.text}
        speed={0.5}
      />
    </div>
  );
}

function Fallback() {
  return (
    <div className="offers__photo-fallback">
      <img src={PHOTO} alt="" width="1162" height="775" loading="lazy" />
    </div>
  );
}
