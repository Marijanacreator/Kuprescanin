// Independent of the hero. Replace service images and focal points here.
export const showcaseServices = [
  {title:'Registracija vozila',description:'Pripremite svoje vozilo za narednu godinu. Na jednom mestu završite potrebnu dokumentaciju za registraciju.',image:'./assets/hero%202.png',position:'50% 55%',alt:'Dokumentacija i predaja ključeva vozila'},
  {title:'Prenos vlasništva',description:'Promena vlasnika uz jednostavnije administrativne korake. Obratite nam se za pomoć oko potrebne dokumentacije.',image:'./assets/hero%203.jpg',position:'50% 50%',alt:'Predaja ključeva novom vlasniku vozila'},
  {title:'Kasko osiguranje',description:'Informišite se o kasko osiguranju za svoje vozilo i potrebnoj dokumentaciji za ugovaranje polise.',image:'./assets/hero%205.png',position:'52% 50%',alt:'Polisa kasko osiguranja i ključ automobila'},
  {title:'Probne tablice',description:'Potrebne su vam probne tablice? Obratite nam se za pripremu dokumentacije i dogovor o sledećim koracima.',image:'./assets/hero%204.png',position:'50% 55%',alt:'Vozilo sa probnim tablicama'},
  {title:'Zeleni karton',description:'Pripremite dokumentaciju za putovanje vozilom u inostranstvo. Obratite nam se za informacije o zelenom kartonu.',image:'./assets/hero%206.png',position:'45% 50%',alt:'Zeleni karton za vozilo'},
  {title:'Registracione nalepnice',description:'Završite izdavanje registracione nalepnice i prateću dokumentaciju jednostavno, na jednom mestu.',image:'./assets/hero%201.png',position:'50% 60%',alt:'Postavljanje registracione nalepnice na vetrobransko staklo'},
];

export function createServiceShowcase(section,services=showcaseServices){
  const stack=section.querySelector('.services-stack');
  const hover=matchMedia('(hover: hover) and (pointer: fine)');
  const mobile=matchMedia('(max-width: 800px)');
  let activeIndex=0;
  const controller=new AbortController(),options={signal:controller.signal};
  let hoverTimer;
  const cancelHover=()=>{clearTimeout(hoverTimer);hoverTimer=undefined;};
  const panels=services.map((service,index)=>{
    const panel=document.createElement('article');panel.className='service-panel';
    panel.innerHTML=`<button class="service-trigger" id="service-trigger-${index}" aria-expanded="false" aria-controls="service-content-${index}"><span class="service-number">${String(index+1).padStart(2,'0')}</span><span class="service-title"></span><span class="service-arrow" aria-hidden="true">↗</span></button><div class="service-details" id="service-content-${index}" role="region" aria-labelledby="service-trigger-${index}"><div class="service-body"><div class="service-text"><p></p><a class="service-more" href="#service-details" data-dialog>Saznajte više <span aria-hidden="true">↗</span></a></div></div></div><figure class="service-figure"><img loading="lazy" decoding="async"></figure>`;
    panel.querySelector('.service-title').textContent=service.title;
    const mobileHeading=document.createElement('div');
    mobileHeading.className='service-mobile-heading';
    mobileHeading.innerHTML=`<span class="service-number">${String(index+1).padStart(2,'0')}</span><h3 id="service-mobile-title-${index}"></h3>`;
    mobileHeading.querySelector('h3').textContent=service.title;
    panel.querySelector('.service-trigger').after(mobileHeading);
    panel.querySelector('.service-text p').textContent=service.description;
    panel.querySelector('.service-more').addEventListener('click',()=>{
      const dialog=document.querySelector('#service-details');
      dialog.querySelector('h2').textContent=service.title;
      dialog.querySelector('.detail-copy').textContent=service.description;
    },options);
    const image=panel.querySelector('img');image.src=service.image;image.alt=service.alt;image.style.objectPosition=service.position;
    stack.append(panel);
    panel.querySelector('.service-trigger').addEventListener('click',()=>activate(index),options);
    panel.addEventListener('pointerenter',()=>{
      cancelHover();
      if(hover.matches&&!mobile.matches)hoverTimer=setTimeout(()=>{
        if(panel.matches(':hover'))activate(index);
      },150);
    },options);
    panel.addEventListener('pointerleave',cancelHover,options);
    panel.addEventListener('focusin',()=>activate(index),options);
    panel.querySelector('.service-trigger').addEventListener('keydown',event=>{
      if(!['ArrowDown','ArrowUp','Home','End'].includes(event.key))return;
      event.preventDefault();
      const next=event.key==='Home'?0:event.key==='End'?services.length-1:(index+(event.key==='ArrowDown'?1:-1)+services.length)%services.length;
      panels[next].querySelector('.service-trigger').focus();
    },options);
    return panel;
  });
  function activate(index){
    cancelHover();
    if(mobile.matches)return;
    activeIndex=index;
    panels.forEach((panel,current)=>{
      const active=current===index;panel.classList.toggle('is-active',active);
      panel.querySelector('.service-trigger').setAttribute('aria-expanded',String(active));
      panel.querySelector('.service-details').inert=!active;
      panel.querySelector('.service-figure').setAttribute('aria-hidden',String(!active));
    });
  }
  function syncMode(){
    cancelHover();
    stack.toggleAttribute('data-swipe',mobile.matches);
    if(mobile.matches)stack.setAttribute('role','list');else stack.removeAttribute('role');
    panels.forEach((panel,index)=>{
      if(mobile.matches){
        panel.setAttribute('role','listitem');
        panel.querySelector('.service-details').inert=false;
        panel.querySelector('.service-figure').setAttribute('aria-hidden','false');
      }else panel.removeAttribute('role');
      panel.querySelector('.service-details').setAttribute('aria-labelledby',mobile.matches?`service-mobile-title-${index}`:`service-trigger-${index}`);
    });
    if(!mobile.matches)activate(activeIndex);
  }
  mobile.addEventListener('change',syncMode,options);
  stack.addEventListener('pointerleave',()=>{cancelHover();if(hover.matches&&!stack.contains(document.activeElement))activate(0);},options);
  stack.addEventListener('focusout',event=>{if(hover.matches&&!stack.contains(event.relatedTarget)&&!stack.matches(':hover'))activate(0);},options);
  syncMode();
  return{destroy(){cancelHover();controller.abort();stack.replaceChildren();}};
}
