# Vercel Deployment Setup Guide

This guide explains how to deploy Boggler to Vercel with automated CI/CD.

## Prerequisites

- A [Vercel account](https://vercel.com/signup) (free tier works great!)
- A GitHub repository for this project
- Repository admin access to configure secrets

## Setup Steps

### 1. Install Vercel CLI (Optional, for local testing)

```bash
npm install -g vercel
```

### 2. Connect Your Project to Vercel

#### Option A: Using Vercel Dashboard (Recommended)

1. Go to https://vercel.com/new
2. Import your GitHub repository `mz2/boggler`
3. Vercel will auto-detect Next.js and configure everything
4. Click "Deploy"
5. Your app will be deployed!

#### Option B: Using Vercel CLI

```bash
vercel login
vercel link
```

Follow the prompts to link your project.

### 3. Get Your Vercel Credentials

You need three secrets for GitHub Actions:

#### A. Get VERCEL_TOKEN

1. Go to https://vercel.com/account/tokens
2. Click "Create Token"
3. Name it "GitHub Actions" or similar
4. Copy the token (you won't see it again!)

#### B. Get VERCEL_ORG_ID

```bash
# If using Vercel CLI:
vercel link

# Or find it in .vercel/project.json after linking
cat .vercel/project.json
```

Look for `"orgId": "team_xxxxx"` or `"orgId": "user_xxxxx"`

#### C. Get VERCEL_PROJECT_ID

```bash
# Same as above - in .vercel/project.json
cat .vercel/project.json
```

Look for `"projectId": "prj_xxxxx"`

**Alternatively**, find both IDs in the Vercel Dashboard:
- Go to your project settings
- Click "General"
- Scroll down to find "Project ID" and "Team ID"

### 4. Add Secrets to GitHub

1. Go to your GitHub repository
2. Click "Settings" → "Secrets and variables" → "Actions"
3. Click "New repository secret"
4. Add these three secrets:

   | Name | Value |
   |------|-------|
   | `VERCEL_TOKEN` | The token from step 3A |
   | `VERCEL_ORG_ID` | The org/team ID from step 3B |
   | `VERCEL_PROJECT_ID` | The project ID from step 3C |

### 5. Push and Deploy!

```bash
git push origin main
```

GitHub Actions will:
1. ✅ Run linting
2. ✅ Run format checks
3. ✅ Run all tests (44 unit tests)
4. ✅ Build the Next.js app
5. ✅ Deploy to Vercel production (if on main branch)

## Deployment Behavior

- **Main branch pushes** → Deploys to production (boggler.vercel.app)
- **Pull requests** → Creates preview deployments
- **Other branches** → Creates preview deployments
- Each PR gets a unique preview URL for testing

## Vercel Features You'll Get

✅ **Automatic HTTPS** - Free SSL certificates
✅ **Global CDN** - Fast loading worldwide
✅ **Preview Deployments** - Test PRs before merging
✅ **Instant Rollbacks** - Revert to any previous deployment
✅ **Analytics** - Built-in traffic insights (free tier)
✅ **Zero Config** - Next.js works out of the box

## Environment Variables (If Needed)

If you need to add environment variables:

1. Go to Vercel Dashboard → Your Project → Settings → Environment Variables
2. Add any variables you need
3. They'll be available in your app as `process.env.YOUR_VAR`

Currently, Boggler doesn't need any environment variables!

## Custom Domain (Optional)

1. Go to Vercel Dashboard → Your Project → Settings → Domains
2. Add your custom domain
3. Follow Vercel's DNS setup instructions
4. Done! Your app will be available at your domain

## Monitoring Deployments

- **GitHub Actions**: Check the "Actions" tab in your repo
- **Vercel Dashboard**: View all deployments at https://vercel.com/dashboard
- **Deployment URL**: Every deployment gets a unique URL

## Troubleshooting

### Build fails on Vercel

Check that:
- `npm run build` works locally
- All dependencies are in `package.json` (not just `devDependencies` if needed at build time)
- Node version is compatible (Vercel uses Node 20 by default)

### Secrets not working

- Make sure secret names match exactly: `VERCEL_TOKEN`, `VERCEL_ORG_ID`, `VERCEL_PROJECT_ID`
- Secrets are case-sensitive
- Re-run the workflow after adding secrets

### Preview deployments not created

- Ensure the GitHub Actions workflow has permission to comment on PRs
- Check workflow run logs in GitHub Actions tab

## Cost

Vercel's **Hobby tier is FREE** and includes:
- Unlimited deployments
- Automatic HTTPS
- 100GB bandwidth per month
- Preview deployments
- Serverless functions

This is more than enough for Boggler!

## Next Steps

Once deployed, share your Vercel URL and start playing Boggler online! 🎉

Your production URL will be something like:
- `https://boggler.vercel.app` (or your custom domain)
- `https://boggler-<your-username>.vercel.app`

## Questions?

- [Vercel Documentation](https://vercel.com/docs)
- [Next.js on Vercel](https://nextjs.org/docs/deployment)
- [Vercel GitHub Integration](https://vercel.com/docs/git)
