import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const EASE = 'expo.out';
const q = (sel, root = document) => Array.from(root.querySelectorAll(sel));

/**
 * Coreografia de animações da página (GSAP + ScrollTrigger).
 * Tudo roda dentro de gsap.matchMedia: com "movimento reduzido" nada é animado.
 */
export function setupAnimations(root) {
  const mm = gsap.matchMedia();

  mm.add(
    {
      motion: '(prefers-reduced-motion: no-preference)',
      desktop: '(min-width: 1024px)',
      fine: '(hover: hover) and (pointer: fine)',
    },
    (ctx) => {
      const { motion, desktop, fine } = ctx.conditions;
      if (!motion) return;

      heroIntro(root);
      scrollReveals(root);
      parallax(root, desktop);
      scarcity(root);
      phones(root, desktop);
      if (fine) {
        const off = [heroMouse(root), magnetic(root), tilt(root)];
        return () => off.forEach((fn) => fn && fn());
      }
      return undefined;
    },
    root,
  );

  return () => mm.revert();
}

/* ---------- HERO: entrada orquestrada + loop flutuante ---------- */
function heroIntro(root) {
  const hero = root.querySelector('.hero');
  if (!hero) return;
  const words = q('.hero__title .split-word > span', hero);
  const art = (k) => hero.querySelector(`[data-hero="${k}"]`);

  const tl = gsap.timeline({ defaults: { ease: EASE }, delay: 0.15 });
  tl.from(hero, { scale: 0.96, opacity: 0, duration: 1.1, ease: 'power3.out' })
    .from(hero.querySelector('.tag'), { y: 16, scale: 0.8, opacity: 0, duration: 0.6, ease: 'back.out(2)' }, 0.3)
    .from(words, { yPercent: 110, rotate: 4, duration: 0.9, stagger: 0.06 }, 0.35)
    .from(hero.querySelector('.hero__lead'), { y: 24, opacity: 0, duration: 0.7 }, 0.6)
    .from(hero.querySelector('.hero__content > [data-anim="pop"]'), { y: 24, scale: 0.85, opacity: 0, duration: 0.7, ease: 'back.out(1.8)' }, 0.7)
    .from(art('thumb'), { scale: 0.4, rotate: -25, opacity: 0, duration: 1.2 }, 0.35)
    .from(art('scooter'), { xPercent: 40, rotate: 8, opacity: 0, duration: 1.3 }, 0.4)
    .from(art('box'), { yPercent: -120, rotate: -24, opacity: 0, duration: 1.1, ease: 'bounce.out' }, 0.75)
    .from(art('drink'), { yPercent: 60, scale: 0.5, rotate: -20, opacity: 0, duration: 1 , ease: 'back.out(1.6)' }, 0.8)
    .from(art('burger'), { yPercent: 60, scale: 0.5, rotate: 20, opacity: 0, duration: 1, ease: 'back.out(1.6)' }, 0.9);

  // loop "idle": cada peça flutua num ritmo diferente
  tl.add(() => {
    [
      ['thumb', 3, 4],
      ['scooter', 1.6, 4.6],
      ['box', 3.2, 3.4],
      ['drink', 4, 3.8],
      ['burger', 3.6, 3.1],
    ].forEach(([k, amp, dur], i) => {
      gsap.to(art(k), {
        yPercent: `+=${amp}`,
        rotate: i % 2 ? 1.5 : -1.5,
        duration: dur,
        ease: 'sine.inOut',
        yoyo: true,
        repeat: -1,
      });
    });
  });

  // ao rolar, a arte do hero desce e o texto sobe (profundidade)
  gsap.to(hero.querySelector('.hero__art'), {
    yPercent: 10,
    ease: 'none',
    scrollTrigger: { trigger: hero, start: 'top top', end: 'bottom top', scrub: true },
  });
  gsap.to(hero.querySelector('.hero__content'), {
    y: -60,
    ease: 'none',
    scrollTrigger: { trigger: hero, start: 'top top', end: 'bottom top', scrub: true },
  });
}

function heroMouse(root) {
  const hero = root.querySelector('.hero');
  if (!hero) return null;
  const items = q('[data-depth]', hero).map((el) => ({
    d: parseFloat(el.dataset.depth),
    x: gsap.quickTo(el, 'x', { duration: 0.9, ease: 'power3.out' }),
    y: gsap.quickTo(el, 'y', { duration: 0.9, ease: 'power3.out' }),
  }));
  const onMove = (e) => {
    const r = hero.getBoundingClientRect();
    if (e.clientY > r.bottom + 200) return;
    const mx = (e.clientX / window.innerWidth - 0.5) * 2;
    const my = (e.clientY / window.innerHeight - 0.5) * 2;
    items.forEach((it) => {
      it.x(mx * 28 * it.d);
      it.y(my * 20 * it.d);
    });
  };
  window.addEventListener('pointermove', onMove, { passive: true });
  return () => window.removeEventListener('pointermove', onMove);
}

/* ---------- Revelações genéricas ao rolar ---------- */
function scrollReveals(root) {
  const outsideHero = (el) => !el.closest('.hero');
  const st = (el, start = 'top 85%') => ({ trigger: el, start, once: true });

  q('[data-anim="words"]', root)
    .filter(outsideHero)
    .forEach((el) => {
      gsap.from(q('.split-word > span', el), {
        yPercent: 110,
        rotate: 4,
        duration: 1,
        ease: EASE,
        stagger: 0.07,
        scrollTrigger: st(el),
      });
    });

  q('[data-anim="fade"]', root)
    .filter(outsideHero)
    .forEach((el) => {
      gsap.from(el, { y: 24, opacity: 0, duration: 0.9, delay: 0.2, ease: EASE, scrollTrigger: st(el) });
    });

  q('.tag[data-anim="pop"], [data-anim="pop"]:not(.tag)', root)
    .filter(outsideHero)
    .forEach((el) => {
      gsap.from(el, { y: 24, scale: 0.8, opacity: 0, duration: 0.8, ease: 'back.out(1.8)', scrollTrigger: st(el, 'top 90%') });
    });

  q('[data-anim="pill"]', root).forEach((el) => {
    gsap.from(el, {
      scale: 0,
      rotate: -18,
      opacity: 0,
      duration: 0.9,
      delay: 0.3,
      ease: 'elastic.out(1, 0.55)',
      scrollTrigger: st(el, 'top 92%'),
    });
  });

  q('[data-stagger]', root).forEach((el) => {
    gsap.from(el.children, {
      y: 48,
      opacity: 0,
      duration: 0.9,
      ease: EASE,
      stagger: 0.1,
      scrollTrigger: st(el),
    });
  });

  // seção Ofertas: o bloco "cresce" ao entrar
  const offers = root.querySelector('.offers');
  if (offers) {
    gsap.from(offers, {
      scale: 0.94,
      borderRadius: 120,
      ease: 'none',
      scrollTrigger: { trigger: offers, start: 'top bottom', end: 'top 30%', scrub: 0.6 },
    });
    gsap.from(q('.offers__square, .offers__percent, .offers__pill', offers), {
      scale: 0,
      rotate: -30,
      opacity: 0,
      duration: 1,
      ease: 'back.out(1.8)',
      stagger: 0.12,
      scrollTrigger: { trigger: offers.querySelector('.offers__art'), start: 'top 75%', once: true },
    });
  }

  // footer: o card de download sobe e escala
  const dl = root.querySelector('.download');
  if (dl) {
    gsap.from(dl, {
      y: 80,
      scale: 0.95,
      ease: 'none',
      scrollTrigger: { trigger: dl, start: 'top bottom', end: 'top 40%', scrub: 0.6 },
    });
  }
}

/* ---------- Parallax e rotação atrelados ao scroll ---------- */
function parallax(root) {
  q('[data-spin]', root).forEach((el) => {
    const f = parseFloat(el.dataset.spin) || 1;
    gsap.fromTo(
      el,
      { rotate: -90 * f },
      {
        rotate: 180 * f,
        ease: 'none',
        scrollTrigger: { trigger: el, start: 'top bottom', end: 'bottom top', scrub: 0.8 },
      },
    );
  });

  q('[data-float]', root).forEach((el) => {
    const y = parseFloat(el.dataset.float) || -40;
    gsap.fromTo(
      el,
      { y: -y },
      { y, ease: 'none', scrollTrigger: { trigger: el, start: 'top bottom', end: 'bottom top', scrub: true } },
    );
  });
}

/* ---------- Escassez: colagem de produtos ---------- */
function scarcity(root) {
  const grid = root.querySelector('[data-scarcity-grid]');
  if (!grid) return;
  const tl = gsap.timeline({ scrollTrigger: { trigger: grid, start: 'top 80%', once: true } });
  tl.from(q('[data-sg="0"]', grid), { scaleY: 0, transformOrigin: '50% 100%', duration: 0.8, ease: EASE, stagger: 0.1 })
    .from(q('[data-sg="1"]', grid), { y: 60, opacity: 0, rotate: (i) => [-8, 6, 10][i], duration: 1, ease: 'back.out(1.4)', stagger: 0.12 }, 0.2)
    .from(q('[data-sg="2"]', grid), { scale: 0, rotate: -90, duration: 0.7, ease: 'back.out(2.2)', stagger: 0.1 }, 0.6);

  q('[data-sg="1"] img', grid).forEach((img, i) => {
    gsap.to(img, {
      yPercent: [-4, 4, -3][i],
      ease: 'none',
      scrollTrigger: { trigger: grid, start: 'top bottom', end: 'bottom top', scrub: true },
    });
  });
}

/* ---------- Footer: celulares em 3D ---------- */
function phones(root, desktop) {
  const box = root.querySelector('[data-phones]');
  if (!box) return;
  const p1 = box.querySelector('[data-phone="1"]');
  const p2 = box.querySelector('[data-phone="2"]');
  const rect = box.querySelector('[data-phone-rect]');
  const tl = gsap.timeline({
    scrollTrigger: { trigger: box, start: 'top 95%', end: desktop ? 'center 55%' : 'top 40%', scrub: 0.8 },
  });
  tl.from(rect, { scaleX: 0, transformOrigin: '0% 50%', ease: 'power2.out' }, 0)
    .from(p1, { rotationY: -55, rotationZ: -10, xPercent: -30, yPercent: 15, opacity: 0, ease: 'power2.out' }, 0)
    .from(p2, { rotationY: 55, rotationZ: 10, xPercent: 30, yPercent: 25, opacity: 0, ease: 'power2.out' }, 0.1);

  gsap.to(p1, { yPercent: -3, duration: 2.8, ease: 'sine.inOut', yoyo: true, repeat: -1 });
  gsap.to(p2, { yPercent: 3, duration: 3.2, ease: 'sine.inOut', yoyo: true, repeat: -1 });
}

/* ---------- Microinterações (só com ponteiro fino) ---------- */
function magnetic(root) {
  const offs = q('[data-magnetic]', root).map((el) => {
    const x = gsap.quickTo(el, 'x', { duration: 0.5, ease: 'power3.out' });
    const y = gsap.quickTo(el, 'y', { duration: 0.5, ease: 'power3.out' });
    const move = (e) => {
      const r = el.getBoundingClientRect();
      const dx = e.clientX - (r.left + r.width / 2);
      const dy = e.clientY - (r.top + r.height / 2);
      x(dx * 0.18);
      y(dy * 0.28);
      el.style.setProperty('--mx', `${e.clientX - r.left}px`);
      el.style.setProperty('--my', `${e.clientY - r.top}px`);
    };
    const leave = () => {
      x(0);
      y(0);
    };
    el.addEventListener('pointermove', move);
    el.addEventListener('pointerleave', leave);
    return () => {
      el.removeEventListener('pointermove', move);
      el.removeEventListener('pointerleave', leave);
    };
  });
  return () => offs.forEach((fn) => fn());
}

function tilt(root) {
  const offs = q('[data-tilt]', root).map((el) => {
    const rx = gsap.quickTo(el, 'rotationX', { duration: 0.6, ease: 'power3.out' });
    const ry = gsap.quickTo(el, 'rotationY', { duration: 0.6, ease: 'power3.out' });
    const media = el.querySelector('.card__media');
    const move = (e) => {
      const r = el.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width;
      const py = (e.clientY - r.top) / r.height;
      ry((px - 0.5) * 14);
      rx((0.5 - py) * 12);
      media?.style.setProperty('--gx', `${px * 100}%`);
      media?.style.setProperty('--gy', `${py * 100}%`);
    };
    const leave = () => {
      rx(0);
      ry(0);
    };
    el.addEventListener('pointermove', move);
    el.addEventListener('pointerleave', leave);
    return () => {
      el.removeEventListener('pointermove', move);
      el.removeEventListener('pointerleave', leave);
    };
  });
  return () => offs.forEach((fn) => fn());
}
