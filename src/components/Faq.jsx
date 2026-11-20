import { useRef, useState } from 'react';
import gsap from 'gsap';
import { asset, SplitWords, Tag } from './ui';

// Perguntas do Figma. Respostas 02–05 não existem no Figma: [PREMISSA] (ver COPY.md)
const ITEMS = [
  { q: 'A campanha tem prazo?', a: 'Sim. As condições especiais são por tempo limitado.' },
  {
    q: 'Posso acompanhar meu pedido?',
    a: 'Sim! Pelo app você acompanha cada etapa em tempo real, do preparo até a sua porta.',
  },
  {
    q: 'Quais formas de pagamento são aceitas?',
    a: 'Pix, cartão de crédito e débito direto no app, com total segurança.',
  },
  {
    q: 'Quais tipos de pedidos posso fazer?',
    a: 'Lanches, compras de mercado e produtos variados do nosso marketplace, tudo em um só lugar.',
  },
  {
    q: 'Preciso baixar o app para usar?',
    a: 'Sim. As ofertas da Pronto Week são exclusivas do SuperApp, disponível para Android e iOS.',
  },
];

export default function Faq() {
  const [open, setOpen] = useState(0);
  const panels = useRef([]);

  const toggle = (i) => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const next = open === i ? -1 : i;
    panels.current.forEach((el, idx) => {
      if (!el) return;
      const show = idx === next;
      gsap.to(el, {
        height: show ? 'auto' : 0,
        duration: reduce ? 0 : 0.5,
        ease: show ? 'power3.out' : 'power3.inOut',
      });
      gsap.fromTo(
        el.firstChild,
        { y: show ? -12 : 0, opacity: show ? 0 : 1 },
        { y: 0, opacity: show ? 1 : 0, duration: reduce ? 0 : 0.4, delay: show ? 0.1 : 0 },
      );
    });
    setOpen(next);
  };

  return (
    <section className="faq" id="faq" aria-labelledby="faq-title">
      <div className="container">
        <div className="faq__head">
          <Tag icon="tag-faq.svg">FAQ</Tag>
          <div className="faq__copy">
            <h2 id="faq-title" className="display" data-anim="words">
              <SplitWords text="Tire suas dúvidas" />
            </h2>
            <p className="lead" data-anim="fade">
              Tudo o que precisa saber sobre o SuperApp Pronto!
            </p>
          </div>
        </div>

        <ul className="faq__list" data-stagger>
          {ITEMS.map((it, i) => {
            const isOpen = open === i;
            const num = String(i + 1).padStart(2, '0');
            return (
              <li key={it.q} className={`faq-item${isOpen ? ' is-open' : ''}`}>
                <button
                  type="button"
                  className="faq-item__q"
                  aria-expanded={isOpen}
                  aria-controls={`faq-a-${i}`}
                  id={`faq-q-${i}`}
                  onClick={() => toggle(i)}
                >
                  <span className="faq-item__label">
                    <span>{num}/</span>
                    <span>{it.q}</span>
                  </span>
                  <span className="faq-item__icon" aria-hidden="true">
                    <img src={asset('faq-icon.svg')} alt="" width="20" height="20" />
                  </span>
                </button>
                <div
                  className="faq-item__a"
                  id={`faq-a-${i}`}
                  role="region"
                  aria-labelledby={`faq-q-${i}`}
                  ref={(el) => (panels.current[i] = el)}
                  style={isOpen ? { height: 'auto' } : undefined}
                >
                  <p>{it.a}</p>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
