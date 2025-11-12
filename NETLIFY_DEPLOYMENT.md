# Netlify Deployment Guide for VisiMedica AI

## ✅ What I've Set Up For You

I've configured your project to work on Netlify with serverless functions:

1. **Created `netlify/functions/chat.js`** - Serverless function that handles API calls
2. **Created `netlify.toml`** - Netlify configuration file
3. **API routing** - `/api/chat` automatically routes to the serverless function

## 🚀 Deployment Steps

### Step 1: Push to GitHub

```bash
# Initialize git if not already done
git init

# Add all files
git add .

# Commit
git commit -m "Ready for Netlify deployment"

# Create a new repository on GitHub, then:
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
git branch -M main
git push -u origin main
```

### Step 2: Deploy to Netlify

1. Go to [https://app.netlify.com](https://app.netlify.com)
2. Click "Add new site" → "Import an existing project"
3. Choose "GitHub" and select your repository
4. Netlify will auto-detect settings from `netlify.toml`:
   - Build command: `npm run build`
   - Publish directory: `dist`
   - Functions directory: `netlify/functions`
5. Click "Deploy site"

### Step 3: Add Environment Variable

**CRITICAL**: You must add your Anthropic API key as an environment variable:

1. In Netlify dashboard, go to: **Site settings** → **Environment variables**
2. Click "Add a variable"
3. Add:
   - **Key**: `ANTHROPIC_API_KEY`
   - **Value**: Your Anthropic API key (from your `.env` file)
4. Click "Save"
5. **Trigger a new deploy** for the environment variable to take effect

### Step 4: Test

Once deployed:
1. Visit your Netlify URL (e.g., `https://your-site-name.netlify.app`)
2. Try the voice or text chat
3. Check that AI responses work

## 🔧 How It Works

### Local Development (Current)
```
Browser → /api/chat → Vite Dev Server → server/anthropic-api.js → Anthropic API
```

### Production (Netlify)
```
Browser → /api/chat → Netlify Function → netlify/functions/chat.js → Anthropic API
```

The `netlify.toml` file redirects `/api/*` to `/.netlify/functions/*` automatically.

## 📁 Files Added

- `netlify/functions/chat.js` - Serverless function (replaces `server/anthropic-api.js`)
- `netlify.toml` - Netlify configuration
- `NETLIFY_DEPLOYMENT.md` - This guide

## ⚠️ Important Notes

### API Key Security
- ✅ Your API key is stored as an environment variable (secure)
- ✅ Never committed to git (in `.env` file)
- ✅ Only accessible to Netlify functions (not exposed to browser)

### Costs
- Netlify: Free tier includes 125k function invocations/month
- Anthropic: You pay for API usage (same as local development)

### Custom Domain (Optional)
After deployment, you can add a custom domain:
1. Go to **Domain settings** in Netlify
2. Click "Add custom domain"
3. Follow DNS setup instructions

## 🐛 Troubleshooting

### "API call failed" after deployment
- Check that you added `ANTHROPIC_API_KEY` environment variable
- Trigger a new deploy after adding the variable
- Check Netlify function logs: **Functions** tab → **chat** → View logs

### Build fails
- Check Netlify build logs
- Ensure all dependencies are in `package.json`
- Try building locally: `npm run build`

### Voice recognition doesn't work
- Voice recognition requires HTTPS (Netlify provides this automatically)
- Make sure you're using Chrome, Edge, or Safari

## 📊 Monitoring

After deployment, monitor:
- **Netlify Dashboard**: Build status, function invocations
- **Anthropic Dashboard**: API usage and costs

## 🔄 Updates

To update your deployed site:
```bash
git add .
git commit -m "Update description"
git push
```

Netlify will automatically rebuild and deploy!

## ✅ Checklist Before Going Live

- [ ] Pushed code to GitHub
- [ ] Connected GitHub repo to Netlify
- [ ] Added `ANTHROPIC_API_KEY` environment variable
- [ ] Triggered a new deploy
- [ ] Tested chat functionality
- [ ] Tested voice recognition
- [ ] Uploaded `doctor.glb` model to `public/models/`
- [ ] Uploaded `Logo.png` to `public/images/`
- [ ] Verified all features work on live site

---

## 🎉 You're Ready!

Your VisiMedica AI will work perfectly on Netlify with the serverless function handling all API calls securely.
