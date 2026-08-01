async function testE2EText() {
  console.log('Testing with Browser User-Agent header...');
  const res = await fetch('https://nimbus-deploy-platform.pages.dev/api/github', {
    method: 'POST',
    headers: { 
      'Content-Type': 'application/json',
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    },
    body: JSON.stringify({ action: 'create_repo', repoName: 'test-app-99' }),
  });

  console.log('Status:', res.status);
  const text = await res.text();
  console.log('Raw Body:', text);
}

testE2EText().catch(console.error);
