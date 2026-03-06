# 🚀 QUICK START GUIDE

## Prerequisites
- Node.js 16+ installed
- Anthropic API key (get from https://console.anthropic.com/)

## Installation Steps

### 1. Backend Setup

```bash
# Navigate to backend folder
cd backend

# Install dependencies
npm install

# Create .env file from template
cp .env.example .env

# Edit .env and add your Anthropic API key
# nano .env (or use any text editor)
# Set: ANTHROPIC_API_KEY=your_actual_api_key_here

# Start backend server
npm start
```

Backend will run on http://localhost:5000

### 2. Frontend Setup (Open NEW terminal)

```bash
# Navigate to frontend folder
cd frontend

# Install dependencies
npm install

# Start frontend
npm start
```

Frontend will automatically open at http://localhost:3000

### 3. Start Using!

1. Click "Start Analysis"
2. Allow camera access
3. Position your face in the guide
4. Capture 3 angles (front, left, right)
5. Wait for AI analysis (~10 seconds)
6. View your personalized skin report!

## Troubleshooting

### Camera not working?
- Allow camera permissions in browser
- Use Chrome/Firefox for best compatibility
- Ensure you're on HTTPS in production

### Backend errors?
- Check your Anthropic API key is correct
- Verify Node.js version is 16+
- Make sure port 5000 is available

### Frontend can't connect?
- Ensure backend is running on port 5000
- Check for CORS errors in browser console
- Verify proxy setting in frontend/package.json

## Next Steps

- Read the main README.md for full documentation
- Deploy to production (see README.md)
- Customize styling in frontend/src/App.css
- Modify AI analysis in backend/server.js

## Support

For issues or questions, please refer to the main README.md file.

---
**Happy analyzing! 🎨**
