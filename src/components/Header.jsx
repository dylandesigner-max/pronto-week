import { useEffect, useState } from 'react';
import { asset } from './ui';
import { scrollState } from '../hooks/useSmoothScroll';

const LINKS = [
  { href: '#inicio', label: 'Início' },
  { href: '#conheca', label: 'Conheça' },
  { href: '#ofertas', label: 'Ofertas' },
  { href: '#faq', label: 'FAQ' },
];

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState('#inicio');

  useEffect(() => {
    let last = 0;
    let raf;
    const loop = () => {
      const y = scrollState.lenis ? scrollState.y : window.scrollY;
      setScrolled(y > 24);
      if (Math.abs(y - last) > 6) {
        setHidden(y > last && y > 400);
        last = y;
      }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, []);

  // link ativo conforme a seção visível
  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => e.isIntersecting && setActive(`#${e.target.id}`));
      },
      { rootMargin: '-45% 0px -50% 0px' },
    );
    LINKS.forEach((l) => {
      const el = document.querySelector(l.href);
      if (el) io.observe(el);
    });
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    if (open) scrollState.lenis?.stop();
    else scrollState.lenis?.start();
  }, [open]);

  return (
    <header className={`header${scrolled ? ' is-scrolled' : ''}${hidden && !open ? ' is-hidden' : ''}`}>
      <div className="container header__inner">
        <a href="#inicio" className="logo" aria-label="Pronto — início">
          <img src={asset('logo-thumb.svg')} alt="" width="46" height="52" />
          <span>pronto</span>
        </a>

        <nav id="menu" className={`nav${open ? ' is-open' : ''}`} aria-label="Principal">
          {LINKS.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className={`nav__link${active === l.href ? ' is-active' : ''}`}
              onClick={() => setOpen(false)}
            >
              {l.label}
            </a>
          ))}
        </nav>

        <div className="header__actions">
          <a href="#download" className="download-btn" aria-label="Baixar o SuperApp" data-magnetic>
            <img src={asset('icon-download.svg')} alt="" width="30" height="30" />
          </a>
          <button
            type="button"
            className="menu-toggle"
            aria-label={open ? 'Fechar menu' : 'Abrir menu'}
            aria-expanded={open}
            aria-controls="menu"
            onClick={() => setOpen((v) => !v)}
          >
            <span />
          </button>
        </div>
      </div>
    </header>
  );
}
