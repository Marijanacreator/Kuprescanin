const {chromium}=require('C:/Users/Marijana/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const assert=require('node:assert/strict');
const output='C:/Users/Marijana/.codex/visualizations/2026/10/06/01a110c1-64ef-7e33-9388-8b5fa5e55091';
(async()=>{
 const browser=await chromium.launch({channel:'msedge',headless:true});
 const page=await browser.newPage({viewport:{width:1440,height:1000}});
 const errors=[];page.on('pageerror',e=>errors.push(e.message));page.on('console',m=>{if(m.type()==='error')errors.push(m.text());});
 await page.goto('http://127.0.0.1:4173/');
 assert.equal(await page.locator('.about-section').evaluate(s=>s.previousElementSibling.id),'usluge');
 assert.equal(await page.locator('.services-section').evaluate(s=>getComputedStyle(s).backgroundColor),'rgb(247, 247, 247)');
 assert.equal(await page.locator('.about-section').evaluate(s=>getComputedStyle(s).backgroundColor),'rgb(255, 255, 255)');
 const divider=await page.locator('.about-section').evaluate(s=>{const c=getComputedStyle(s,'::before');return {left:c.left,right:c.right,border:c.borderTopWidth};});
 assert.equal(divider.border,'1px');assert.ok(parseFloat(divider.left)>0&&parseFloat(divider.right)>0);
 const gap=await page.evaluate(()=>document.querySelector('.about-composition').getBoundingClientRect().top-document.querySelector('.service-panel:last-child').getBoundingClientRect().bottom);
 assert.ok(gap<=121,'section gap should be controlled');
 assert.equal(await page.locator('.about-section').evaluate(s=>s.classList.contains('is-visible')),false);
 await page.evaluate(()=>scrollTo(0,document.querySelector('.about-section').offsetTop));
 await page.waitForTimeout(1400);
 assert.equal(await page.locator('.about-section').evaluate(s=>s.classList.contains('is-visible')),true);
 assert.ok(await page.locator('.about-photo img').evaluateAll(images=>images.every(i=>i.complete&&i.naturalWidth>0)));
 const sizes=await page.locator('.about-photo').evaluateAll(es=>es.map(e=>({w:e.offsetWidth,h:e.offsetHeight})));
 assert.ok(sizes[0].w>sizes[1].w&&sizes[0].h>sizes[1].h);
 await page.screenshot({path:output+'/about-desktop.png'});
 await page.evaluate(()=>scrollTo(0,0));await page.waitForTimeout(100);
 assert.equal(await page.locator('#about-heading').evaluate(e=>getComputedStyle(e).opacity),'1','entrance should not reset');
 for(const width of [1024,768,760,390,320]){
  await page.setViewportSize({width,height:1000});
  await page.evaluate(()=>scrollTo(0,document.querySelector('.about-section').offsetTop));
  assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),'overflow at '+width);
  if(width===390){
   const positions=await page.locator('.about-photo').evaluateAll(es=>es.map(e=>e.getBoundingClientRect().toJSON()));
   assert.ok(positions[1].top<positions[0].bottom&&positions[0].bottom-positions[1].top<=36,'mobile images should overlap subtly');
   await page.screenshot({path:output+'/about-mobile.png'});
  }
 }
 await page.emulateMedia({reducedMotion:'reduce'});await page.reload();
 assert.equal(await page.locator('#about-heading').evaluate(e=>getComputedStyle(e).opacity),'1');
 assert.equal(await page.locator('.about-section').evaluate(s=>s.classList.contains('is-prepared')),false);
 assert.deepEqual(errors,[]);await browser.close();console.log('PASS: About section order, image sizes/loading, once-only reveal, responsive layouts, reduced motion and no console errors.');
})().catch(e=>{console.error(e);process.exit(1)});
