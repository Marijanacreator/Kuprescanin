const {chromium}=require('C:/Users/Marijana/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const assert=require('node:assert/strict');
const output='C:/Users/Marijana/.codex/visualizations/2026/10/06/01a110c1-64ef-7e33-9388-8b5fa5e55091';
(async()=>{
 const browser=await chromium.launch({channel:'msedge',headless:true});
 const errors=[];
 async function setup(options){const page=await browser.newPage(options);page.on('pageerror',e=>errors.push(e.message));page.on('console',m=>{if(m.type()==='error')errors.push(m.text());});await page.goto('http://127.0.0.1:4173/');return page;}
 const page=await setup({viewport:{width:1440,height:1000}});
 const active=()=>page.locator('.service-trigger[aria-expanded="true"]');
 assert.equal(await active().count(),1);
 await page.evaluate(()=>scrollTo(0,document.querySelector('.hero').offsetHeight));
 await page.waitForTimeout(1100);
 await page.screenshot({path:output+'/services-desktop.png'});
 assert.equal(await page.locator('.services-section').evaluate(e=>getComputedStyle(e).backgroundColor),'rgb(247, 247, 247)');
 assert.equal(await page.locator('.service-details').first().evaluate(e=>getComputedStyle(e).transitionDuration),'0.8s');
 const target=await page.locator('.service-trigger').nth(1).boundingBox();
 await page.mouse.move(target.x+100,target.y+30);await page.waitForTimeout(50);
 assert.equal(await active().getAttribute('id'),'service-trigger-0','hover must not activate immediately');
 await page.mouse.move(10,10);await page.waitForTimeout(200);
 assert.equal(await active().getAttribute('id'),'service-trigger-0','brief hover must be cancelled');
 for(let i=1;i<6;i++){
  await page.locator('.service-trigger').nth(i).hover();await page.waitForTimeout(1100);
  assert.equal(await active().count(),1);assert.equal(await active().getAttribute('id'),'service-trigger-'+i);
  assert.equal(await page.locator('.service-panel.is-active img').evaluate(img=>img.complete&&img.naturalWidth>0),true);
 }
 const layers=await page.locator('.service-panel').evaluateAll(p=>p.map(e=>e.getBoundingClientRect()));
 assert.ok(layers[1].top<layers[0].bottom,'panels should overlap');
 await page.mouse.move(10,10);await page.waitForTimeout(900);assert.equal(await active().getAttribute('id'),'service-trigger-0');
 await page.locator('.service-trigger').nth(0).focus();await page.keyboard.press('ArrowDown');await page.waitForTimeout(900);
 assert.equal(await active().getAttribute('id'),'service-trigger-1');
 await page.keyboard.press('Tab');assert.equal(await page.locator(':focus').textContent(),'Saznajte više ↗');
 await page.keyboard.press('Enter');assert.equal(await page.locator('#service-details').evaluate(d=>d.open),true);
 assert.equal(await page.locator('#service-details h2').textContent(),'Prenos vlasništva');await page.keyboard.press('Escape');
 await page.locator('.service-trigger').nth(5).focus();await page.keyboard.press('Home');assert.equal(await active().getAttribute('id'),'service-trigger-0');
 await page.locator('.service-trigger').nth(0).evaluate(b=>b.blur());
 for(let i=0;i<12;i++){await page.locator('.service-trigger').nth(i%6).hover();await page.waitForTimeout(80);}
 await page.waitForTimeout(1100);assert.equal(await active().count(),1);
 for(const width of [1024,768,760,390,320]){
  await page.setViewportSize({width,height:900});await page.waitForTimeout(1100);
  assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),true,'horizontal overflow at '+width);
 }
 await page.close();
 const mobile=await setup({viewport:{width:390,height:844},isMobile:true,hasTouch:true});
 await mobile.evaluate(()=>scrollTo(0,document.querySelector('.hero').offsetHeight));await mobile.waitForTimeout(1100);
 await mobile.screenshot({path:output+'/services-mobile.png'});
 for(let i=0;i<6;i++){
  await mobile.locator('.service-more').nth(i).focus();
  assert.equal(await mobile.locator('.service-details').nth(i).evaluate(e=>e.inert),false);
  const geometry=await mobile.locator('.service-panel').nth(i).evaluate(p=>({image:p.querySelector('figure').getBoundingClientRect().top,text:p.querySelector('.service-text').getBoundingClientRect().bottom}));
  assert.ok(geometry.image>=geometry.text-1,'image overlaps text on mobile');
 }
 await mobile.close();
 const reduced=await setup({viewport:{width:1440,height:1000},reducedMotion:'reduce'});
 assert.equal(await reduced.locator('.service-details').first().evaluate(e=>getComputedStyle(e).transitionDuration),'0s');await reduced.close();
 assert.deepEqual(errors,[]);await browser.close();console.log('PASS: six panels, repeated hover, reset, keyboard, service dialog, mobile taps, responsive overflow, reduced motion, images and console.');
})().catch(error=>{console.error(error);process.exit(1);});



