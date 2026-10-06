const {chromium}=require('C:/Users/Marijana/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const fs=require('node:fs');
(async()=>{
 const browser=await chromium.launch({channel:'msedge',headless:true});
 const page=await browser.newPage({viewport:{width:1280,height:800}});
 await page.route('http://reference.local/video.mp4',r=>r.fulfill({contentType:'video/mp4',headers:{'Access-Control-Allow-Origin':'*'},body:fs.readFileSync('C:/Users/Marijana/Videos/Screen Recordings/Screen Recording 2026-10-06 115954.mp4')}));
 await page.setContent('<video crossorigin="anonymous" muted src="http://reference.local/video.mp4"></video><canvas width="1600" height="720"></canvas>');
 await page.waitForFunction(()=>document.querySelector('video').readyState>=2);
 await page.evaluate(async()=>{
  const v=document.querySelector('video'),c=document.querySelector('canvas'),ctx=c.getContext('2d');
  for(let i=0;i<20;i++){
   const time=.15+i*1.45;v.currentTime=time;await new Promise(r=>v.addEventListener('seeked',r,{once:true}));
   const x=(i%4)*400,y=Math.floor(i/4)*144,height=400*v.videoHeight/v.videoWidth;
   ctx.drawImage(v,x,y,400,height);ctx.fillStyle='#fff';ctx.fillRect(x,y+height,400,144-height);ctx.fillStyle='#000';ctx.font='18px Arial';ctx.fillText(time.toFixed(2)+' seconds',x+10,y+height+24);
  }
 });
 fs.writeFileSync(__dirname+'/reference-sheet.png',Buffer.from(await page.locator('canvas').evaluate(c=>c.toDataURL().split(',')[1]),'base64'));
 console.log(await page.locator('video').evaluate(v=>({width:v.videoWidth,height:v.videoHeight,duration:v.duration})));
 await browser.close();
})();

