# Pronto Week — Landing Page

Landing page da campanha **Pronto Week** do SuperApp Pronto, codificada a partir do layout do Figma (arquivo *PRONTO*, página "📍ONE PAGE | PRONTO").

## Stack

- **React 18 + Vite**: interface e build
- **Node.js + Express** (`server/index.js`): servidor de produção
- **Three.js + React Three Fiber**: efeitos WebGL
  - fundo do hero em shader: gradiente "líquido" com brilho que segue o cursor
  - foto da seção Ofertas com revelação em onda e separação RGB ligada ao scroll
- **GSAP + ScrollTrigger + Lenis**: scroll suave e animações ligadas à rolagem
  - entrada orquestrada do hero
  - títulos com *mask reveal*
  - faixas "Pronto Week!" com o texto correndo ao longo da curva
  - celulares em 3D
  - botões magnéticos e cards com tilt

## Como rodar

```bash
npm install
npm run dev        # desenvolvimento em http://localhost:5173
npm run build      # build de produção em /dist
npm start          # servidor Node em http://localhost:3000
```

## Estrutura

```
src/
  components/   seções da página (Header, Hero, About, Offers, Scarcity, Faq, Footer, Ribbon)
  webgl/        HeroShader, DistortImage (Three.js)
  hooks/        scroll suave (Lenis) e utilitários
  styles/       tokens (8-point grid) e estilos globais
  animations.js coreografia GSAP
public/assets/  imagens e ícones exportados do Figma (WebP otimizados)
server/         servidor Express
COPY.md         copy aprovada (fonte da verdade do texto)
```

## Acessibilidade e desempenho

- Com `prefers-reduced-motion`, as animações e o WebGL são desativados e as imagens estáticas entram no lugar.
- Os canvases WebGL pausam quando estão fora da tela.
- As imagens foram convertidas para WebP (de ~18 MB para ~600 KB).
