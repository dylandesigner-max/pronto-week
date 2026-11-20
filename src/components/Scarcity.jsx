import { asset, Button, SplitWords, Tag } from './ui';

export default function Scarcity() {
  return (
    <section className="scarcity" aria-labelledby="scarcity-title">
      <div className="container">
        <div className="scarcity__left">
          <div className="scarcity__tags">
            <Tag icon="tag-escassez.svg">Não perca!</Tag>
            <span className="promo-pill" data-anim="pill">
              Aproveite a Pronto Week!
            </span>
          </div>
          <div className="scarcity__copy">
            <h2 id="scarcity-title" className="display" data-anim="words">
              <SplitWords text="Só por tempo limitado." />
            </h2>
            <p className="lead" data-anim="fade">
              Depois, tudo volta ao normal.
            </p>
          </div>
          <div className="scarcity__cta">
            <div data-anim="pop">
              <Button href="#download">Quero meus descontos!</Button>
            </div>
            <img className="scarcity__clock" src={asset('badge-clock.svg')} alt="" data-spin="1.4" aria-hidden="true" />
          </div>
        </div>

        <div className="scarcity__grid" data-scarcity-grid>
          <div className="sg sg-rect sg--pizza-rect" data-sg="0" />
          <div className="sg sg-media sg--pizza" data-sg="1">
            <img src={asset('esc-pizza.webp')} alt="Pizza de pepperoni" loading="lazy" />
          </div>
          <div className="sg sg-tag sg--tag-1" data-sg="2" aria-hidden="true">
            <img src={asset('tag-percent-orange.svg')} alt="" />
          </div>

          <div className="sg sg-rect sg--broc-rect" data-sg="0" />
          <div className="sg sg-media sg--broc" data-sg="1">
            <img src={asset('esc-broccoli.webp')} alt="Brócolis frescos" loading="lazy" />
          </div>
          <div className="sg sg-tag sg--tag-2" data-sg="2" aria-hidden="true">
            <img src={asset('tag-percent-green.svg')} alt="" />
          </div>

          <div className="sg sg-rect sg--bottle-rect" data-sg="0" />
          <div className="sg sg-tag sg--tag-3" data-sg="2" aria-hidden="true">
            <img src={asset('tag-percent-pink.svg')} alt="" />
          </div>
          <div className="sg sg-media sg--bottle" data-sg="1">
            <img src={asset('esc-bottle.webp')} alt="Garrafa de leite" loading="lazy" />
          </div>
        </div>
      </div>
    </section>
  );
}
