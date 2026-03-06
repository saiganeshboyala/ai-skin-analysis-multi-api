# 🎨 AI Skin Analysis Application

Complete production-ready skin analysis application with AI-powered insights using Claude Sonnet 4.

## ✨ Features

### Step 1: Face Capture
- ✅ **Guided Positioning UI** - Visual guide overlay for proper face alignment
- ✅ **Multi-Angle Capture** - Front, left profile, and right profile views
- ✅ **Real-Time Quality Check** - Automatic detection of:
  - Image resolution (minimum 800x800)
  - Lighting conditions (too dark/too bright)
  - Image sharpness (blur detection)
  - Real-time feedback with visual indicators

### Step 2: AI Report Generation
- ✅ **Comprehensive Skin Analysis** using Claude Sonnet 4
- ✅ **Overall Skin Health Score** (0-100)
- ✅ **Detected Issues** with severity levels (mild/moderate/severe):
  - Acne
  - Fine lines/wrinkles
  - Dark spots/hyperpigmentation
  - Redness/rosacea
  - Dryness/dehydration
  - Oiliness
  - Enlarged pores
  - Dark circles
- ✅ **Facial Zone Analysis** (7 zones with individual scores)
- ✅ **Visual Heatmap Overlays** showing problem areas
- ✅ **Treatment Recommendations** (professional treatments)
- ✅ **Home Care Routine** (morning and evening routines)
- ✅ **Lifestyle Suggestions** (diet, sleep, habits)
- ✅ **Progress Timeline** (week 1, week 4, week 12 expectations)

## 🚀 Quick Start

### Prerequisites
- Node.js 16+ installed
- Anthropic API key ([Get one here](https://console.anthropic.com/))

### Backend Setup

1. **Navigate to backend directory:**
```bash
cd skin-analysis-backend
```

2. **Install dependencies:**
```bash
npm install
```

3. **Create `.env` file:**
```bash
cp .env.example .env
```

4. **Add your Anthropic API key to `.env`:**
```env
ANTHROPIC_API_KEY=your_actual_api_key_here
PORT=5000
```

5. **Start the backend server:**
```bash
npm start
```

Backend will run on `http://localhost:5000`

### Frontend Setup

1. **Open new terminal and navigate to frontend:**
```bash
cd skin-analysis-frontend
```

2. **Install dependencies:**
```bash
npm install
```

3. **Create `.env` file (optional):**
```bash
echo "REACT_APP_API_URL=http://localhost:5000" > .env
```

4. **Start the frontend:**
```bash
npm start
```

Frontend will open at `http://localhost:3000`

## 📁 Project Structure

```
skin-analysis-app/
├── skin-analysis-backend/
│   ├── server.js           # Main backend server
│   ├── package.json
│   ├── .env.example
│   └── uploads/            # Temporary image storage
│
└── skin-analysis-frontend/
    ├── public/
    │   └── index.html
    ├── src/
    │   ├── App.js          # Main React component
    │   ├── App.css         # Styling
    │   ├── index.js
    │   └── index.css
    └── package.json
```

## 🔧 API Endpoints

### 1. Health Check
```
GET /health
```
Returns server status

### 2. Quality Check (Real-time)
```
POST /api/check-quality
Content-Type: multipart/form-data

Body: image (file)
```

Response:
```json
{
  "success": true,
  "quality": {
    "resolution": { "width": 1920, "height": 1080, "isGood": true },
    "lighting": { "brightness": 128, "isGood": true },
    "sharpness": { "value": 45, "isGood": true },
    "overall": true
  },
  "issues": []
}
```

### 3. Full Skin Analysis
```
POST /api/analyze
Content-Type: multipart/form-data

Body: image (file)
```

Response:
```json
{
  "success": true,
  "analysis": {
    "skinType": "combination",
    "overallScore": 75,
    "summary": "Your skin shows...",
    "detectedIssues": [...],
    "zoneAnalysis": {...},
    "treatmentRecommendations": [...],
    "homeCareRoutine": {...},
    "lifestyleSuggestions": {...},
    "progressTimeline": {...}
  }
}
```

## 🎨 User Flow

1. **Intro Screen** → User sees features and tips
2. **Camera Activation** → Request camera permissions
3. **Face Capture** → 
   - Real-time quality indicators
   - Visual face guide overlay
   - Capture 3 angles (front, left, right)
   - Option to retake any angle
4. **Analysis** → AI processing with progress indicator
5. **Results Report** → Comprehensive skin analysis with:
   - Overall score visualization
   - Detected issues with severity
   - Zone-by-zone analysis
   - Treatment recommendations
   - Home care routine
   - Lifestyle suggestions
   - Progress timeline
6. **Export** → Print or download report

## 🛠️ Technologies Used

### Backend
- **Node.js** + **Express** - Server framework
- **Anthropic Claude Sonnet 4** - AI skin analysis
- **Sharp** - Image processing and quality analysis
- **Multer** - File upload handling

### Frontend
- **React 18** - UI framework
- **HTML5 Camera API** - Webcam access
- **Canvas API** - Image capture and processing
- **CSS3** - Modern styling with gradients and animations

## 🔒 Security & Privacy

- ✅ Images processed in-memory (not saved to disk)
- ✅ No user data stored
- ✅ HTTPS recommended for production
- ✅ CORS configured
- ✅ File type validation
- ✅ File size limits (10MB max)

## 📱 Responsive Design

- ✅ Desktop optimized
- ✅ Tablet compatible
- ✅ Mobile responsive (with camera access)
- ✅ Print-friendly report layout

## 🚀 Production Deployment

### Backend Deployment (Heroku/Railway/Render)

1. **Add Procfile:**
```
web: node server.js
```

2. **Set environment variables:**
```bash
ANTHROPIC_API_KEY=your_key
NODE_ENV=production
```

3. **Deploy:**
```bash
git push heroku main
```

### Frontend Deployment (Vercel/Netlify)

1. **Build:**
```bash
npm run build
```

2. **Set environment variable:**
```
REACT_APP_API_URL=https://your-backend-url.com
```

3. **Deploy:**
```bash
vercel --prod
# or
netlify deploy --prod
```

## 🧪 Testing

### Test Backend:
```bash
# Health check
curl http://localhost:5000/health

# Test analysis
curl -X POST http://localhost:5000/api/analyze \
  -F "image=@test-face.jpg"
```

### Test Frontend:
1. Open `http://localhost:3000`
2. Click "Start Analysis"
3. Allow camera access
4. Capture front face
5. Wait for AI analysis
6. View results

## 📊 Performance

- **Image Quality Check:** ~100ms
- **AI Analysis:** ~5-10 seconds
- **Total User Flow:** ~30-60 seconds

## 🔮 Future Enhancements

- [ ] Multi-language support
- [ ] Historical tracking (save past analyses)
- [ ] Before/after comparison
- [ ] Product recommendations
- [ ] Dermatologist consultation booking
- [ ] Social sharing
- [ ] Mobile apps (iOS/Android)

## 🐛 Troubleshooting

### Camera Not Working
- Check browser permissions
- Ensure HTTPS in production
- Try different browser

### Analysis Fails
- Check image quality (lighting, resolution)
- Verify Anthropic API key
- Check API rate limits

### Blur Detection Issues
- Ensure good lighting
- Hold camera steady
- Use tripod if available

## 📄 License

MIT License - Feel free to use for commercial projects

## 🤝 Support

For issues or questions:
- Open GitHub issue
- Email: support@example.com

## 🎉 Credits

Built with:
- [Anthropic Claude](https://www.anthropic.com/)
- [React](https://react.dev/)
- [Sharp](https://sharp.pixelplumbing.com/)
- [Express](https://expressjs.com/)

---

**Made with ❤️ for better skin health**
