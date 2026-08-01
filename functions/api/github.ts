export async function onRequest(context: any) {
  const { request, env } = context;

  // Handle CORS preflight
  if (request.method === 'OPTIONS') {
    return new Response(null, {
      status: 204,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      },
    });
  }

  let body: any = {};
  try {
    const text = await request.text();
    body = JSON.parse(text);
  } catch (e) {
    body = {};
  }

  const token = env.GH_PAT_TOKEN || env.GH_TOKEN || env.GH_ACCESS_TOKEN || body.githubToken;
  const owner = body.githubOwner || 'arunkabish1';
  const repoName = body.repoName || 'cloud-repo';

  if (!token) {
    return new Response(
      JSON.stringify({ 
        success: false, 
        message: 'GitHub Token missing. Please set GH_PAT_TOKEN or GH_TOKEN in Cloudflare Pages Environment Secrets or in app Settings.' 
      }),
      { status: 400, headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' } }
    );
  }

  try {
    const sanitizedName = repoName.toLowerCase().replace(/[^a-z0-9_-]/g, '-');
    const ghRes = await fetch('https://api.github.com/user/repos', {
      method: 'POST',
      headers: {
        'Authorization': token.startsWith('ghp_') || token.startsWith('github_pat_') ? `Bearer ${token}` : `token ${token}`,
        'Accept': 'application/vnd.github.v3+json',
        'Content-Type': 'application/json',
        'User-Agent': 'Nimbus-Deploy-Platform/1.0',
      },
      body: JSON.stringify({
        name: sanitizedName,
        description: `Deployed via Nimbus Orchestration Engine (${owner}/${sanitizedName})`,
        private: false,
        auto_init: true,
      }),
    });

    const ghData = await ghRes.json();
    return new Response(
      JSON.stringify({
        success: ghRes.ok || ghRes.status === 422,
        message: ghRes.status === 422
          ? `Repository 'github.com/${owner}/${sanitizedName}' already exists.`
          : `Created GitHub repository 'github.com/${owner}/${sanitizedName}'`,
        details: ghData,
      }),
      { status: 200, headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' } }
    );
  } catch (err: any) {
    return new Response(
      JSON.stringify({ success: false, message: err.message }),
      { status: 500, headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' } }
    );
  }
}
