export class AmbientPhotography {
  constructor(hero, mask, images) {
    this.hero = hero;
    this.mask = mask;
    this.images = images;
    this.hold = 5.5;
    this.transition = 1.8;
    this.motion = matchMedia('(prefers-reduced-motion: reduce)');
    this.timeline = gsap.timeline({ paused: true, repeat: -1 });
    this.resize = new ResizeObserver(() => this.positionMask());
    this.resize.observe(hero);
    this.onMotionChange = () => this.updateMotion(true);
    this.onVisibilityChange = () => this.updateMotion();
    this.motion.addEventListener('change', this.onMotionChange);
    document.addEventListener('visibilitychange', this.onVisibilityChange);
    this.positionMask();
    this.resetImages();
    if (images.length > 1) {
      images.forEach((outgoing, index) => {
        const incoming = images[(index + 1) % images.length];
        const start = index * (this.hold + this.transition) + this.hold;
        this.timeline.set(incoming, { opacity: 0, zIndex: 2 }, start)
          .set(outgoing, { opacity: 1, zIndex: 1 }, start)
          .to(incoming, { opacity: 1, duration: this.transition, ease: 'power2.inOut' }, start)
          .set(outgoing, { opacity: 0 }, start + this.transition);
      });
    }
    this.updateMotion();
  }
  positionMask() {
    if (matchMedia('(max-width: 430px)').matches) {
      gsap.set(this.mask, { x: 0, force3D: true });
      this.mask.style.setProperty('--mobile-photo-top', '0px');
      this.mask.style.setProperty('--mobile-photo-height', `${this.hero.clientHeight}px`);
      this.images.forEach(image => {
        if (image.dataset.phoneSubject === undefined) return;
        const coverWidth = Math.max(this.hero.clientWidth, this.hero.clientHeight * image.naturalWidth / image.naturalHeight);
        const crop = coverWidth - this.hero.clientWidth;
        if (crop > 0) {
          const position = (coverWidth * Number(image.dataset.phoneSubject) - this.hero.clientWidth * Number(image.dataset.phoneTarget)) / crop;
          image.style.setProperty('--phone-focal-point', `${position * 100}% 50%`);
        }
      });
      return;
    }
    const radius = this.mask.offsetWidth / 2;
    const centerY = this.mask.getBoundingClientRect().top - this.hero.getBoundingClientRect().top + radius;
    const dy = this.hero.clientHeight / 2 - centerY;
    const curveInset = radius - Math.sqrt(Math.max(0, radius * radius - dy * dy));
    const mobile = matchMedia('(max-width: 800px)').matches;
    gsap.set(this.mask, { x: this.hero.clientWidth * (mobile ? .56 : .48) - curveInset, force3D: true });
    if (mobile) {
      // Keep cover photography aligned with the actual content-driven hero,
      // independent of browser chrome and the phone's viewport height.
      this.mask.style.setProperty('--mobile-photo-top', `${radius - centerY}px`);
      this.mask.style.setProperty('--mobile-photo-height', `${this.hero.clientHeight}px`);
    }
  }
  resetImages() {
    this.images.forEach((image, index) => gsap.set(image, { opacity: index === 0 ? 1 : 0, zIndex: 1 }));
  }
  updateMotion(restart = false) {
    if (this.motion.matches) {
      this.timeline.pause(0);
      this.resetImages();
    } else if (this.images.length > 1) {
      if (restart) { this.timeline.pause(0); this.resetImages(); }
      this.timeline.paused(document.hidden);
    }
  }
  destroy() {
    this.timeline.kill();
    this.resize.disconnect();
    this.motion.removeEventListener('change', this.onMotionChange);
    document.removeEventListener('visibilitychange', this.onVisibilityChange);
  }
}
