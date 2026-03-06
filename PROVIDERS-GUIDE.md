# AI Skin Analysis - API Provider Options

This project supports **3 different AI providers**. Choose the one that works best for you!

## 🤖 Available Providers

### 1. **Claude Sonnet 4** (Anthropic) - Original Version
- **Cost:** ~$3 per 1000 images
- **Quality:** ⭐⭐⭐⭐⭐ Excellent
- **Speed:** ~5-10 seconds
- **API Key:** https://console.anthropic.com/

### 2. **GPT-4 Vision** (OpenAI) - Alternative
- **Cost:** ~$0.03 per image (100x cheaper!)
- **Quality:** ⭐⭐⭐⭐ Very Good
- **Speed:** ~3-5 seconds (faster!)
- **API Key:** https://platform.openai.com/api-keys

### 3. **Grok Vision** (x.ai) - Alternative
- **Cost:** Pricing varies (check x.ai)
- **Quality:** ⭐⭐⭐⭐ Very Good
- **Speed:** ~5-8 seconds
- **API Key:** https://console.x.ai/

---

## 📦 What's Included

This package contains **3 versions**:

```
backend/                    # Original (Claude Sonnet 4)
backend-openai/            # OpenAI GPT-4 Vision
backend-grok/              # Grok Vision (x.ai)
```

---

## 🚀 Quick Start

### Option 1: Use OpenAI GPT-4 Vision (Recommended for Cost)

```bash
cd backend-openai
npm install
cp .env.example .env
# Add your OpenAI API key to .env
npm start
```

### Option 2: Use Grok Vision

```bash
cd backend-grok
npm install
cp .env.example .env
# Add your x.ai API key to .env
npm start
```

### Option 3: Use Claude Sonnet 4 (Original)

```bash
cd backend
npm install
cp .env.example .env
# Add your Anthropic API key to .env
npm start
```

---

## 💰 Cost Comparison

**For 1000 skin analyses:**

| Provider | Cost | Notes |
|----------|------|-------|
| **OpenAI GPT-4o** | ~$30 | ✅ Best value |
| **Grok Vision** | ~$50-100 | Check x.ai pricing |
| **Claude Sonnet 4** | ~$3000 | Highest quality |

---

## 🎯 Which Should You Choose?

### Choose **OpenAI GPT-4 Vision** if:
- ✅ You want the best cost-to-quality ratio
- ✅ You need fast responses
- ✅ You're building an MVP or startup
- ✅ You have an OpenAI account already

### Choose **Grok Vision** if:
- ✅ You want to try Elon's latest AI
- ✅ You have x.ai credits
- ✅ You want alternative to OpenAI

### Choose **Claude Sonnet 4** if:
- ✅ You need the absolute best quality
- ✅ Cost is not a concern
- ✅ You're building a premium product
- ✅ You want the most detailed analysis

---

## 🔧 Setup Instructions

### 1. Get Your API Key

**For OpenAI:**
1. Go to https://platform.openai.com/
2. Sign up or log in
3. Go to "API Keys"
4. Create new key
5. Copy key (starts with `sk-...`)

**For Grok:**
1. Go to https://console.x.ai/
2. Sign up or log in
3. Get your API key
4. Copy key (starts with `xai-...`)

**For Claude:**
1. Go to https://console.anthropic.com/
2. Sign up or log in
3. Create API key
4. Copy key

### 2. Install Dependencies

```bash
cd backend-openai  # or backend-grok or backend
npm install
```

### 3. Configure Environment

```bash
cp .env.example .env
nano .env  # or use any text editor
```

Add your API key:
```env
OPENAI_API_KEY=sk-your-key-here
# or
XAI_API_KEY=xai-your-key-here
# or
ANTHROPIC_API_KEY=your-key-here
```

### 4. Start Server

```bash
npm start
```

### 5. Test It

```bash
curl http://localhost:5000/health
```

---

## 🔄 Switching Providers

To switch providers, just stop your current backend and start a different one:

```bash
# Stop current backend (Ctrl+C)

# Start different one
cd ../backend-openai
npm start
```

The frontend works with ALL backends - no changes needed!

---

## 📊 Quality Comparison

All three providers give **excellent results**, but with slight differences:

| Feature | Claude | GPT-4 | Grok |
|---------|--------|-------|------|
| Issue Detection | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ |
| Detail Level | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ |
| Recommendations | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ |
| Speed | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ |
| Cost | ⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ |

---

## 🛠️ Technical Details

### API Models Used:

**OpenAI:**
- Model: `gpt-4o` (recommended)
- Alternatives: `gpt-4-vision-preview`, `gpt-4-turbo`
- API Docs: https://platform.openai.com/docs/guides/vision

**Grok:**
- Model: `grok-vision-beta`
- Alternative: `grok-2-vision-1212`
- API Docs: https://docs.x.ai/

**Claude:**
- Model: `claude-sonnet-4-20250514`
- API Docs: https://docs.anthropic.com/

### API Request Format:

All three use similar formats (images as base64), but with different endpoints and auth methods.

---

## 🐛 Troubleshooting

### "Invalid API Key" Error
✅ Check your .env file
✅ Ensure no extra spaces
✅ Verify key starts correctly (sk-, xai-, etc.)

### "Rate Limit" Error
✅ Wait a few minutes
✅ Check your API usage dashboard
✅ Upgrade your API plan if needed

### "Model Not Found" Error
✅ Check model name in server.js
✅ Verify your API tier includes vision models
✅ Update to latest model version

---

## 💡 Tips

1. **Start with OpenAI** - Best balance of cost/quality
2. **Test with sample images** before going live
3. **Monitor your API usage** to avoid surprises
4. **Set spending limits** in your API dashboard
5. **Cache results** if users re-analyze same photos

---

## 📝 License

MIT License - Use freely in your projects!

---

**Questions?** Check the main README.md or open an issue on GitHub.
