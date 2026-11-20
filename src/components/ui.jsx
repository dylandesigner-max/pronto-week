import { Fragment } from 'react';

export const asset = (name) => `/assets/${name}`;

/** Etiqueta com o ícone de "joinha" usada no topo das seções. */
export function Tag({ icon, children, ...rest }) {
  return (
    <span className="tag" data-anim="pop" {...rest}>
      <img src={asset(icon)} alt="" width="26" height="30" />
      {children}
    </span>
  );
}

/** Botão principal laranja com seta (componente BUTTON do Figma). */
export function Button({ children, href = '#download', ...rest }) {
  return (
    <a className="btn" href={href} data-magnetic {...rest}>
      <span className="btn__label">{children}</span>
      <img className="btn__arrow" src={asset('btn-arrow.svg')} alt="" width="70" height="70" />
    </a>
  );
}

/** Quebra um texto em palavras para a animação de "mask reveal". */
export function SplitWords({ text }) {
  const words = text.split(' ');
  return words.map((w, i) => (
    <Fragment key={i}>
      <span className="split-word">
        <span>{w}</span>
      </span>
      {i < words.length - 1 ? ' ' : null}
    </Fragment>
  ));
}
