import { NextRequest, NextResponse } from 'next/server';
import { parseGithubUrl } from '@/lib/validation';
import { fetchGithubReadme } from '@/lib/github';
import { generateLinkedInPost } from '@/lib/gemini';
import { GenerateApiResponse } from '@/types';

export async function POST(req: NextRequest): Promise<NextResponse<GenerateApiResponse>> {
  try {
    const body = await req.json().catch(() => null);

    if (!body || typeof body.url !== 'string') {
      return NextResponse.json(
        {
          success: false,
          code: 'INVALID_URL',
          error: 'Please enter a valid public GitHub repository URL.',
        },
        { status: 400 }
      );
    }

    // 1. Validate GitHub URL
    const parsed = parseGithubUrl(body.url);
    if (!parsed) {
      return NextResponse.json(
        {
          success: false,
          code: 'INVALID_URL',
          error: 'Please enter a valid public GitHub repository URL (e.g. https://github.com/username/repository).',
        },
        { status: 400 }
      );
    }

    // 2. Fetch Repository Info & README.md from GitHub
    const githubResult = await fetchGithubReadme(parsed.owner, parsed.repo);

    if (githubResult.error) {
      const statusCode =
        githubResult.error.code === 'REPO_NOT_FOUND' || githubResult.error.code === 'README_NOT_FOUND'
          ? 404
          : 400;

      return NextResponse.json(githubResult.error, { status: statusCode });
    }

    if (!githubResult.data) {
      return NextResponse.json(
        {
          success: false,
          code: 'GITHUB_API_ERROR',
          error: 'Failed to retrieve repository data.',
        },
        { status: 500 }
      );
    }

    const { readmeContent, repoInfo } = githubResult.data;

    // 3. Generate LinkedIn post with Gemini AI
    const aiResult = await generateLinkedInPost(
      readmeContent,
      repoInfo.url,
      repoInfo.owner,
      repoInfo.repo
    );

    if (aiResult.error) {
      return NextResponse.json(aiResult.error, { status: 500 });
    }

    if (!aiResult.data) {
      return NextResponse.json(
        {
          success: false,
          code: 'GEMINI_ERROR',
          error: 'Failed to generate post. Please try again.',
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      post: aiResult.data.post,
      hashtags: aiResult.data.hashtags,
      repoInfo,
    });
  } catch (err: unknown) {
    console.error('API /api/generate unhandled error:', err);
    return NextResponse.json(
      {
        success: false,
        code: 'GEMINI_ERROR',
        error: 'An unexpected server error occurred. Please try again.',
      },
      { status: 500 }
    );
  }
}
