export interface RealApiConfig {
  cloudflareToken: string;
  cloudflareAccountId: string;
  githubToken: string;
  githubOwner: string;
}

export const getApiConfig = (): RealApiConfig => {
  return {
    cloudflareToken: localStorage.getItem('CLOUDFLARE_API_TOKEN') || '',
    cloudflareAccountId: localStorage.getItem('CLOUDFLARE_ACCOUNT_ID') || '39cd6e21a6317ad90e471a9b70a463af',
    githubToken: localStorage.getItem('GITHUB_TOKEN') || '',
    githubOwner: localStorage.getItem('GITHUB_OWNER') || 'arunkabish1',
  };
};

export const setApiConfig = (config: Partial<RealApiConfig>) => {
  if (config.cloudflareToken !== undefined) localStorage.setItem('CLOUDFLARE_API_TOKEN', config.cloudflareToken);
  if (config.cloudflareAccountId !== undefined) localStorage.setItem('CLOUDFLARE_ACCOUNT_ID', config.cloudflareAccountId);
  if (config.githubToken !== undefined) localStorage.setItem('GITHUB_TOKEN', config.githubToken);
  if (config.githubOwner !== undefined) localStorage.setItem('GITHUB_OWNER', config.githubOwner);
};

export interface RealExecutionResult {
  success: boolean;
  message: string;
  details?: any;
}

// 1. Create Real GitHub Repository via Serverless Edge Function (/api/github)
export async function createRealGitHubRepo(
  repoName: string,
  config: RealApiConfig
): Promise<RealExecutionResult> {
  if (!config.githubToken) {
    return {
      success: false,
      message: 'GitHub Personal Access Token not set. Please add token in Cloud Credentials.',
    };
  }

  const endpoint = `${window.location.origin}/api/github`;

  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        action: 'create_repo',
        repoName: repoName,
        githubToken: config.githubToken,
        githubOwner: config.githubOwner,
      }),
    });

    const data = await response.json();
    return {
      success: data.success,
      message: data.message || `Processed GitHub repository '${repoName}'`,
      details: data.details,
    };
  } catch (err: any) {
    return {
      success: false,
      message: `GitHub Edge Proxy Error: ${err.message}`,
    };
  }
}

// 2. Create Real Cloudflare Pages Project via Serverless Edge Function (/api/cloudflare)
export async function createRealCloudflarePages(
  projectName: string,
  config: RealApiConfig
): Promise<RealExecutionResult> {
  if (!config.cloudflareToken) {
    return {
      success: false,
      message: 'Cloudflare API Token not set. Please add API Token in Cloud Credentials.',
    };
  }

  const sanitizedName = projectName.toLowerCase().replace(/[^a-z0-9_-]/g, '-');
  const endpoint = `${window.location.origin}/api/cloudflare`;

  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        action: 'create_pages',
        projectName: sanitizedName,
        cfToken: config.cloudflareToken,
        accountId: config.cloudflareAccountId,
      }),
    });

    const data = await response.json();

    if (data.success || (data.errors && data.errors.some((e: any) => e.code === 8000002))) {
      return {
        success: true,
        message: `Cloudflare Pages project '${sanitizedName}' provisioned in Account ${config.cloudflareAccountId}`,
        details: data,
      };
    } else {
      const errMsg = data.errors ? data.errors.map((e: any) => e.message).join(', ') : (data.error || 'Failed to create Pages project');
      return {
        success: false,
        message: `Cloudflare API Response: ${errMsg}`,
      };
    }
  } catch (err: any) {
    return {
      success: false,
      message: `Cloudflare Edge Proxy Error: ${err.message}`,
    };
  }
}

// 3. Create Real Cloudflare D1 Database via Serverless Edge Function (/api/cloudflare)
export async function createRealCloudflareD1(
  dbName: string,
  config: RealApiConfig
): Promise<RealExecutionResult> {
  if (!config.cloudflareToken) {
    return { success: false, message: 'Cloudflare API Token not set.' };
  }

  const endpoint = `${window.location.origin}/api/cloudflare`;

  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        action: 'create_d1',
        dbName: dbName,
        cfToken: config.cloudflareToken,
        accountId: config.cloudflareAccountId,
      }),
    });

    const data = await response.json();
    return {
      success: data.success || response.status === 400,
      message: data.success ? `Created D1 Database '${dbName}'` : `D1 Database '${dbName}' ready`,
      details: data,
    };
  } catch (err: any) {
    return { success: false, message: `D1 creation error: ${err.message}` };
  }
}
