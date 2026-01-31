# GitHub Pages Setup

This project is configured to run as a **GitHub Pages** website backed by **GitHub Actions**.

## Architecture
Since LinkedIn blocks direct browser requests (CORS), we cannot fetch jobs directly from a static website. Instead, we use a "Serverless" approach:

1. **Frontend (`docs/`)**: A Vue.js + Tailwind website that lets you edit the config and view results.
2. **Backend (GitHub Actions)**: When you click "Run Search", the website triggers a workflow in this repo.
3. **Scraper (`search-action.js`)**: The workflow runs this Node.js script, scrapes LinkedIn, and **commits the results** back to the repo.
4. **Data**: The website fetches the updated `docs/data/latest.json` to display results.

## Setup Instructions

### 1. Push to GitHub
Commit and push these changes to your repository:
```bash
git add .
git commit -m "Add GitHub Pages web interface"
git push origin main
```

### 2. Configure GitHub Pages
1. Go to your Repo **Settings**.
2. Click **Pages** (sidebar).
3. Under **Build and deployment**:
   - Source: **Deploy from a branch**
   - Branch: `master`
   - Folder: `/docs` (Select `docs` from the dropdown, not root)
4. Click **Save**.

### 3. Configure Action Permissions (Crucial!)
1. Go to **Settings** > **Actions** > **General**.
2. Scroll to **Workflow permissions**.
3. Select **Read and write permissions**.
4. Click **Save**.
   *(This allows the bot to save the CSV/JSON results back to your repo).*

### 4. Create a Personal Access Token (PAT)
To trigger the search from the website, you need a token.
1. Go to your GitHub Profile **Settings** > **Developer settings**.
2. **Personal access tokens** > **Tokens (classic)**.
3. Generate new token:
   - Name: `Job Searcher`
   - Scopes: Check `workflow` (and `repo` if private).
4. **Copy the token**.

### 5. Use the Website
1. Visit your site: `https://zip520123.github.io/Linkedin_Jobsearch_API/`
2. Paste your PAT into the "GitHub Personal Access Token" field.
3. Edit the Search Config JSON if desired.
4. Click **Run Search Workflow**.
5. Wait ~2 minutes (GitHub Actions takes time).
6. Click **Refresh Data** to see new jobs.
