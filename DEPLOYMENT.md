# VisiMedica AI - Deployment Guide

## Netlify Deployment

### Prerequisites
- A Netlify account
- An Anthropic API key (get one at https://console.anthropic.com/)

### Step 1: Connect Your Repository
1. Log in to [Netlify](https://app.netlify.com/)
2. Click "Add new site" → "Import an existing project"
3. Connect your Git provider and select this repository
4. Netlify will auto-detect the build settings from `netlify.toml`

### Step 2: Configure Environment Variables
**This is critical for the AI to work!**

1. Go to your site in Netlify Dashboard
2. Navigate to **Site settings** → **Environment variables**
3. Click **Add a variable**
4. Add the following:
   - **Key**: `ANTHROPIC_API_KEY`
   - **Value**: Your Anthropic API key (starts with `sk-ant-`)
   - **Scopes**: Check both "Production" and "Deploy previews"
5. Click **Save**

### Step 3: Deploy
1. Click **Deploy site**
2. Wait for the build to complete (usually 2-3 minutes)
3. Your site will be live at `https://[your-site-name].netlify.app`

### Step 4: Verify Deployment
1. Open your deployed site
2. Try asking the AI doctor a question
3. If you see "⚠️ API Configuration Error", check that:
   - The `ANTHROPIC_API_KEY` environment variable is set correctly
   - You've redeployed after adding the environment variable
   - Your API key is valid and has credits

### Troubleshooting

#### "Using offline mode" message
**Cause**: The API key is not configured or is invalid.

**Solution**:
1. Go to Netlify Dashboard → Site Settings → Environment Variables
2. Verify `ANTHROPIC_API_KEY` is set
3. If it's missing, add it (see Step 2 above)
4. Trigger a new deploy: Deploys → Trigger deploy → Deploy site

#### Function logs show "API key not configured"
**Cause**: Environment variable not set in Netlify.

**Solution**: Follow Step 2 above to add the environment variable.

#### Network errors or function not found
**Cause**: The serverless function may not have deployed correctly.

**Solution**:
1. Check the build logs in Netlify
2. Ensure `netlify/functions/chat.js` exists in your repository
3. Verify `netlify.toml` is in the root directory
4. Redeploy the site

### Viewing Function Logs
To debug issues:
1. Go to Netlify Dashboard → Functions
2. Click on the `chat` function
3. View the function logs to see detailed error messages

### Local Development
To test locally with the Netlify environment:

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Create a .env file (don't commit this!)
echo "ANTHROPIC_API_KEY=your-key-here" > .env

# Run locally with Netlify Dev
netlify dev
```

This will start a local server that simulates the Netlify environment, including serverless functions.

## Build Configuration

The project uses these settings (defined in `netlify.toml`):
- **Build command**: `npm run build`
- **Publish directory**: `dist`
- **Functions directory**: `netlify/functions`
- **Node bundler**: `esbuild`

## API Endpoints

Once deployed, your serverless function is available at:
- Production: `https://[your-site-name].netlify.app/api/chat`
- The `/api/*` path is automatically redirected to `/.netlify/functions/*`

## Security Notes

- Never commit your API key to the repository
- Use Netlify's environment variables for sensitive data
- The API key is only accessible server-side in the serverless function
- CORS is configured to allow requests from any origin (adjust if needed for production)

## Cost Considerations

- Netlify: Free tier includes 100GB bandwidth and 300 build minutes/month
- Anthropic API: Pay-per-use based on tokens consumed
  - Claude 3.5 Sonnet: ~$3 per million input tokens, ~$15 per million output tokens
  - Monitor usage at https://console.anthropic.com/

## Support

If you continue to have issues:
1. Check the browser console for detailed error messages
2. Check Netlify function logs for server-side errors
3. Verify your Anthropic API key is valid and has credits
4. Ensure you've redeployed after adding environment variables
