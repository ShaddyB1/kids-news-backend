# Junior News Digest - Comprehensive Application Guidelines

## 🎯 **STRICT COMPLIANCE FRAMEWORK**

This document consolidates ALL application guidelines into a single, strict compliance framework. Every component must follow these standards exactly.

---

## 📱 **MOBILE APP REQUIREMENTS**

### **1. Technical Architecture**
✅ **MUST HAVE:**
- React Native with Expo SDK 53.0.0
- `expo-av` for video playback with instant loading
- `@react-navigation/native` and `@react-navigation/bottom-tabs` for navigation
- `react-native-safe-area-context` for notch/status bar handling
- `AsyncStorage` for local data persistence
- `Vibration` for haptic feedback (limited to key interactions)

✅ **STRICT CONFIGURATION:**
- `StatusBar style="auto" translucent={false}`
- Video component: `volume={1.0}`, `isMuted={false}`, `usePoster={false}`, `positionMillis={0}`
- Safe area wrapping for all screens
- Minimum touch target size: 44px
- iOS font size: 16px minimum (prevents zoom)

### **2. UX/UI Standards**
✅ **DESIGN REQUIREMENTS:**
- Kid-friendly color scheme (bright blues, greens, warm accents)
- Professional appearance suitable for parents
- Intuitive navigation with clear visual hierarchy
- Immediate visual feedback for all interactions
- Archive system for accessing past content

✅ **INTERACTION PATTERNS:**
- Haptic feedback on: navigation, story selection, major actions
- NO haptic feedback on: scrolling, minor taps, frequent actions
- TouchableOpacity with visual state changes
- Loading states must be immediate (no dark screens)

### **3. Safety & Privacy**
✅ **MANDATORY COMPLIANCE:**
- COPPA compliant (no data collection without parental consent)
- No external links or web views
- Content pre-moderated and safe for ages 6-10
- Parental dashboard capabilities
- Local storage only for user preferences

---

## 🎬 **VIDEO GENERATION STANDARDS**

### **1. Logo Requirements**
✅ **EXACT LOGO USAGE:**
- File: `OFFICIAL_JUNIOR_NEWS_DIGEST_LOGO.png` (1920x1080)
- ALWAYS first frame of every video
- NEVER generate new logos or variations
- 3D orange/yellow text on sky gradient with ocean waves
- 2-3 second display duration

### **2. Illustration Standards**
✅ **STORY SYNCHRONIZATION:**
- Frame 1: Official logo (skip text detection)
- Frame 2: Story introduction/characters when mentioned
- Frame 3: Problem/challenge being explained
- Frame 4: Solution/action taking place
- Frame 5: Results/impact being described
- Frame 6: Community benefits/environmental impact
- Frame 7: Inspiring conclusion/call to action

✅ **TECHNICAL QUALITY:**
- Resolution: 1920x1080 HD
- Style: Children's book illustration, Pixar-like animation
- Colors: Bright, vibrant, high contrast
- Content: Story-matched visuals, NO text artifacts
- Duration: 60-75 seconds total

### **3. Text Artifact Prevention**
✅ **AUTOMATIC DETECTION:**
- Skip detection for logo frame (scene 0)
- Target dark text bands in top 15% of illustrations
- Detection thresholds: dark_rows > 8 AND consistent_rows > 12
- Fallback: auto-crop top region if text persists
- Enhanced prompts: "no text, no words, no letters, no captions"

### **4. Audio Standards**
✅ **VOICE REQUIREMENTS:**
- ElevenLabs Bella voice for natural narration
- Conversational, kid-friendly tone
- Opening: "Welcome to Junior News Digest, here's our news for the day"
- Complete story arc with satisfying conclusion
- No expression tags in final script

---

## 🔄 **AUTOMATED CONTENT PIPELINE**

### **1. Weekly Schedule (STRICT)**
✅ **CONTENT DELIVERY:**
- **Friday Night**: System emails 10-12 story options to:
  - aaddoshadrack@gmail.com
  - marfo.oduro@gmail.com
- **Tuesday, Wednesday, Friday**: App pushes new stories with notifications
- **Content Types**: Stories + videos + notifications per push

### **2. Production Workflow**
✅ **GENERATION PROCESS:**
- Story analysis → prompt generation → illustration creation → text detection → watermark removal → video assembly → app deployment
- Audio reuse when possible (save ElevenLabs tokens)
- Automatic quality checks before deployment
- Date-organized folder structure for all content

### **3. Quality Assurance**
✅ **MANDATORY CHECKS:**
- Video quality checker for each video
- Text artifact detection and removal
- Logo consistency verification
- Audio clarity and volume levels
- File size optimization (4-6MB per video)

---

## 🎨 **BRAND CONSISTENCY**

### **1. Visual Identity**
✅ **BRAND STANDARDS:**
- Consistent use of official 3D logo
- Bright, educational color palette
- Professional yet kid-friendly aesthetic
- High-quality illustrations throughout
- No watermarks or production artifacts

### **2. Content Tone**
✅ **MESSAGING STANDARDS:**
- Educational and inspiring
- Age-appropriate language (grades 2-4)
- Positive, solution-focused stories
- Encourages curiosity and learning
- Safe and inclusive content

---

## 📊 **TESTING & VALIDATION**

### **1. Pre-Deployment Checklist**
✅ **EVERY VIDEO MUST:**
- [ ] Start with exact official logo
- [ ] Have story-synchronized illustrations
- [ ] Pass text artifact detection
- [ ] Include natural ElevenLabs narration
- [ ] Be 4-6MB file size
- [ ] Load instantly in app
- [ ] Have clear audio at correct volume

✅ **EVERY APP UPDATE MUST:**
- [ ] Maintain safe area handling
- [ ] Preserve haptic feedback patterns
- [ ] Load videos without dark screens
- [ ] Navigate intuitively
- [ ] Store data locally only
- [ ] Display fresh QR code for testing

### **2. Quality Gates**
✅ **MANDATORY TOOLS:**
- `video_quality_checker.py` for all videos
- Text detection during generation
- Logo consistency verification
- Audio level monitoring
- App performance testing

---

## 🚀 **DEPLOYMENT STANDARDS**

### **1. File Organization**
✅ **STRICT STRUCTURE:**
```
production/
├── story_synchronized_generator.py    # Main video generator
├── generated_videos/                  # Video outputs
└── JUNIOR_NEWS_DIGEST_BRAND_STANDARDS.md

app_development/kids_news_app_fixed/
├── assets/videos/                     # Final app videos
├── App.js                            # Main app code
└── package.json                      # Dependencies

tools/
├── video_quality_checker.py          # Quality validation
└── cleanup_logo.py                   # Logo processing
```

### **2. Version Control**
✅ **REQUIRED PRACTICES:**
- Keep all guidelines updated
- Document any changes to standards
- Maintain production vs development separation
- Archive old versions properly
- Clear git commit messages

---

## ⚖️ **COMPLIANCE ENFORCEMENT**

### **CRITICAL**: Every component must pass ALL checklist items before deployment.

### **ZERO TOLERANCE**: 
- Text artifacts in videos
- Dark screens at video start
- Broken navigation or loading
- Audio issues
- Logo inconsistencies

### **IMMEDIATE FIXES REQUIRED FOR**:
- Any safety or privacy violations
- Brand guideline deviations
- Quality standard failures
- User experience problems

---

## 🔍 **CONTINUOUS MONITORING**

✅ **ONGOING REQUIREMENTS:**
- Test all videos before app deployment
- Verify QR code functionality
- Monitor app performance
- Track content delivery schedule
- Maintain automated systems

This framework ensures consistent, high-quality, safe, and engaging content across the entire Junior News Digest platform.
