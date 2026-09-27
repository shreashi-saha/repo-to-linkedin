import { ParsedGithubUrl } from '@/types';

/**
 * Validates and parses a public GitHub repository URL.
 * Accepts formats like:
 * - https://github.com/owner/repository
 * - https://github.com/owner/repository/
 * - https://github.com/owner/repository.git
 * - http://github.com/owner/repository
 * - github.com/owner/repository
 */
export function parseGithubUrl(rawUrl: string): ParsedGithubUrl | null {
  if (!rawUrl || typeof rawUrl !== 'string') return null;

  let urlStr = rawUrl.trim();
  if (!urlStr) return null;

  // Add protocol if missing
  if (!urlStr.startsWith('http://') && !urlStr.startsWith('https://')) {
    urlStr = 'https://' + urlStr;
  }

  try {
    const urlObj = new URL(urlStr);

    // Host must be github.com or www.github.com
    const hostname = urlObj.hostname.toLowerCase();
    if (hostname !== 'github.com' && hostname !== 'www.github.com') {
      return null;
    }

    // Pathname split: e.g. /owner/repo or /owner/repo.git or /owner/repo/
    const pathSegments = urlObj.pathname
      .split('/')
      .filter((segment) => segment.length > 0);

    if (pathSegments.length < 2) {
      return null;
    }

    const owner = pathSegments[0];
    let repo = pathSegments[1];

    // Strip trailing .git if present
    if (repo.endsWith('.git')) {
      repo = repo.slice(0, -4);
    }

    // Validate owner and repo string characters (GitHub usernames & repos allow alphanumerics, hyphens, underscores, dots)
    const validPattern = /^[a-zA-Z0-9_.-]+$/;
    if (!validPattern.test(owner) || !validPattern.test(repo)) {
      return null;
    }

    const cleanUrl = `https://github.com/${owner}/${repo}`;

    return {
      owner,
      repo,
      cleanUrl,
    };
  } catch {
    return null;
  }
}
