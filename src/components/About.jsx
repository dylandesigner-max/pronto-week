import { asset, Button, SplitWords, Tag } from './ui';

const CARDS = [
  {
    mod: 'market',
    icon: 'card-cart.svg',
    w: 147,
    h: 136,
    title: 'Compras de mercado',
    text: 'limpeza, hortifruti, e muito mais!',
    textW: 185,
  },
  {
    mod: 'snacks',
    icon: 'card-pizza.svg',
    w: 153,
    h: 124,
    title: 'Lanches e snacks',
    text: 'Pizza, Hamburguer, salgados e muito mais!',
    textW: 273,
  },
  {
    mod: 'delivery',
    icon: 'card-box.svg',
    w: 126,
    h: 132,
    title: 'Entregas',
    text: 'Produtos variados, entregas de market place',
    textW: 263,
  },
];

const DETAILS = [
  { icon: 'icon-percent.svg', w: 55, h: 55, label: 'Ofertas especiais' },
  { icon: 'icon-truck.svg', w: 60, h: 60, label: 'Frete grátis' },
  { icon: 'icon-support.svg', w: 39.35, h: 34.98, label: 'Suporte 24h' },
];

export default function About() {
  return (
    <section className="about" id="conheca" aria-labelledby="about-title">
      <div className="container">
        <div className="about__top">
          <div className="about__intro">
            <Tag icon="tag-conheca.svg">Conheça!</Tag>
            <h2 id="about-title" className="display" data-anim="words">
              <SplitWords text="O que é o pronto?" />
            </h2>
            <p className="lead" data-anim="fade">
              Uma solução completa para suas maiores necessidades
            </p>
          </div>
          <div className="about__badges" aria-hidden="true">
            <img className="about__smile" src={asset('badge-smile.svg')} alt="" data-spin="1" />
            <div className="about__pill" data-anim="pill">
              <span>Rápido, simples e do seu jeito.</span>
            </div>
          </div>
        </div>

        <div className="cards" data-stagger>
          {CARDS.map((c) => (
            <article key={c.mod} className={`card card--${c.mod}`} data-tilt>
              <div className="card__media">
                <img className="card__icon" src={asset(c.icon)} alt="" width={c.w} height={c.h} style={{ width: c.w, height: c.h }} />
              </div>
              <div className="card__body">
                <h3 className="card__title">{c.title}</h3>
                <p className="card__text" style={{ maxWidth: c.textW }}>
                  {c.text}
                </p>
              </div>
            </article>
          ))}
        </div>

        <div data-anim="pop">
          <Button href="#ofertas">Conheça o Pronto!</Button>
        </div>

        <ul className="details" data-stagger aria-label="Benefícios" style={{ listStyle: 'none', margin: 0 }}>
          {DETAILS.map((d) => (
            <li key={d.label} className="detail">
              <img src={asset(d.icon)} alt="" width={d.w} height={d.h} style={{ width: d.w, height: d.h }} />
              {d.label}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
