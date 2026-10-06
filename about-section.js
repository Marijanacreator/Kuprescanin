// A single, restrained entrance, independent of hero and service interactions.
export function createAboutEntrance(section) {
  const motion = matchMedia('(prefers-reduced-motion: reduce)');
  if (motion.matches || !('IntersectionObserver' in window)) return { destroy() {} };
  section.classList.add('is-prepared');
  const reveal = () => {
    section.classList.add('is-visible');
    observer.disconnect();
    motion.removeEventListener('change', onMotionChange);
  };
  const observer = new IntersectionObserver(entries => {
    if (entries.some(entry => entry.isIntersecting)) reveal();
  }, { threshold: 0.12 });
  const onMotionChange = event => { if (event.matches) reveal(); };
  motion.addEventListener('change', onMotionChange);
  observer.observe(section);
  return { destroy() {
    observer.disconnect();
    motion.removeEventListener('change', onMotionChange);
    section.classList.remove('is-prepared', 'is-visible');
  } };
}
