const https = require('https');
https.get('https://frontechonline.com/products/frontech-ultima-series-24-5-inch-full-hd-led-monitor-1920x1080-100hz-5ms-va-panel-hdmi-vga-flicker-free-low-blue-light-freesync-3-year-limited-warranty-mon-0087v', {
  headers: { 'User-Agent': 'Mozilla/5.0' }
}, res => {
  let d = '';
  res.on('data', c => d += c);
  res.on('end', () => {
    console.log('HTML size:', d.length);
    console.log('Has judge.me:', d.includes('judgeme') || d.includes('judge.me'));
    console.log('Has loox:', d.includes('loox'));
    console.log('Has yotpo:', d.includes('yotpo'));
    console.log('Has stamped:', d.includes('stamped'));
    console.log('Has air-reviews:', d.includes('air-reviews'));
    console.log('Has okendo:', d.includes('okendo'));
    
    // search for any script mentioning review
    const scriptMatches = d.match(/src="[^"]*review[^"]*"/gi) || [];
    console.log('Review scripts:', scriptMatches);
  });
});
