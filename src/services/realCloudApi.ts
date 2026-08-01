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

// 1. Create Real GitHub Repository via GitHub REST API
export async function createRealGitHubRepo(
  repoName: string,
  config: RealApiConfig
): Promise<RealExecutionResult> {
  if (!config.githubToken) {
    return {
      success: false,
      message: 'GitHub Personal Access Token not set. Please add token in Settings.',
    };
  }

  try {
    const response = await fetch('https://api.github.com/user/repos', {
      method: 'POST',
      headers: {
        'Authorization': `token ${config.githubToken}`,
        'Accept': 'application/vnd.github.v3+json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: repoName,
        description: `Deployed via Nimbus Orchestration Engine (${config.githubOwner}/${repoName})`,
        private: false,
        auto_init: true,
      }),
    });

    const data = await response.json();

    if (response.ok || response.status === 422) { // 422 means repo already exists
      return {
        success: true,
        message: response.status === 422 
          ? `Repository 'github.com/${config.githubOwner}/${repoName}' already exists.`
          : `Created GitHub repository 'github.com/${config.githubOwner}/${repoName}'`,
        details: data,
      };
    } else {
      return {
        success: false,
        message: `GitHub API Error (${response.status}): ${data.message || 'Failed to create repo'}`,
      };
    }
  } catch (err: any) {
    return {
      success: false,
      message: `Network error connecting to GitHub API: ${err.message}`,
    };
  }
}

// 2. Create Real Cloudflare Pages Project via Cloudflare REST API
export async function createRealCloudflarePages(
  projectName: string,
  config: RealApiConfig
): Promise<RealExecutionResult> {
  if (!config.cloudflareToken) {
    return {
      success: false,
      message: 'Cloudflare API Token not set. Please add API Token in Settings.',
    };
  }

  const sanitizedName = projectName.toLowerCase().replace(/[^a-z0-9_-]/g, '-');
  const url = `https://api.cloudflare.com/client/v4/accounts/${config.cloudflareAccountId}/pages/projects`;

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${config.cloudflareToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: sanitizedName,
        production_branch: 'main',
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
      const errMsg = data.errors ? data.errors.map((e: any) => e.message).join(', ') : 'Failed to create project';
      return {
        success: false,
        message: `Cloudflare API Error: ${errMsg}`,
      };
    }
  } catch (err: any) {
    return {
      success: false,
      message: `Network error connecting to Cloudflare API: ${err.message}`,
    };
  }
}

// 3. Create Real Cloudflare D1 Database
export async function createRealCloudflareD1(
  dbName: string,
  config: RealApiConfig
): Promise<RealExecutionResult> {
  if (!config.cloudflareToken) {
    return { success: false, message: 'Cloudflare API Token not set.' };
  }

  const url = `https://api.cloudflare.com/client/v4/accounts/${config.cloudflareAccountId}/d1/database`;

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${config.cloudflareToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name: dbName }),
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
