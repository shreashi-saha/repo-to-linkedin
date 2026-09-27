# Repo-to-LinkedIn 🚀

> **Turn your public GitHub repository README into a polished, professional LinkedIn post in seconds.**

Repo-to-LinkedIn is a lightweight, high-performance web application designed for students, developers, and software engineers. It reads the `README.md` file of any public GitHub repository, analyzes the technical scope using **Google Gemini AI**, and generates an engaging, truthful social media post complete with relevant technical hashtags.

---

## ✨ Features

- 🔗 **Public GitHub Repository URL Parsing**: Validates and extracts owner & repository from standard GitHub URLs.
- 📄 **Automatic README Retrieval**: Fetches and decodes `README.md` using GitHub's public API or raw content endpoints without requiring GitHub authentication.
- 🤖 **Gemini AI Content Engine**: Server-side integration with Google Gemini AI (`gemini-3.6-flash` / `gemini-3.5-flash`) engineered to adhere strictly to supported facts in your README.
- ✏️ **Editable Post Editor**: Full live editing capability for the generated post text before sharing.
- 🏷️ **Relevant Hashtags**: Automatically generates 5–10 topic & tech-stack specific hashtags.
- 📋 **One-Click Clipboard Copy**: Copies the post and hashtags formatted for LinkedIn pasting.
- 🔄 **Regeneration**: Instantly request alternative post variations with one click.
- 🛡️ **Zero Login & Privacy First**: No database, no user accounts, and no authentication required.

---

## 🛠️ Technology Stack

- **Framework**: [Next.js 16 (App Router)](https://nextjs.org/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **AI SDK**: Google Gemini API via server-side API routes
- **Icons**: [Lucide React](https://lucide.react.dev/)
- **Deployment**: Vercel ready (Zero config single-repo deployment)

---

## 🚀 Getting Started Locally

### Prerequisites

- **Node.js**: v18.0.0 or higher
- **npm**: v9.0.0 or higher
- **Google Gemini API Key**: Free API key from [Google AI Studio](https://aistudio.google.com/)

### Installation & Local Setup

1. **Clone the repository**:
   ```bash
   git clone https://github.com/your-username/repo-to-linkedin.git
   cd repo-to-linkedin
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure Environment Variables**:
   Copy `.env.example` to `.env.local`:
   ```bash
   cp .env.example .env.local
   ```
   Open `.env.local` and insert your Gemini API key:
   ```env
   GEMINI_API_KEY=your_actual_gemini_api_key_here
   ```

4. **Run the development server**:
   ```bash
   npm run dev
   ```

5. **Open in Browser**:
   Navigate to [http://localhost:3000](http://localhost:3000).

---

## 🔑 Obtaining a Gemini API Key

1. Go to [Google AI Studio](https://aistudio.google.com/).
2. Sign in with your Google account.
3. Click **"Create API key"**.
4. Copy your API key string.
5. Paste it into `.env.local` as `GEMINI_API_KEY=AIzaSy...`.

---

## 🌐 How to Deploy to Vercel

The application is structured for effortless one-click deployment on Vercel:

1. **Push your code** to a GitHub repository.
2. Log into [Vercel](https://vercel.com/) and click **"Add New Project"**.
3. Import your `repo-to-linkedin` repository.
4. Under **Environment Variables**, add:
   - Key: `GEMINI_API_KEY`
   - Value: `your_gemini_api_key_here`
5. Click **"Deploy"**.

---

## 🧪 Testing Checklist

- [x] **Valid Public GitHub Repository**: `https://github.com/facebook/react` -> Generates post & hashtags.
- [x] **Invalid URL Handling**: `not-a-url` -> Returns clear URL validation error.
- [x] **Non-Existent Repo**: `https://github.com/defunkt/nonexistentrepo12345` -> Returns repository not found error.
- [x] **Missing README**: Repositories without `README.md` -> Displays mandatory README requirement error.
- [x] **Empty README**: Repositories with short or empty README -> Displays insufficient details error.
- [x] **Editable Post**: User can edit text in the post editor.
- [x] **Copy to Clipboard**: Copies post text + hashtags with temporary success badge.
- [x] **Regenerate Button**: Generates a fresh post using the same repository.
- [x] **Mobile Responsiveness**: Verified on mobile, tablet, and desktop viewports.

---

## 📌 Limitations

- Supports **public GitHub repositories** only (GitLab / Bitbucket are not supported in MVP).
- Requires a repository to have a `README.md` file.
- Direct posting to LinkedIn is intentionally omitted; users copy text manually.

---

## 🔮 Future Enhancements (Post-MVP)

- Custom tone/length selectors (e.g., Short Hook, In-depth Technical, Casual).
- Target audience focus (e.g., Recruiters, Developers, Product Managers).
- GitHub Repository metrics integration (Stars, Forks, Top languages).
- Multi-language support for README processing.
