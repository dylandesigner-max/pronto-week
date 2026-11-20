import { useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { scrollState } from '../hooks/useSmoothScroll';

gsap.registerPlugin(ScrollTrigger);

const UNITS = 14;

/**
 * Faixa "Pronto Week!" — curva do Figma com o texto correndo ao longo do
 * caminho (textPath) em loop infinito, acelerando com a velocidade do scroll.
 */
export default function Ribbon({ id, className, viewBox, bandPath, textPath, speed = 0.6 }) {
  const root = useRef(null);

  useGSAP(
    () => {
      const svg = root.current;
      const band = svg.querySelector('.ribbon__band');
      const text = svg.querySelector('text');
      const tp = svg.querySelector('textPath');
      const len = band.getTotalLength();
      const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

      let unit = 0;
      const measure = () => {
        unit = text.getComputedTextLength() / UNITS;
      };
      measure();
      document.fonts?.ready.then(measure);

      // Desenha a faixa quando ela entra na tela
      gsap.set(band, { strokeDasharray: len, strokeDashoffset: reduce ? 0 : len });
      gsap.set(text, { opacity: reduce ? 1 : 0 });
      if (!reduce) {
        gsap
          .timeline({ scrollTrigger: { trigger: svg, start: 'top 90%', once: true } })
          .to(band, { strokeDashoffset: 0, duration: 1.6, ease: 'power3.inOut' })
          .to(text, { opacity: 1, duration: 0.6, ease: 'power2.out' }, '-=0.6');
      }

      // Marquee ao longo do caminho
      let offset = 0;
      const tick = (_t, dt) => {
        if (!unit) return;
        const boost = Math.min(Math.abs(scrollState.velocity) * 0.25, 8);
        offset += (speed + boost) * (dt / 16.67);
        tp.setAttribute('startOffset', ((offset % unit) - unit).toFixed(2));
      };
      if (!reduce) gsap.ticker.add(tick);
      return () => gsap.ticker.remove(tick);
    },
    { scope: root },
  );

  const units = Array.from({ length: UNITS }, (_, i) => (
    <tspan key={i}>
      <tspan className="r-small">{'● '}</tspan>
      <tspan className="r-big">{'Pronto Week! '}</tspan>
      <tspan className="r-small">{'● 1,2,3... e pronto! '}</tspan>
    </tspan>
  ));

  return (
    <div className={`ribbon ${className}`} aria-hidden="true">
      <svg ref={root} viewBox={viewBox} preserveAspectRatio="xMidYMid meet">
        <path className="ribbon__band" d={bandPath} stroke="#F8603E" strokeWidth="65" fill="none" />
        <path id={id} d={textPath} fill="none" />
        <text dominantBaseline="central">
          <textPath href={`#${id}`} startOffset="0">
            {units}
          </textPath>
        </text>
      </svg>
    </div>
  );
}

// Caminhos dos vetores "FAIXA" e "FAIXA 2" do Figma
const R1 = 'M7.53205 482.586C612.067 626.611 1216.46 -125.636 1339.79 387.202C1447.84 836.531 713.538 425.892 1579.87 206.36';
export const RIBBON_1 = { viewBox: '0 0 1587.85 679.945', band: R1, text: R1 };

export const RIBBON_2 = {
  viewBox: '0 0 1690.16 348.23',
  // no Figma o vetor está espelhado na vertical (y' = 348.23 - y)
  band: 'M1672.79 234.488C1595.29 283.488 1280.28 359.579 1102.29 283.488C833.29 168.488 622.29 -91.512 9.7904 101.988',
  // mesmo traçado invertido, para o texto correr da esquerda para a direita
  text: 'M9.7904 101.988C622.29 -91.512 833.29 168.488 1102.29 283.488C1280.28 359.579 1595.29 283.488 1672.79 234.488',
};
