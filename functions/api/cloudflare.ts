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

  const { action, projectName, cfToken, accountId, dbName } = body;
  const targetAccountId = accountId || '39cd6e21a6317ad90e471a9b70a463af';
  const token = env.CLOUDFLARE_TOKEN || env.CLOUDFLARE_API_TOKEN || env.CF_API_KEY || cfToken;

  if (!token) {
    return new Response(
      JSON.stringify({ 
        success: false, 
        errors: [{ message: 'Cloudflare API Token missing. Please set CLOUDFLARE_TOKEN in Cloudflare Pages Environment Secrets or in app Settings.' }] 
      }),
      { status: 400, headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' } }
    );
  }

  try {
    if (action === 'create_pages') {
      const sanitizedName = (projectName || 'cloud-app').toLowerCase().replace(/[^a-z0-9_-]/g, '-');
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
        status: 200,
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
        status: 200,
        headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
      });
    }

    return new Response(JSON.stringify({ success: true, message: 'Cloudflare Functions API Active' }), {
      status: 200,
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
    });
  } catch (err: any) {
    return new Response(
      JSON.stringify({ success: false, errors: [{ message: err.message }] }),
      { status: 500, headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' } }
    );
  }
}
