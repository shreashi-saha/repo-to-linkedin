import { GenerateErrorResponse } from '@/types';

export interface RepoFetchResult {
  readmeContent: string;
  repoInfo: {
    owner: string;
    repo: string;
    description: string | null;
    stars: number;
    url: string;
  };
}

/**
 * Fetches repository metadata and README.md content from GitHub public API.
 */
export async function fetchGithubReadme(
  owner: string,
  repo: string
): Promise<{ data?: RepoFetchResult; error?: GenerateErrorResponse }> {
  const headers: Record<string, string> = {
    'User-Agent': 'Repo-to-LinkedIn-App',
    Accept: 'application/vnd.github.v3+json',
  };

  // 1. Verify Repository metadata (existence and public status)
  let repoRes: Response;
  try {
    repoRes = await fetch(`https://api.github.com/repos/${owner}/${repo}`, {
      headers,
      next: { revalidate: 60 },
    });
  } catch {
    return {
      error: {
        success: false,
        code: 'GITHUB_API_ERROR',
        error: 'Unable to connect to GitHub. Please check your internet connection and try again.',
      },
    };
  }

  if (repoRes.status === 404) {
    return {
      error: {
        success: false,
        code: 'REPO_NOT_FOUND',
        error: "We couldn't find this GitHub repository. Please check the URL or ensure it is spelled correctly.",
      },
    };
  }

  if (repoRes.status === 403) {
    const rateLimitRemaining = repoRes.headers.get('x-ratelimit-remaining');
    if (rateLimitRemaining === '0') {
      return {
        error: {
          success: false,
          code: 'GITHUB_API_ERROR',
          error: 'GitHub API rate limit exceeded. Please wait a minute and try again.',
        },
      };
    }
    return {
      error: {
        success: false,
        code: 'REPO_PRIVATE',
        error: 'This repository is not publicly accessible. Please use a public GitHub repository.',
      },
    };
  }

  if (!repoRes.ok) {
    return {
      error: {
        success: false,
        code: 'GITHUB_API_ERROR',
        error: `GitHub API returned an error (${repoRes.status}). Please try again later.`,
      },
    };
  }

  const repoData = await repoRes.json();

  if (repoData.private) {
    return {
      error: {
        success: false,
        code: 'REPO_PRIVATE',
        error: 'This repository is not publicly accessible. Please use a public GitHub repository.',
      },
    };
  }

  // 2. Fetch README content
  // First try GitHub API readme endpoint
  let readmeRes: Response;
  try {
    readmeRes = await fetch(`https://api.github.com/repos/${owner}/${repo}/readme`, {
      headers: {
        ...headers,
        Accept: 'application/vnd.github.v3.raw',
      },
      next: { revalidate: 60 },
    });
  } catch {
    return {
      error: {
        success: false,
        code: 'GITHUB_API_ERROR',
        error: 'Failed to retrieve README from GitHub. Please try again.',
      },
    };
  }

  if (readmeRes.status === 404) {
    // Fallback: try direct raw.githubusercontent URL for HEAD/README.md
    try {
      const rawRes = await fetch(
        `https://raw.githubusercontent.com/${owner}/${repo}/HEAD/README.md`,
        { next: { revalidate: 60 } }
      );
      if (rawRes.ok) {
        const text = await rawRes.text();
        return processReadmeText(text, owner, repo, repoData);
      }
    } catch {
      // ignore raw fallback error and proceed to 404
    }

    return {
      error: {
        success: false,
        code: 'README_NOT_FOUND',
        error: 'README.md not found. Repo-to-LinkedIn requires a README.md file to understand your project.',
      },
    };
  }

  if (!readmeRes.ok) {
    return {
      error: {
        success: false,
        code: 'README_NOT_FOUND',
        error: 'README.md not found. Repo-to-LinkedIn requires a README.md file to understand your project.',
      },
    };
  }

  const readmeText = await readmeRes.text();
  return processReadmeText(readmeText, owner, repo, repoData);
}

function processReadmeText(
  rawText: string,
  owner: string,
  repo: string,
  repoData: { description?: string | null; stargazers_count?: number; html_url?: string }
): { data?: RepoFetchResult; error?: GenerateErrorResponse } {
  const cleanedText = rawText.trim();

  // Strip huge HTML images/svg base64 data to keep text relevant and avoid token bloat
  const sanitizedText = cleanedText
    .replace(/data:image\/[^;]+;base64,[^"'\s>]+/g, '[IMAGE]')
    .replace(/<svg[\s\S]*?<\/svg>/gi, '[SVG]');

  if (!sanitizedText || sanitizedText.length < 50) {
    return {
      error: {
        success: false,
        code: 'README_EMPTY',
        error: "Your README doesn't contain enough information to generate a useful LinkedIn post. Please add more project details and try again.",
      },
    };
  }

  return {
    data: {
      readmeContent: sanitizedText,
      repoInfo: {
        owner,
        repo,
        description: repoData.description || null,
        stars: repoData.stargazers_count || 0,
        url: repoData.html_url || `https://github.com/${owner}/${repo}`,
      },
    },
  };
}
