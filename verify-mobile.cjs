const {chromium}=require('C:/Users/Marijana/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const assert=require('node:assert/strict');
const output='C:/Users/Marijana/.codex/visualizations/2026/10/06/01a110c1-64ef-7e33-9388-8b5fa5e55091';
(async()=>{
 const browser=await chromium.launch({channel:'msedge',headless:true});
 const errors=[];
 for(const [width,height] of [[320,568],[360,800],[375,812],[390,844],[430,932],[768,1024]]){
  const page=await browser.newPage({viewport:{width,height},isMobile:true,hasTouch:true,reducedMotion:'reduce'});
  page.on('pageerror',e=>errors.push(e.message));page.on('console',m=>{if(m.type()==='error')errors.push(m.text());});
  await page.goto('http://127.0.0.1:4173/');await page.waitForFunction(()=>document.querySelectorAll('.image-disc img').length===6);
  const layout=await page.evaluate(()=>{
   const box=e=>e.getBoundingClientRect().toJSON(),hero=document.querySelector('.hero'),headline=document.querySelector('h1');
   return {width:document.documentElement.scrollWidth,hero:box(hero),headline:box(headline),headlineLine:parseFloat(getComputedStyle(headline).lineHeight),description:box(document.querySelector('.description')),buttons:[...document.querySelectorAll('.actions a')].map(box),images:[...document.querySelectorAll('.image-disc img')].map(box),cards:[...document.querySelectorAll('.service-panel')].map(box),snap:getComputedStyle(document.querySelector('.services-stack')).scrollSnapType,inert:[...document.querySelectorAll('.service-details')].some(e=>e.inert)};
  });
  assert.equal(layout.width,width,'overflow at '+width);
  assert.equal(layout.hero.height,680);assert.ok(layout.headline.height<=layout.headlineLine*2+1,'headline wraps beyond two lines at '+width);
  assert.ok(layout.description.top>=layout.headline.bottom);
  assert.ok(layout.buttons.every(b=>b.height>=44&&b.left>=0&&b.right<=width));
  assert.ok(Math.abs(layout.hero.bottom-Math.max(...layout.buttons.map(b=>b.bottom))-64)<1);
  assert.ok(layout.images.every(i=>Math.abs(i.top)<1&&i.height===layout.hero.height),'photos must fill hero height');
  assert.ok(layout.cards.every(c=>c.width<width));assert.equal(layout.snap,'x mandatory');assert.equal(layout.inert,false);
  assert.ok(Math.max(...layout.cards.map(c=>c.height))-Math.min(...layout.cards.map(c=>c.height))<1);
  await page.locator('.menu-toggle').tap();assert.equal(await page.locator('.navbar').isVisible(),true);await page.keyboard.press('Escape');
  await page.locator('.services-stack').scrollIntoViewIfNeeded();
  await page.locator('.services-stack').evaluate(e=>e.scrollTo({left:350}));await page.waitForTimeout(350);
  assert.ok(await page.locator('.services-stack').evaluate(e=>e.scrollLeft>100));
  await page.locator('.service-more').nth(5).focus();assert.equal(await page.locator('.service-more').nth(5).evaluate(e=>document.activeElement===e),true);
  await page.keyboard.press('Enter');assert.equal(await page.locator('#service-details h2').textContent(),'Registracione nalepnice');await page.keyboard.press('Escape');
  await page.locator('.about-section').scrollIntoViewIfNeeded();await page.waitForFunction(()=>[...document.querySelectorAll('.about-photo img')].every(i=>i.complete&&i.naturalWidth));
  const about=await page.evaluate(()=>{const r=s=>document.querySelector(s).getBoundingClientRect();return {main:r('.about-photo-main').toJSON(),detail:r('.about-photo-detail').toJSON(),divider:r('.about-information').top};});
  assert.ok(about.main.bottom-about.detail.top>=23&&about.main.bottom-about.detail.top<=37);
  assert.ok(about.detail.width/about.main.width>.59&&about.detail.width/about.main.width<.61);
  assert.ok(about.divider>=about.detail.bottom+30);
  await page.evaluate(()=>scrollTo(0,0));await page.locator('.services-stack').evaluate(e=>e.scrollTo({left:0}));await page.waitForTimeout(250);
  await page.screenshot({path:output+`/mobile-${width}.png`,fullPage:true});
  if(width===390){
   for(let i=0;i<6;i++){
    await page.evaluate(index=>document.querySelectorAll('.image-disc img').forEach((img,j)=>{img.style.opacity=String(index===j?1:0);img.style.zIndex='1'}),i);
    await page.locator('.hero').screenshot({path:output+`/mobile-hero-photo-${i+1}.png`});
   }
  }
  console.log('PASS mobile '+width+'×'+height);await page.close();
 }
 const desktop=await browser.newPage({viewport:{width:1440,height:1000},reducedMotion:'reduce'});
 await desktop.goto('http://127.0.0.1:4173/');await desktop.screenshot({path:output+'/desktop-after.png',fullPage:true});
 assert.equal(await desktop.locator('.service-trigger[aria-expanded=true]').count(),1);
 await desktop.locator('.service-trigger').nth(2).hover();await desktop.waitForTimeout(250);assert.equal(await desktop.locator('.service-trigger[aria-expanded=true]').getAttribute('id'),'service-trigger-2');
 assert.deepEqual(errors,[]);await browser.close();console.log('PASS desktop hover and mobile console checks');
})().catch(e=>{console.error(e);process.exit(1)});
