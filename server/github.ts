// GitHub Integration for ZipShip
// Uses user-specific OAuth tokens stored in database

import { Octokit } from '@octokit/rest';
import { storage } from './storage';

// GitHub OAuth configuration
export const GITHUB_CLIENT_ID = process.env.GITHUB_CLIENT_ID;
export const GITHUB_CLIENT_SECRET = process.env.GITHUB_CLIENT_SECRET;

export function getGitHubAuthUrl(state: string, baseUrl?: string): string {
  // Use provided baseUrl or fall back to environment/default
  // IMPORTANT: This must match the GitHub OAuth callback URL registered in GitHub
  const callbackBaseUrl = baseUrl || process.env.APP_URL || 'https://zip-ship.replit.app';
  
  const params = new URLSearchParams({
    client_id: GITHUB_CLIENT_ID || '',
    redirect_uri: `${callbackBaseUrl}/api/github/callback`,
    scope: 'repo',
    state,
    // Force GitHub to show account selection screen every time
    prompt: 'consent',
    login: '',
  });
  
  console.log('GitHub OAuth redirect_uri:', `${callbackBaseUrl}/api/github/callback`);
  return `https://github.com/login/oauth/authorize?${params.toString()}`;
}

export async function exchangeCodeForToken(code: string): Promise<string> {
  const response = await fetch('https://github.com/login/oauth/access_token', {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      client_id: GITHUB_CLIENT_ID,
      client_secret: GITHUB_CLIENT_SECRET,
      code,
    }),
  });
  
  const data = await response.json();
  if (data.error) {
    throw new Error(data.error_description || 'Failed to exchange code for token');
  }
  return data.access_token;
}

export async function getGitHubUserFromToken(accessToken: string) {
  const octokit = new Octokit({ auth: accessToken });
  const { data } = await octokit.rest.users.getAuthenticated();
  return data;
}

// Get GitHub client for a specific user
export async function getGitHubClientForUser(userId: string): Promise<Octokit> {
  const connection = await storage.getGithubConnection(userId);
  if (!connection) {
    throw new Error('GitHub not connected. Please connect your GitHub account.');
  }
  return new Octokit({ auth: connection.accessToken });
}

// Get GitHub user info for a specific user
export async function getGitHubUserForUser(userId: string) {
  const octokit = await getGitHubClientForUser(userId);
  const { data } = await octokit.rest.users.getAuthenticated();
  return data;
}

// Check if a repository already exists
export async function checkRepoExists(userId: string, repoName: string): Promise<{ exists: boolean; url?: string }> {
  try {
    const octokit = await getGitHubClientForUser(userId);
    const user = await getGitHubUserForUser(userId);
    
    const sanitizedName = repoName
      .toLowerCase()
      .replace(/[^a-z0-9-_]/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '')
      .substring(0, 100) || 'zipship-project';
    
    const { data: repo } = await octokit.rest.repos.get({
      owner: user.login,
      repo: sanitizedName,
    });
    
    return { exists: true, url: repo.html_url };
  } catch (error: any) {
    if (error.status === 404) {
      return { exists: false };
    }
    throw error;
  }
}

// Badge HTML for Free Tier users (viral loop)
const ZIPSHIP_BADGE = `
<!-- Deployed with Zip-Ship -->
<div id="zipship-badge" style="position:fixed;bottom:12px;right:12px;z-index:9999;font-family:system-ui,sans-serif;font-size:12px;">
  <a href="https://zip-ship-revolution.com/?utm_source=user_site" target="_blank" rel="noopener" 
     style="display:flex;align-items:center;gap:6px;padding:6px 12px;background:rgba(10,14,39,0.85);color:#00F0FF;text-decoration:none;border-radius:6px;border:1px solid rgba(0,240,255,0.3);backdrop-filter:blur(8px);transition:all 0.2s;">
    <span style="font-size:14px;">⚡</span>
    <span>Deployed with Zip-Ship</span>
  </a>
</div>
`;

// Inject badge into HTML files for Free Tier users
function injectBadgeIntoHtml(content: string): string {
  // Insert before </body> if it exists
  if (content.toLowerCase().includes('</body>')) {
    return content.replace(/<\/body>/i, `${ZIPSHIP_BADGE}</body>`);
  }
  // Otherwise append at the end
  return content + ZIPSHIP_BADGE;
}

// Create or update a repository and push files to it (using user's GitHub account)
export async function createRepoFromFiles(
  userId: string,
  repoName: string, 
  files: { path: string; content: string; isBinary?: boolean }[],
  isPrivate: boolean = false,
  injectBadge: boolean = false
): Promise<{ repoUrl: string; owner: string; repo: string; isUpdate: boolean }> {
  const octokit = await getGitHubClientForUser(userId);
  const user = await getGitHubUserForUser(userId);
  
  // Sanitize repo name
  const sanitizedName = repoName
    .toLowerCase()
    .replace(/[^a-z0-9-_]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
    .substring(0, 100) || 'zipship-project';
  
  let repoUrl: string;
  let isUpdate = false;
  
  // Check if repo already exists
  try {
    const { data: existingRepo } = await octokit.rest.repos.get({
      owner: user.login,
      repo: sanitizedName,
    });
    // Repo exists - we'll update it
    repoUrl = existingRepo.html_url;
    isUpdate = true;
    console.log(`Repository ${sanitizedName} exists, updating...`);
  } catch (error: any) {
    if (error.status === 404) {
      // Repo doesn't exist - create it
      const { data: repo } = await octokit.rest.repos.createForAuthenticatedUser({
        name: sanitizedName,
        description: `Deployed via ZipShip`,
        private: isPrivate,
        auto_init: true,
      });
      repoUrl = repo.html_url;
      console.log(`Created new repository: ${sanitizedName}`);
      
      // Wait a moment for new repo to be ready
      await new Promise(resolve => setTimeout(resolve, 1000));
    } else {
      throw error;
    }
  }
  
  // Get the default branch (usually 'main')
  const { data: repoData } = await octokit.rest.repos.get({
    owner: user.login,
    repo: sanitizedName,
  });
  const defaultBranch = repoData.default_branch;
  
  // Get the latest commit SHA
  const { data: ref } = await octokit.rest.git.getRef({
    owner: user.login,
    repo: sanitizedName,
    ref: `heads/${defaultBranch}`,
  });
  const latestCommitSha = ref.object.sha;
  
  // Get the tree SHA from the latest commit
  const { data: commit } = await octokit.rest.git.getCommit({
    owner: user.login,
    repo: sanitizedName,
    commit_sha: latestCommitSha,
  });
  const baseTreeSha = commit.tree.sha;
  
  // Create blobs for each file in batches to avoid rate limiting
  const BATCH_SIZE = 10;
  const treeItems: { path: string; mode: '100644'; type: 'blob'; sha: string }[] = [];
  
  for (let i = 0; i < files.length; i += BATCH_SIZE) {
    const batch = files.slice(i, i + BATCH_SIZE);
    const batchResults = await Promise.all(
      batch.map(async (file) => {
        let fileContent = file.content;
        
        // Inject badge into HTML files for Free Tier users
        if (injectBadge && !file.isBinary && file.path.toLowerCase().endsWith('.html')) {
          fileContent = injectBadgeIntoHtml(fileContent);
        }
        
        // Handle binary files (already base64 encoded) vs text files
        const content = file.isBinary 
          ? fileContent  // Already base64 encoded
          : Buffer.from(fileContent).toString('base64');
        
        const { data: blob } = await octokit.rest.git.createBlob({
          owner: user.login,
          repo: sanitizedName,
          content,
          encoding: 'base64',
        });
        return {
          path: file.path,
          mode: '100644' as const,
          type: 'blob' as const,
          sha: blob.sha,
        };
      })
    );
    treeItems.push(...batchResults);
    console.log(`Uploaded ${Math.min(i + BATCH_SIZE, files.length)}/${files.length} files...`);
  }
  
  // Create a new tree (without base_tree to completely replace all files)
  const { data: newTree } = await octokit.rest.git.createTree({
    owner: user.login,
    repo: sanitizedName,
    tree: treeItems,
  });
  
  // Create a new commit with appropriate message
  const commitMessage = isUpdate 
    ? 'Updated via ZipShip' 
    : 'Initial upload via ZipShip';
  
  const { data: newCommit } = await octokit.rest.git.createCommit({
    owner: user.login,
    repo: sanitizedName,
    message: commitMessage,
    tree: newTree.sha,
    parents: [latestCommitSha],
  });
  
  // Update the reference to point to the new commit
  await octokit.rest.git.updateRef({
    owner: user.login,
    repo: sanitizedName,
    ref: `heads/${defaultBranch}`,
    sha: newCommit.sha,
  });
  
  return {
    repoUrl,
    owner: user.login,
    repo: sanitizedName,
    isUpdate,
  };
}
