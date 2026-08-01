export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    // Handle CORS preflight options
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

    // 1. Cloudflare REST API Endpoint (/api/cloudflare)
    if (url.pathname === '/api/cloudflare' && request.method === 'POST') {
      try {
        const body = await request.json();
        const { action, projectName, cfToken, accountId, dbName } = body;
        const targetAccountId = accountId || '39cd6e21a6317ad90e471a9b70a463af';
        const token = env.CLOUDFLARE_TOKEN || env.CLOUDFLARE_API_TOKEN || env.CF_API_KEY || cfToken;

        if (!token) {
          return new Response(
            JSON.stringify({ success: false, errors: [{ message: 'Cloudflare API Token missing. Please set CLOUDFLARE_TOKEN in Cloudflare Pages Environment Secrets or in app Settings.' }] }),
            { status: 400, headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' } }
          );
        }

        if (action === 'create_pages') {
          const sanitizedName = projectName.toLowerCase().replace(/[^a-z0-9_-]/g, '-');
          const cfRes = await fetch(`https://api.cloudflare.com/client/v4/accounts/${targetAccountId}/pages/projects`, {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ name: sanitizedName, production_branch: 'main' }),
          });

          const cfData = await cfRes.json();
          return new Response(JSON.stringify(cfData), {
            status: cfRes.status,
            headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
          });
        }

        if (action === 'create_d1') {
          const cfRes = await fetch(`https://api.cloudflare.com/client/v4/accounts/${targetAccountId}/d1/database`, {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ name: dbName || `${projectName}_db` }),
          });

          const cfData = await cfRes.json();
          return new Response(JSON.stringify(cfData), {
            status: cfRes.status,
            headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
          });
        }
      } catch (err) {
        return new Response(
          JSON.stringify({ success: false, errors: [{ message: err.message }] }),
          { status: 500, headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' } }
        );
      }
    }

    // 2. GitHub REST API Endpoint (/api/github)
    if (url.pathname === '/api/github' && request.method === 'POST') {
      try {
        const body = await request.json();
        const { action, repoName, githubToken, githubOwner } = body;
        const token = env.GH_PAT_TOKEN || env.GH_TOKEN || env.GH_ACCESS_TOKEN || githubToken;
        const owner = githubOwner || 'arunkabish1';

        if (!token) {
          return new Response(
            JSON.stringify({ success: false, message: 'GitHub Token missing. Please set GH_PAT_TOKEN or GH_TOKEN in Cloudflare Pages Environment Secrets or in app Settings.' }),
            { status: 400, headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' } }
          );
        }

        if (action === 'create_repo') {
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
        }
      } catch (err) {
        return new Response(
          JSON.stringify({ success: false, message: err.message }),
          { status: 500, headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' } }
        );
      }
    }

    // Default static asset router
    return env.ASSETS.fetch(request);
  },
};
