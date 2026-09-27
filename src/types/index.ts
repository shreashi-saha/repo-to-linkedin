export interface GenerateRequest {
  url: string;
}

export interface GenerateSuccessResponse {
  success: true;
  post: string;
  hashtags: string[];
  repoInfo: {
    owner: string;
    repo: string;
    description: string | null;
    stars: number;
    url: string;
  };
}

export interface GenerateErrorResponse {
  success: false;
  error: string;
  code?: 'INVALID_URL' | 'REPO_NOT_FOUND' | 'REPO_PRIVATE' | 'README_NOT_FOUND' | 'README_EMPTY' | 'GEMINI_ERROR' | 'MISSING_API_KEY' | 'GITHUB_API_ERROR';
}

export type GenerateApiResponse = GenerateSuccessResponse | GenerateErrorResponse;

export interface ParsedGithubUrl {
  owner: string;
  repo: string;
  cleanUrl: string;
}
