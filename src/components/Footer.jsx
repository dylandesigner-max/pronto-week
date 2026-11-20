import { asset, SplitWords } from './ui';
import { scrollToTop } from '../hooks/useSmoothScroll';

export default function Footer() {
  return (
    <footer className="footer" id="download">
      <button type="button" className="back-top" onClick={scrollToTop} data-magnetic>
        voltar ao topo
        <img src={asset('arrow-up.svg')} alt="" width="26" height="25" />
      </button>

      <div className="download">
        <div className="download__row">
          <div className="download__phones" data-phones aria-hidden="true">
            <div className="download__rect" data-phone-rect />
            <div className="download__phone download__phone--1" data-phone="1">
              <img src={asset('phone-1.webp')} alt="" loading="lazy" />
            </div>
            <div className="download__phone download__phone--2" data-phone="2">
              <img src={asset('phone-2.webp')} alt="" loading="lazy" />
            </div>
          </div>

          <div className="download__text">
            <div className="download__copy">
              <span className="promo-pill" data-anim="pill">
                Aproveite a Pronto Week!
              </span>
              <div className="download__headline">
                <h2 className="display" data-anim="words">
                  <SplitWords text="Tudo Pronto!" />
                </h2>
                <p data-anim="fade">Baixe agora nosso SuperApp e descubra todas as ofertas!</p>
              </div>
            </div>

            <div className="stores" data-stagger>
              <a className="store" href="#" aria-label="Disponível na Playstore" data-magnetic>
                <span className="store__text">
                  <span className="store__small">Disponível na</span>
                  <span className="store__big">Playstore</span>
                </span>
                <span className="store__icon">
                  <img src={asset('icon-playstore.svg')} alt="" />
                </span>
              </a>
              <a className="store" href="#" aria-label="Disponível na Appstore" data-magnetic>
                <span className="store__text">
                  <span className="store__small">Disponível na</span>
                  <span className="store__big">Appstore</span>
                </span>
                <span className="store__icon">
                  <img src={asset('icon-appstore.svg')} alt="" />
                </span>
              </a>
            </div>
          </div>
        </div>
      </div>

      <div className="footer__bar">
        <a href="#inicio" className="footer__logo" aria-label="Pronto — voltar ao início">
          <img src={asset('footer-logo-thumb.svg')} alt="" />
          pronto
        </a>
        <p>© Pronto 2026. Todos os direitos reservados</p>
        <p>Desenvolvido por Dylan Designer</p>
      </div>
    </footer>
  );
}
