# Music Files - Playlist

Place your audio files here with these names:
- `song1.mp3`
- `song2.mp3`
- `song3.mp3`
- etc.

Or update the playlist in `src/components/HomePage.jsx` lines 21-26:
```javascript
const [playlist] = useState([
  '/music/song1.mp3',
  '/music/song2.mp3',
  '/music/song3.mp3',
  '/music/your-song-4.mp3',
  // Add as many songs as you want
])
```

## Supported formats:
- MP3 (recommended)
- WAV
- OGG
- M4A

## How it works:
- Songs play sequentially (one after another)
- When the last song ends, playlist loops back to the first song
- Continues indefinitely throughout the experience
