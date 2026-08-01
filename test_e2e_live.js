import https from 'https';

function testPost() {
  const data = JSON.stringify({ action: 'create_repo', repoName: 'test-app-99' });

  const req = https.request('https://nimbus-deploy-platform.pages.dev/api/github/', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(data),
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
    },
  }, (res) => {
    console.log('HTTPS Status:', res.statusCode);
    console.log('HTTPS Headers:', res.headers);
    let body = '';
    res.on('data', chunk => body += chunk);
    res.on('end', () => console.log('HTTPS Body:', body));
  });

  req.on('error', console.error);
  req.write(data);
  req.end();
}

testPost();
