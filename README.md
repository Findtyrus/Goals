# The Blueprint — Tyrus Burton

Life goals tracker. PWA — installs on your phone like a native app.

## Deploy to Vercel (takes ~5 minutes)

### Step 1 — Push to GitHub
1. Go to github.com → New repository → name it `blueprint` → Create
2. Open terminal (or use GitHub Desktop):
```
cd blueprint2
git init
git add .
git commit -m "initial"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/blueprint.git
git push -u origin main
```

### Step 2 — Deploy on Vercel
1. Go to vercel.com → Sign up free with your GitHub account
2. Click "Add New Project" → Import your `blueprint` repo
3. Vercel auto-detects Vite — just click **Deploy**
4. Done. You'll get a URL like `blueprint-xyz.vercel.app`

### Step 3 — Install on iPhone
1. Open Safari on your iPhone (must be Safari, not Chrome)
2. Go to your Vercel URL
3. Tap the **Share** button (box with arrow)
4. Tap **"Add to Home Screen"**
5. Name it "Blueprint" → Add

It'll appear on your home screen and open fullscreen like a real app.

## Local development
```
npm install
npm run dev
```
