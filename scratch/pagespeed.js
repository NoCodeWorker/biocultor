import https from 'https';

https.get('https://www.googleapis.com/pagespeedonline/v5/runPagespeed?url=https://biocultor.com&strategy=mobile', (res) => {
  let data = '';
  res.on('data', (chunk) => { data += chunk; });
  res.on('end', () => {
    import('fs').then(fs => {
        fs.writeFileSync('pagespeed_raw.json', data);
        console.log('Saved to pagespeed_raw.json');
    });
  });
}).on('error', (e) => {
  console.error(e);
});
