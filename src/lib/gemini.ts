import { GenerateErrorResponse } from '@/types';

export interface GeminiResult {
  post: string;
  hashtags: string[];
}

export async function generateLinkedInPost(
  readmeContent: string,
  repoUrl: string,
  repoOwner: string,
  repoName: string
): Promise<{ data?: GeminiResult; error?: GenerateErrorResponse }> {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey || apiKey === 'your_gemini_api_key_here') {
    return {
      error: {
        success: false,
        code: 'MISSING_API_KEY',
        error: 'Gemini API key is missing. Please set GEMINI_API_KEY in your environment (.env) file.',
      },
    };
  }

  const promptText = `
You are a professional technical content writer specializing in LinkedIn posts for software developers, students, and engineers.

Analyze the provided GitHub README for the repository "${repoOwner}/${repoName}" (URL: ${repoUrl}).

Your task is to create ONE professional LinkedIn post describing the project, followed by 5 to 10 relevant hashtags.

CRITICAL INSTRUCTIONS & CONSTRAINTS:
1. Base the post ONLY on the information available in the provided README. Do NOT invent project features, technologies, metrics, claims, awards, team members, or achievements that are not supported by the README.
2. If information for a section is missing from the README, write the post concisely without inventing details.
3. Start with an engaging but professional hook.
4. Clearly explain what the project does and the problem it solves.
5. Highlight major features and functionality explicitly mentioned in the README.
6. Mention technologies/frameworks ONLY if explicitly supported by the README.
7. Include the GitHub repository link (${repoUrl}) near the end of the post text.
8. Tone: Professional, natural, human-sounding, concise (approx 100-180 words).
9. AVOID exaggerated marketing buzzwords (e.g. "revolutionary", "game-changing", "cutting-edge") unless explicitly justified in the README.
10. Generate 5-10 relevant technical hashtags based on the project domain and tech stack.

OUTPUT FORMAT REQUIREMENTS:
You MUST respond with a valid JSON object only, matching this exact JSON structure:
{
  "post": "The complete generated LinkedIn post text including the repository link.",
  "hashtags": ["#SoftwareDevelopment", "#GitHub", "#WebDev"]
}

Here is the repository README.md content:
---
${readmeContent.slice(0, 12000)}
---
`;

  // Models to try: Primary gemini-3.6-flash, Fallback gemini-3.5-flash
  const modelsToTry = [
    'gemini-3.6-flash',
  ];

  let lastErrorMsg = '';

  for (const modelName of modelsToTry) {
    for (let attempt = 1; attempt <= 2; attempt++) {
      try {
        const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${apiKey}`;

        const response = await fetch(endpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            contents: [
              {
                parts: [{ text: promptText }],
              },
            ],
            generationConfig: {
              temperature: 0.4,
              topK: 40,
              topP: 0.95,
              responseMimeType: 'application/json',
            },
          }),
        });

        if (!response.ok) {
          const errorJson = await response.json().catch(() => ({}));
          const msg = errorJson.error?.message || response.statusText;
          lastErrorMsg = `Gemini API (${modelName}) returned ${response.status}: ${msg}`;

          // If API key invalid
          if (response.status === 400 && msg.includes('API key')) {
            return {
              error: {
                success: false,
                code: 'MISSING_API_KEY',
                error: 'Invalid Gemini API key. Please verify your GEMINI_API_KEY environment variable.',
              },
            };
          }

          // If 503 (high demand) or 429 (rate limit), pause briefly before retry
          if ((response.status === 503 || response.status === 429) && attempt < 2) {
            await new Promise((resolve) => setTimeout(resolve, 1200));
            continue;
          }

          // Move to next candidate model
          break;
        }

        const resData = await response.json();
        const rawResponseText =
          resData.candidates?.[0]?.content?.parts?.[0]?.text;

        if (!rawResponseText) {
          lastErrorMsg = 'Empty response received from Gemini model.';
          break;
        }

        const parsed = parseGeminiJsonResponse(rawResponseText, repoUrl);
        if (parsed) {
          return { data: parsed };
        }
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : String(err);
        lastErrorMsg = message;
        if (attempt < 2) {
          await new Promise((resolve) => setTimeout(resolve, 1000));
          continue;
        }
      }
    }
  }

  return {
    error: {
      success: false,
      code: 'GEMINI_ERROR',
      error:
        lastErrorMsg ||
        'Failed to generate post with Gemini AI. Please check your API key or try again later.',
    },
  };
}

function parseGeminiJsonResponse(
  rawText: string,
  repoUrl: string
): GeminiResult | null {
  try {
    // Strip markdown code fences if model returned ```json ... ```
    let cleanText = rawText.trim();
    if (cleanText.startsWith('```')) {
      cleanText = cleanText.replace(/^```(?:json)?\n?/, '').replace(/\n?```$/, '');
    }

    const data = JSON.parse(cleanText);

    if (data && typeof data.post === 'string') {
      let postText = data.post.trim();

      // Ensure GitHub link is present in the post
      if (!postText.includes(repoUrl)) {
        postText += `\n\nCheck out the project on GitHub: ${repoUrl}`;
      }

      let hashtags: string[] = Array.isArray(data.hashtags)
        ? data.hashtags.map((h: unknown) => {
            const str = String(h).trim();
            return str.startsWith('#') ? str : `#${str}`;
          })
        : [];

      // Filter out duplicate or empty hashtags
      hashtags = Array.from(new Set(hashtags)).filter((h) => h.length > 1);

      if (hashtags.length === 0) {
        hashtags = ['#GitHub', '#SoftwareDevelopment', '#OpenSource', '#DevCommunity'];
      }

      return {
        post: postText,
        hashtags,
      };
    }
  } catch {
    // Fallback: if JSON parsing failed, attempt basic text extraction
    if (rawText.length > 50) {
      let post = rawText.trim();
      if (!post.includes(repoUrl)) {
        post += `\n\nGitHub Repo: ${repoUrl}`;
      }
      return {
        post,
        hashtags: ['#GitHub', '#SoftwareDevelopment', '#OpenSource'],
      };
    }
  }
  return null;
}
