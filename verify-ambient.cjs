const {chromium}=require('C:/Users/Marijana/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const assert=require('node:assert/strict');
(async()=>{
 const browser=await chromium.launch({channel:'msedge',headless:true});
 const page=await browser.newPage({viewport:{width:1440,height:900}});
 const errors=[];page.on('pageerror',e=>errors.push(e.message));page.on('console',m=>{if(m.type()==='error')errors.push(m.text());});
 await page.goto('http://127.0.0.1:4173');
 await page.waitForFunction(()=>document.querySelectorAll('.image-disc img').length===6&&gsap.globalTimeline.getChildren().some(t=>t.repeat?.()===-1));
 const content=await page.locator('.copy').innerHTML();
 assert.equal(await page.locator('.hero button,.navigation,.progress,.current,.total,[aria-roledescription="carousel"]').count(),0);
 await page.evaluate(()=>{
  window.ambientTimeline=gsap.globalTimeline.getChildren().find(t=>t.repeat?.()===-1);
  window.contentMutations=[];
  new MutationObserver(records=>window.contentMutations.push(...records.map(r=>r.type))).observe(document.querySelector('.copy'),{attributes:true,characterData:true,childList:true,subtree:true});
 });
 const visible=()=>page.locator('.image-disc img').evaluateAll(images=>images.map((image,index)=>({index,opacity:Number(getComputedStyle(image).opacity),z:Number(getComputedStyle(image).zIndex)})).filter(i=>i.opacity>.999).sort((a,b)=>b.z-a.z)[0]?.index);
 assert.equal(await visible(),0);
 await page.waitForTimeout(4800);assert.equal(await visible(),0,'first photograph held for five seconds');
 await page.waitForTimeout(2900);assert.equal(await visible(),1,'slow automatic transition to photograph 2');
 await page.screenshot({path:__dirname+'/ambient-desktop.png'});
 // Verify the full six-image sequence and its wraparound at production speed.
 const sequence=[1];
 for(let index=2;index<=6;index++){
  await page.waitForTimeout(7300);sequence.push(await visible());
  assert.equal(await page.locator('.copy').innerHTML(),content,'company copy and CTAs remain fixed');
 }
 assert.deepEqual(sequence,[1,2,3,4,5,0]);
 assert.deepEqual(await page.evaluate(()=>window.contentMutations),[],'no text, attribute or button mutations');
 assert.equal(await page.evaluate(()=>window.ambientTimeline.getChildren().filter(t=>t.duration()>0).every(t=>Math.abs(t.duration()-1.8)<.001)),true,'every transition takes 1.8 seconds');
 await page.locator('.copy .primary').click();assert(await page.locator('dialog').evaluate(d=>d.open));await page.keyboard.press('Escape');
 for(const [width,height] of [[1024,768],[768,1024],[390,844],[320,568],[844,390]]){
  await page.setViewportSize({width,height});await page.waitForTimeout(150);
  assert(await page.evaluate(()=>document.documentElement.scrollWidth===innerWidth),'no horizontal overflow');
  assert.equal(await page.locator('.copy').innerHTML(),content);
  await page.screenshot({path:__dirname+'/ambient-responsive-'+width+'.png'});
 }
 await page.emulateMedia({reducedMotion:'reduce'});await page.waitForTimeout(100);assert.equal(await visible(),0);
 const stopped=await page.evaluate(()=>window.ambientTimeline.time());await page.waitForTimeout(400);assert.equal(await page.evaluate(()=>window.ambientTimeline.time()),stopped);
 assert.equal(await page.locator('.hero button').count(),0);assert.deepEqual(errors,[]);
 console.log(JSON.stringify({passed:true,sequence,errors,checks:'static headline/description/CTAs, 5.5s holds, 1.8s transitions, six-image automatic loop, no carousel controls/counters, responsive layouts, reduced motion'}));
 await browser.close();
})().catch(e=>{console.error(e);process.exit(1)});

