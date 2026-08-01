async function testE2EText() {
  console.log('Testing raw HTTP status and text...');
  const res = await fetch('https://nimbus-deploy-platform.pages.dev/api/github', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ action: 'create_repo', repoName: 'test-app-99' }),
  });

  console.log('Status:', res.status);
  const text = await res.text();
  console.log('Raw Body:', text);
}

testE2EText().catch(console.error);
