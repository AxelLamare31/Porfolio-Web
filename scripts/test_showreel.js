const puppeteer = require('puppeteer');
(async ()=>{
  const browser = await puppeteer.launch({args:['--no-sandbox','--disable-setuid-sandbox']});
  const page = await browser.newPage();
  page.setDefaultTimeout(15000);
  await page.goto('http://127.0.0.1:8000', {waitUntil:'networkidle2'});

  const res = {errors:[]};
  const hasVideo = await page.$('#showreelVideo') !== null;
  if(!hasVideo){ res.errors.push('Element #showreelVideo absent'); }

  const info = await page.evaluate(()=>{
    const v = document.getElementById('showreelVideo');
    return {
      exists: !!v,
      muted: v ? v.muted : null,
      paused: v ? v.paused : null,
      readyState: v ? v.readyState : null,
      currentTime: v ? v.currentTime : null
    };
  });

  console.log('Initial video state:', info);
  if(!info.exists) res.errors.push('Video absent');
  if(info.muted !== true) res.errors.push('Video should be muted by default');

  // Click mute toggle
  const btn = await page.$('#muteToggle');
  if(!btn) res.errors.push('Mute toggle absent');
  else{
    await btn.click();
    await new Promise(r => setTimeout(r, 500));
    const mutedAfter = await page.evaluate(()=>document.getElementById('showreelVideo').muted);
    console.log('Muted after toggle:', mutedAfter);
    if(mutedAfter !== false) res.errors.push('Toggle did not unmute the video');
  }

  // Click video to re-mute/unmute behaviour test: first mute again then click
  await page.evaluate(()=>{ document.getElementById('showreelVideo').muted = true; });
  await page.click('#showreelVideo');
  await new Promise(r => setTimeout(r, 500));
  const mutedClick = await page.evaluate(()=>document.getElementById('showreelVideo').muted);
  console.log('Muted after clicking video (should be false):', mutedClick);
  if(mutedClick !== false) res.errors.push('Clicking video did not unmute');

  // check play state
  const paused = await page.evaluate(()=>document.getElementById('showreelVideo').paused);
  console.log('Paused state:', paused);
  if(paused) res.errors.push('Video is paused (should be playing)');

  // check rendered aspect ratio (width/height ≈ 9/16 = 0.5625)
  const ratio = await page.evaluate(()=>{
    const v = document.getElementById('showreelVideo');
    if(!v) return null;
    const r = v.getBoundingClientRect();
    return r.width / r.height;
  });
  console.log('Rendered aspect ratio:', ratio);
  if(!ratio || Math.abs(ratio - (9/16)) > 0.03) res.errors.push('Rendered aspect ratio is incorrect (not ~9:16)');

  if(res.errors.length){
    console.error('TEST FAILED:', res.errors);
    await browser.close();
    process.exit(1);
  }
  console.log('TEST PASSED');
  await browser.close();
  process.exit(0);
})();