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
    const { action, projectName, cfToken, accountId, dbName } = body;

    const targetAccountId = accountId || '39cd6e21a6317ad90e471a9b70a463af';
    // Use server-side secret if available, fallback to client-passed token
    const token = context.env.CLOUDFLARE_API_TOKEN || cfToken;

    if (!token) {
      return new Response(
        JSON.stringify({ 
          success: false, 
          errors: [{ message: 'Cloudflare API Token missing. Please add CLOUDFLARE_API_TOKEN in Cloudflare Pages Environment Secrets or in the app Settings.' }] 
        }),
        { status: 400, headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' } }
      );
    }

    if (action === 'create_pages') {
      const sanitizedName = projectName.toLowerCase().replace(/[^a-z0-9_-]/g, '-');
      const cfUrl = `https://api.cloudflare.com/client/v4/accounts/${targetAccountId}/pages/projects`;
      
      const cfResponse = await fetch(cfUrl, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: sanitizedName,
          production_branch: 'main',
        }),
      });

      const cfData: any = await cfResponse.json();

      return new Response(JSON.stringify(cfData), {
        status: cfResponse.status,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
      });
    }

    if (action === 'create_d1') {
      const cfUrl = `https://api.cloudflare.com/client/v4/accounts/${targetAccountId}/d1/database`;
      const cfResponse = await fetch(cfUrl, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: dbName || `${projectName}_db` }),
      });

      const cfData: any = await cfResponse.json();

      return new Response(JSON.stringify(cfData), {
        status: cfResponse.status,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
      });
    }

    return new Response(JSON.stringify({ error: 'Unknown action' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
    });

  } catch (err: any) {
    return new Response(JSON.stringify({ success: false, errors: [{ message: err.message }] }), {
      status: 500,
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
    });
  }
}
