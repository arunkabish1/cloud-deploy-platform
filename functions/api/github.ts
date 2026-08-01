export async function onRequest(context: any) {
  if (context.request.method === 'OPTIONS') {
    return new Response(null, {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      },
    });
  }

  if (context.request.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), { status: 405 });
  }

  try {
    const body = await context.request.json();
    const { action, repoName, githubToken, githubOwner } = body;

    // Use server-side secret if available, fallback to client-passed token
    const token = context.env.GITHUB_TOKEN || githubToken;
    const owner = githubOwner || 'arunkabish1';

    if (!token) {
      return new Response(
        JSON.stringify({ 
          success: false, 
          message: 'GitHub Token missing. Please add GITHUB_TOKEN in Cloudflare Pages Environment Secrets or in the app Settings.' 
        }),
        { status: 400, headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' } }
      );
    }

    if (action === 'create_repo') {
      const sanitizedName = repoName.toLowerCase().replace(/[^a-z0-9_-]/g, '-');
      const ghUrl = 'https://api.github.com/user/repos';
      
      const ghResponse = await fetch(ghUrl, {
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

      const ghData: any = await ghResponse.json();

      if (ghResponse.ok || ghResponse.status === 422) {
        return new Response(
          JSON.stringify({
            success: true,
            message: ghResponse.status === 422 
              ? `Repository 'github.com/${owner}/${sanitizedName}' already exists.`
              : `Created GitHub repository 'github.com/${owner}/${sanitizedName}'`,
            details: ghData,
          }),
          {
            status: 200,
            headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
          }
        );
      } else {
        return new Response(
          JSON.stringify({
            success: false,
            message: `GitHub API Error (${ghResponse.status}): ${ghData.message || 'Failed to create repository'}`,
            details: ghData,
          }),
          {
            status: ghResponse.status,
            headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
          }
        );
      }
    }

    return new Response(JSON.stringify({ error: 'Unknown action' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
    });

  } catch (err: any) {
    return new Response(
      JSON.stringify({ success: false, message: `GitHub Proxy Error: ${err.message}` }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
      }
    );
  }
}
