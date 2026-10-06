import { serviceImages } from './services.js';
import { AmbientPhotography } from './animation.js';
import { createServiceShowcase } from './service-showcase.js';
import { createAboutEntrance } from './about-section.js';

export async function createAmbientHero(hero, photos) {
  const mask = hero.querySelector('.image-disc');
  // Keep the initial image visible while decoding the entire sequence. Failed
  // replacement files are skipped; the company content never depends on them.
  const prepared = await Promise.all(photos.map(async photo => {
    const image = new Image();
    image.alt = '';
    image.src = photo.image;
    image.style.objectPosition = photo.imagePosition || 'center';
    image.style.setProperty('--mobile-focal-point', photo.mobilePosition || photo.imagePosition || 'center');
    try { await image.decode(); return image; } catch { return null; }
  }));
  const images = prepared.filter(Boolean);
  if (!images.length) return { destroy() {} };
  mask.replaceChildren(...images);
  return new AmbientPhotography(hero, mask, images);
}

createAmbientHero(document.querySelector('.hero'), serviceImages);
createServiceShowcase(document.querySelector('.services-section'));
createAboutEntrance(document.querySelector('.about-section'));

const menuToggle = document.querySelector('.menu-toggle');
const navigation = document.querySelector('.navbar');
function closeMenu() { menuToggle.setAttribute('aria-expanded', 'false'); }
menuToggle.addEventListener('click', () => {
  menuToggle.setAttribute('aria-expanded', String(menuToggle.getAttribute('aria-expanded') !== 'true'));
});
navigation.addEventListener('click', event => { if (event.target.closest('a')) closeMenu(); });
document.addEventListener('keydown', event => { if (event.key === 'Escape') closeMenu(); });
document.querySelectorAll('[data-dialog]').forEach(link => link.addEventListener('click', event => {
  event.preventDefault();
  document.querySelector(link.getAttribute('href')).showModal();
}));
document.querySelectorAll('dialog').forEach(dialog => {
  dialog.querySelector('.close-dialog').addEventListener('click', () => dialog.close());
  dialog.addEventListener('click', event => {
    if (event.target !== dialog) return;
    const bounds = dialog.getBoundingClientRect();
    if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) dialog.close();
  });
});
