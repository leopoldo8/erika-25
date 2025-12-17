# 🎉 Interactive Birthday Experience App

An immersive, mobile-first birthday celebration featuring SVG stroke animations, gyroscope interaction, and a magical letter reveal experience.

## 🚀 Quick Start

### Install Dependencies
```bash
npm install
```

### Run Development Server
```bash
npm run dev
```

The app will open at `http://localhost:5173`

### Build for Production
```bash
npm run build
```

## 📱 Best Experienced On Mobile!

This app is designed as a mobile-first experience. Tell your loved one to open it on their phone for the full interactive experience with gyroscope motion detection!

## ✨ The Experience Journey

### Stage 1: Number Drawing Animation (0-5.5s)
- Each digit "25" is slowly drawn by animated stroke paths
- Numbers fill with vibrant red color
- Golden sparkles burst around the completed numbers

### Stage 2: Letter Box Reveal (5.5-7.5s)
- A beautiful wooden letter box rises from the bottom of the screen
- The lid slightly opens, teasing what's inside

### Stage 3: Turn Instruction (7.5s+)
- Screen fades to black
- Message appears: "Turn your device to reveal its secrets"
- Uses **Gyroscope API** to detect when the device is rotated 180°
- Fallback: Tap anywhere to proceed if gyroscope isn't available

### Stage 4: Letter & Celebration
- Letter drops from the box with spring physics
- Background transforms to cozy red gradient
- Heartfelt birthday message appears in a beautiful card
- Floating hearts and golden confetti create celebration atmosphere

## ✨ Features

- **SVG Stroke Animation**: Hand-drawn effect for the "25" numbers
- **Gyroscope Detection**: Interactive device rotation trigger
- **Letter Box Animation**: 3D-styled wooden box with opening lid
- **Spring Physics**: Natural letter drop animation
- **Floating Hearts & Confetti**: Continuous celebration particles
- **Mobile-First Design**: Optimized for phone screens
- **Smooth Transitions**: Professional fade and transform effects
- **Modern Stack**: React, Vite, TailwindCSS, Framer Motion

## ✏️ Customizing the Message

Edit the birthday message in `src/components/HomePage.jsx` around lines 270-300. Replace the text with your personal message while keeping the structure and animations intact.

## 🎨 Customization Ideas

- **Timing Adjustments**: Modify the `setTimeout` values in the `useEffect` hooks (lines 11-27)
- **Color Scheme**: Change the gradient colors in Tailwind classes
- **Message Content**: Personalize the letter text (lines 274-300)
- **Gyroscope Sensitivity**: Adjust the `delta > 150` threshold (line 56)
- **Animation Speed**: Modify `duration` values in Framer Motion transitions
- **Add Photos**: Add an image gallery section below the letter card

## 📦 Tech Stack

- React 18
- Vite 5
- TailwindCSS 3
- Framer Motion 10
- PostCSS & Autoprefixer
