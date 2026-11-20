// Converte os PNGs exportados do Figma para WebP otimizados (mantém os originais fora do build).
import sharp from 'sharp';
import { readdirSync, mkdirSync, renameSync, existsSync } from 'node:fs';
import { join } from 'node:path';

const dir = 'public/assets';
const raw = 'assets-src';
const maxWidth = {
  'hero-drink': 800, 'hero-burger': 600, 'hero-scooter': 1400, 'hero-box': 1100,
  'delivery-man': 2048, 'esc-pizza': 700, 'esc-broccoli': 900, 'esc-bottle': 1400,
  'phone-1': 1024, 'phone-2': 1600,
};
if (!existsSync(raw)) mkdirSync(raw);
for (const f of readdirSync(dir).filter((f) => f.endsWith('.png'))) {
  const name = f.replace('.png', '');
  await sharp(join(dir, f))
    .resize({ width: maxWidth[name] ?? 1200, withoutEnlargement: true })
    .webp({ quality: 82, alphaQuality: 90 })
    .toFile(join(dir, `${name}.webp`));
  renameSync(join(dir, f), join(raw, f));
  console.log('ok', name);
}
