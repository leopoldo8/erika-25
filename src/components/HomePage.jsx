import { motion, AnimatePresence } from 'framer-motion'
import { useState, useEffect, useRef } from 'react'

const HomePage = () => {
  const [stage, setStage] = useState('welcome')
  const [gyroPermission, setGyroPermission] = useState(false)
  const [rotationAngle, setRotationAngle] = useState(0)
  const [letterboxOpening, setLetterboxOpening] = useState(false)
  const [letterEmerging, setLetterEmerging] = useState(false)
  const [showConfetti, setShowConfetti] = useState(false)
  const [showImages, setShowImages] = useState(false)
  const [musicStarted, setMusicStarted] = useState(false)
  const [showMusicControl, setShowMusicControl] = useState(false)
  const [currentTrack, setCurrentTrack] = useState(0)
  const [collectedLetters, setCollectedLetters] = useState([])
  const [showShakeSurprise, setShowShakeSurprise] = useState(false)
  const [showLetterCollection, setShowLetterCollection] = useState(false)
  const [hasShownSurprise, setHasShownSurprise] = useState(false)
  const [currentMessage, setCurrentMessage] = useState(null)
  const [messagePosition, setMessagePosition] = useState({ left: 50, top: 50 })
  const [debugMessages, setDebugMessages] = useState([])
  const [playlist] = useState([
    '/music/1.mp3',
    '/music/2.mp3',
    '/music/3.mp3',
    '/music/4.mp3',
    '/music/5.mp3',
  ])
  const [imageFiles] = useState([
    '/images/1.jpeg',
    '/images/2.jpeg',
    '/images/3.jpeg',
    '/images/4.jpeg',
    '/images/5.jpeg',
    '/images/6.jpeg',
    '/images/7.jpeg',
    '/images/8.jpeg',
    '/images/9.jpeg',
    '/images/10.jpeg',
    '/images/11.jpeg',
    '/images/12.jpeg',
    '/images/13.jpeg',
    '/images/14.jpeg',
    '/images/15.jpeg',
    '/images/16.jpeg',
    '/images/17.jpeg',
    '/images/18.jpeg',
    '/images/19.jpeg',
    '/images/20.jpeg',
    '/images/21.jpeg',
  ])
  const initialOrientationRef = useRef(null)
  const audioRef = useRef(null)
  const lastShakeTime = useRef(0)
  const shakeThreshold = 50

  useEffect(() => {
    if (stage === 'drawing') {
      // Request permission immediately on mobile
      requestGyroscopePermission()
    }
  }, [stage])

  // Shake detection
  useEffect(() => {
    if (letterEmerging) {
      const handleMotion = (event) => {
        const acceleration = event.accelerationIncludingGravity
        if (!acceleration) return

        const { x, y, z } = acceleration
        const total = Math.abs(x) + Math.abs(y) + Math.abs(z)
        const now = Date.now()

        if (total > shakeThreshold && now - lastShakeTime.current > 1000) {
          lastShakeTime.current = now
          triggerShakeSurprise()
        }
      }

      window.addEventListener('devicemotion', handleMotion)
      return () => window.removeEventListener('devicemotion', handleMotion)
    }
  }, [letterEmerging])

  const addDebugMessage = (msg) => {
    const timestamp = new Date().toLocaleTimeString()
    setDebugMessages(prev => [...prev.slice(-5), { msg, timestamp }])
  }

  const requestGyroscopePermission = async () => {
    if (typeof DeviceOrientationEvent !== 'undefined' && typeof DeviceOrientationEvent.requestPermission === 'function') {
      // iOS 13+ requires explicit permission
      try {
        const permission = await DeviceOrientationEvent.requestPermission()
        if (permission === 'granted') {
          setGyroPermission(true)
          startGyroscopeListener()
        }
      } catch (error) {
      }
    } else {
      // Android or older browsers - no permission needed
      setGyroPermission(true)
      startGyroscopeListener()
    }
  }

  const startGyroscopeListener = () => {
    const handleOrientation = (event) => {
      if (initialOrientationRef.current === null) {
        initialOrientationRef.current = event.beta
      }

      if (event.beta < -59 && stage === 'drawing' && !letterboxOpening) {
        setLetterboxOpening(true)
        setTimeout(() => setLetterEmerging(true), 800)
        setTimeout(() => setShowConfetti(true), 2500)
        setTimeout(() => setShowImages(true), 3000)
        window.removeEventListener('deviceorientation', handleOrientation)
      }
    }

    window.addEventListener('deviceorientation', handleOrientation)
  }

  const handleManualReveal = () => {
    if (stage === 'drawing' && !letterboxOpening) {
      setLetterboxOpening(true)
      setTimeout(() => setLetterEmerging(true), 800)
      setTimeout(() => setShowConfetti(true), 2500)
      setTimeout(() => setShowImages(true), 3000)
    }
  }

  const floatingHearts = Array.from({ length: 20 }, (_, i) => ({
    id: i,
    size: Math.random() * 20 + 15,
    left: Math.random() * 100,
    delay: Math.random() * 3,
    duration: Math.random() * 3 + 4,
  }))

  const loveLetters = Array.from({ length: 10 }, (_, i) => {
    // Distribute letters around the center area, avoiding extreme corners
    const positions = [
      { left: 20, top: 25 }, { left: 40, top: 20 }, { left: 60, top: 25 }, { left: 80, top: 30 },
      { left: 15, top: 50 }, { left: 85, top: 50 },
      { left: 20, top: 75 }, { left: 40, top: 80 }, { left: 60, top: 75 }, { left: 80, top: 70 }
    ];
    return {
      id: i,
      left: positions[i].left,
      top: positions[i].top,
      delay: 5 + i * 3,
      message: [
        "Você é meu sol 🌞",
        "Gatinha comunista ❤️",
        "O Snape teria orgulho de você",
        "Pode deixar que vou contar pro Loki como você é forte",
        "Na proxima eu escrevo uma fanfic do Snape, prometo",
        "Espero que não tenha tido bugs no site",
        "Será que vc vai ler todas essas mengens mesmo?",
        "A mulher mais forte e independente que ja conheci ❤️",
        "Bruxinha rabuda",
      ][i]
    };
  })

  const handleCollectLetter = (e, id, message, position) => {
    e.preventDefault()
    e.stopPropagation()
    if (!collectedLetters.includes(id)) {
      setCollectedLetters(prev => [...prev, id])
      setMessagePosition({ left: position.left, top: position.top })
      setCurrentMessage(message)
      setTimeout(() => setCurrentMessage(null), 3000)
    }
  }

  const triggerShakeSurprise = () => {
    setShowShakeSurprise(true)
    if (!hasShownSurprise) {
      setHasShownSurprise(true)
      setTimeout(() => {
        setShowLetterCollection(true)
      }, 3000)
    }
    setTimeout(() => {
      setShowShakeSurprise(false)
    }, 3000)
  }

  const playCurrentTrack = () => {
    if (audioRef.current) {
      audioRef.current.load()
      audioRef.current.play().then(() => {
      }).catch(err => {
        setShowMusicControl(true)
      })
    }
  }

  const handleTrackEnded = () => {
    const nextTrack = (currentTrack + 1) % playlist.length
    setCurrentTrack(nextTrack)
  }

  const handleWelcomeClick = () => {
    setMusicStarted(true)
    setStage('drawing')
    
    // Try to play audio after stage transition
    setTimeout(() => {
      playCurrentTrack()
    }, 500)
  }

  return (
    <div className="relative w-full h-screen overflow-hidden touch-none">
      <AnimatePresence mode="wait">
        {stage === 'welcome' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1 }}
            onClick={handleWelcomeClick}
            className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-rose-100 via-pink-100 to-red-100 cursor-pointer"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.8, ease: "easeOut" }}
              className="text-center px-8 max-w-md"
            >
              <motion.div
                animate={{ 
                  scale: [1, 1.05, 1],
                  rotate: [0, 2, -2, 0]
                }}
                transition={{ 
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                className="text-6xl mb-8"
              >
                ✨
              </motion.div>
              
              <h1 className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-600 via-red-600 to-rose-700 mb-6">
                apenas um pequeno momento
              </h1>
              
              <p className="text-gray-700 text-lg md:text-xl mb-8 leading-relaxed">
                de homenagem a alguem tão especial
              </p>
              
              <motion.div
                animate={{ 
                  y: [0, -10, 0],
                  opacity: [0.7, 1, 0.7]
                }}
                transition={{ 
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                className="text-rose-500 text-base md:text-lg font-medium"
              >
                Preciso que tu aperte na tela para começarmos..... clica ai vai
              </motion.div>
            </motion.div>
          </motion.div>
        )}

        {stage === 'drawing' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-pink-50 via-rose-50 to-red-50"
          >
            <motion.div
              className="relative mb-20"
              initial={{ rotate: 0 }}
              animate={{ rotate: 180 }}
              transition={{ delay: 8, duration: 2, ease: "easeInOut" }}
            >
              <style jsx>{`
                @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&display=swap');
                
                .stroke-text {
                  font-family: 'Bebas Neue', 'Impact', sans-serif;
                  font-size: 200px;
                  font-weight: 900;
                  fill: none;
                  stroke: #dc2626;
                  stroke-width: 3;
                  stroke-dasharray: 1000;
                  stroke-dashoffset: 1000;
                  animation: draw 2.5s ease-in-out forwards;
                }
                
                .fill-text {
                  font-family: 'Bebas Neue', 'Impact', sans-serif;
                  font-size: 200px;
                  font-weight: 900;
                  fill: #dc2626;
                  opacity: 0;
                  animation: fillIn 0.6s ease-out 2.8s forwards;
                }
                
                @keyframes draw {
                  to {
                    stroke-dashoffset: 0;
                  }
                }
                
                @keyframes fillIn {
                  to {
                    opacity: 1;
                  }
                }
              `}</style>
              
              <svg viewBox="0 0 400 250" className="w-[90vw] max-w-[500px] h-auto">
                <text x="200" y="180" textAnchor="middle" className="stroke-text">
                  25
                </text>
                <text x="200" y="180" textAnchor="middle" className="fill-text">
                  25
                </text>
              </svg>
              
              <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 4, duration: 0.6 }}
                className="absolute inset-0 flex items-center justify-center pointer-events-none"
              >
                {Array.from({ length: 30 }, (_, i) => {
                  const angle = (i / 30) * Math.PI * 2
                  const radius = 180 + Math.random() * 60
                  const x = Math.cos(angle) * radius
                  const y = Math.sin(angle) * radius
                  return (
                    <motion.div
                      key={i}
                      className="absolute w-2 h-2 rounded-full bg-yellow-400"
                      style={{
                        left: `calc(50% + ${x}px)`,
                        top: `calc(50% + ${y}px)`,
                      }}
                      animate={{
                        opacity: [0, 1, 0],
                        scale: [0, 1.5, 0],
                      }}
                      transition={{
                        duration: 1,
                        repeat: 1,
                        delay: i * 0.03,
                      }}
                    />
                  )
                })}
              </motion.div>
            </motion.div>

            <motion.div
              initial={{ y: 200, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 5, duration: 1.5, ease: "easeOut" }}
              className="absolute -bottom-10 w-[300px] md:w-[350px]"
            >
              <svg viewBox="0 0 350 200" className="w-full h-auto drop-shadow-2xl" style={{ overflow: 'visible' }}>
                <defs>
                  <linearGradient id="paperGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#fefce8" />
                    <stop offset="50%" stopColor="#fef9c3" />
                    <stop offset="100%" stopColor="#fef08a" />
                  </linearGradient>
                  <linearGradient id="flapGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#fcd34d" />
                    <stop offset="50%" stopColor="#fbbf24" />
                    <stop offset="100%" stopColor="#f59e0b" />
                  </linearGradient>
                  <filter id="paperShadow">
                    <feGaussianBlur in="SourceAlpha" stdDeviation="3"/>
                    <feOffset dx="0" dy="2" result="offsetblur"/>
                    <feComponentTransfer>
                      <feFuncA type="linear" slope="0.3"/>
                    </feComponentTransfer>
                    <feMerge>
                      <feMergeNode/>
                      <feMergeNode in="SourceGraphic"/>
                    </feMerge>
                  </filter>
                </defs>

                <rect 
                  x="25" 
                  y="60" 
                  width="300" 
                  height="140" 
                  rx="4" 
                  fill="url(#paperGradient)"
                  stroke="#d97706"
                  strokeWidth="2"
                  filter="url(#paperShadow)"
                />

                <rect x="45" y="80" width="260" height="3" rx="1.5" fill="#f59e0b" opacity="0.15" />
                <rect x="45" y="100" width="260" height="3" rx="1.5" fill="#f59e0b" opacity="0.15" />
                <rect x="45" y="120" width="180" height="3" rx="1.5" fill="#f59e0b" opacity="0.15" />

                <path
                  d="M 25 60 L 175 130 L 325 60"
                  fill="#f59e0b"
                  stroke="#d97706"
                  strokeWidth="1.5"
                  opacity="0.8"
                />

                <motion.g
                  animate={letterboxOpening ? "open" : "closed"}
                  variants={{
                    closed: {
                      transform: 'scaleY(1) translateY(0)',
                    },
                    open: {
                      transform: 'scaleY(-1) translateY(60px)',
                    }
                  }}
                  transition={{ duration: 1.5, ease: [0.4, 0, 0.2, 1] }}
                >
                  <path
                    d="M 25 60 L 175 125 L 325 60 Z"
                    fill="url(#flapGradient)"
                    stroke="#d97706"
                    strokeWidth="2"
                    filter="url(#paperShadow)"
                  />
                  <line x1="175" y1="125" x2="25" y2="60" stroke="#b45309" strokeWidth="1" opacity="0.3" />
                  <line x1="175" y1="125" x2="325" y2="60" stroke="#b45309" strokeWidth="1" opacity="0.3" />
                </motion.g>
                
                <motion.g
                  animate={letterboxOpening ? {
                    y: -200,
                    opacity: 0,
                    rotate: [0, 180, 360]
                  } : {
                    y: 0,
                    opacity: 1,
                    rotate: 0
                  }}
                  transition={{ duration: 1.2, ease: "easeIn" }}
                >
                  <circle cx="175" cy="120" r="18" fill="#dc2626" opacity="0.95"/>
                  <circle cx="175" cy="120" r="14" fill="#b91c1c" opacity="0.8"/>
                  <path
                    d="M 166 120 Q 175 112 184 120 Q 175 128 166 120"
                    fill="#fef3c7"
                    opacity="0.9"
                  />
                </motion.g>
              </svg>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: letterboxOpening ? 0 : 1 }}
              transition={{ delay: 12, duration: 2 }}
              className="absolute top-20 text-center px-8"
            >
              {!gyroPermission && (
                <motion.button
                  onClick={requestGyroscopePermission}
                  className="bg-rose-500 text-white px-6 py-3 rounded-full mb-4 font-medium shadow-lg hover:bg-rose-600 transition-colors"
                  whileTap={{ scale: 0.95 }}
                >
                  Ativar Sensor de Movimento
                </motion.button>
              )}
              <p className="text-rose-600 text-xl md:text-2xl font-light mb-2">
                hmmm e se tu virar a tela de cabeça para baixo?
              </p>
              <p className="text-rose-400 text-sm md:text-base">
                quando ve abre esse envelope ai ↻
              </p>
            </motion.div>

            {/* Audio Player */}
            {musicStarted && (
              <>
                <audio
                  ref={audioRef}
                  src={playlist[currentTrack]}
                  preload="auto"
                  onPlay={() => console.log('Audio started playing')}
                  onEnded={handleTrackEnded}
                  onError={(e) => {
                    console.log('Audio error:', e)
                    setShowMusicControl(true)
                  }}
                />
                {showMusicControl && (
                  <motion.div
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="fixed bottom-4 right-4 z-50 bg-white/95 backdrop-blur-lg rounded-2xl shadow-2xl p-4"
                  >
                    <div className="flex flex-col gap-2">
                      <p className="text-sm font-medium text-gray-700 mb-2">🎵 Controle de Música</p>
                      <button
                        onClick={() => {
                          playCurrentTrack()
                          setShowMusicControl(false)
                        }}
                        className="bg-rose-500 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-rose-600 transition-colors"
                      >
                        ▶️ Tocar Música
                      </button>
                      <button
                        onClick={() => setShowMusicControl(false)}
                        className="text-gray-500 text-xs hover:text-gray-700"
                      >
                        Ocultar
                      </button>
                    </div>
                  </motion.div>
                )}
              </>
            )}

            <AnimatePresence>
              {letterEmerging && (
                <>
                  <motion.div
                    key="background"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 1.5, delay: 0.5 }}
                    className="absolute inset-0 bg-gradient-to-br from-red-400/90 via-rose-500/90 to-pink-600/90"
                  />
                  
                  <motion.div
                    key="letter-card"
                    initial={{ y: 400, opacity: 0, scale: 0.3, rotate: 0 }}
                    animate={{ 
                      y: [500, 0],
                      opacity: [0, 1, 1, 1, 1],
                      scale: [0.3, 0.3, 0.3, 0.3, 1],
                      rotate: [0, 0, 0, 0, 180]
                    }}
                    exit={{ opacity: 0 }}
                    transition={{ 
                      duration: 3.5,
                      times: [0, 0.1, 0.2, 0.3, 1],
                      ease: [0.4, 0, 0.2, 1]
                    }}
                    className="absolute inset-0 flex items-center justify-center px-6 py-8 overflow-y-auto pointer-events-none"
                  >
                    <motion.div
                      className="bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl p-8 md:p-12 max-w-lg w-full max-h-[90vh] overflow-y-auto relative z-10 pointer-events-auto"
                    >
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 2, duration: 0.8 }}
                  className="text-center"
                >
                  <h1 className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-600 via-red-600 to-rose-700 mb-6">
                    Parabéns mozauuuuu!
                  </h1>
                  
                  <div className="space-y-4 text-gray-700 text-base md:text-lg leading-relaxed">
                    <p className="font-medium">Érika Alexia Teixeira Seabra Menna Barreto de Melo Haertel,</p>
                    
                    <p>
                      hoje é seu dia e não podia não criar uma homenagem para vc com
                      as ferramentas que possuo algum dominio (não muito também)
                    </p>
                    
                    <p>
                      tu é foda demais, serio. dificil dizer quantas vezes eu me espanto com
                      sua inteligencia, facilidade em aprender e dominar as coisas muito mais rapido que eu,
                      com sua coragem de desbravar caminhos e acelerar mesmo ainda aprendendo a dirigar,
                      com sua perseverança em continuar desenhando e criando artes lindas mesmo com todas
                      as desaventuas que passamos ao longo desse ano.
                    </p>
                    
                    <p>
                      eu te amo muito mozao e sinto o mais puro privilegio de estar aqui ao seu lado,
                      vendo sua evolução, aprendendo contigo e te ajudando no que posso. Você é muito especial
                      para qualquer um que tenha passado ao menos uma call no skype com você, e não imagino
                      o que seria de mim sem aquelas noites de genio quiz, calls gigantecas que se transformaram
                      na nossa vida hoje com uma casinha, filhos totosos e peludos, e muito amor ❤️
                    </p>
                    
                    <p className="font-semibold italic text-rose-700 pt-4">
                      aproveita teu dia e embora o Leonardo Di Caprio pode te achar meio velha já,
                      esse é ainda o inicio desse caminho que andar até o último dos meus passos contigo
                    </p>
                    
                    <p className="text-right text-gray-600 pt-2">
                      quando nos venus,<br />
                      <span className="text-xl md:text-2xl italic">juro a marte</span>
                    </p>
                  </div>
                </motion.div>

                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 3 }}
                      className="mt-6 text-center text-sm text-gray-500"
                    >
                      <p>💝</p>
                    </motion.div>
                    </motion.div>
                  </motion.div>

                  {/* Mini Love Letter Envelopes */}
                  {letterEmerging && showLetterCollection && loveLetters.map((letter) => (
                    <AnimatePresence key={letter.id}>
                      {!collectedLetters.includes(letter.id) && (
                        <motion.div
                          initial={{ scale: 0, opacity: 0, rotate: 0 }}
                          animate={{ 
                            scale: [0, 1.1, 1],
                            opacity: 1,
                            rotate: letterEmerging ? 180 : 0,
                            y: [0, -5, 0]
                          }}
                          exit={{ 
                            scale: [1, 1.2, 0],
                            opacity: [1, 0.5, 0],
                            rotate: letterEmerging ? [180, 220, 270] : [0, 90, 180],
                            y: [0, -20, -30]
                          }}
                          transition={{
                            delay: letter.delay,
                            duration: 0.5,
                            y: {
                              duration: 2,
                              repeat: Infinity,
                              ease: "easeInOut"
                            },
                            exit: {
                              duration: 0.4,
                              ease: "easeOut"
                            }
                          }}
                          onTap={(e) => {
                            handleCollectLetter(e, letter.id, letter.message, { left: letter.left, top: letter.top })
                          }}
                          className="absolute cursor-pointer z-25 hover:scale-110 transition-transform"
                          style={{
                            left: `${letter.left}%`,
                            top: `${letter.top}%`,
                          }}
                        >
                          <div className="relative">
                            <div className="text-4xl md:text-5xl drop-shadow-lg">
                              💌
                            </div>
                            <motion.div
                              animate={{ scale: [1, 1.2, 1] }}
                              transition={{ duration: 1, repeat: Infinity }}
                              className="absolute -top-1 -right-1 w-3 h-3 bg-rose-500 rounded-full"
                            />
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  ))}

                  {/* Shake Surprise Effect */}
                  <AnimatePresence>
                    {showShakeSurprise && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 pointer-events-none z-40"
                      >
                        {/* Burst of extra hearts */}
                        {Array.from({ length: 30 }, (_, i) => (
                          <motion.div
                            key={`surprise-heart-${i}`}
                            className="absolute text-4xl"
                            style={{
                              left: '50%',
                              top: '50%',
                            }}
                            initial={{ scale: 0, x: 0, y: 0, opacity: 1 }}
                            animate={{
                              scale: [0, 1.5, 1],
                              x: (Math.random() - 0.5) * 400,
                              y: (Math.random() - 0.5) * 400,
                              opacity: [1, 1, 0],
                              rotate: Math.random() * 360
                            }}
                            transition={{
                              duration: 2,
                              ease: "easeOut"
                            }}
                          >
                            {['❤️', '💕', '💖', '💗', '💓', '💝'][Math.floor(Math.random() * 6)]}
                          </motion.div>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Collected Letter Message Display */}
                  <AnimatePresence>
                    {currentMessage && (
                      <motion.div
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.8, y: -30, opacity: 0 }}
                        transition={{ type: "spring", duration: 0.5, bounce: 0.4 }}
                        className="absolute z-50 pointer-events-none"
                        style={{ 
                          left: `${messagePosition.left}%`,
                          top: `${messagePosition.top}%`,
                          transform: 'translate(-50%, -50%)',
                          rotate: letterEmerging ? '180deg' : '0deg'
                        }}
                      >
                        <div className="bg-white/95 backdrop-blur-lg rounded-2xl shadow-2xl px-5 py-3 max-w-xs">
                          <div className="flex items-center gap-2">
                            <div className="text-2xl">💌</div>
                            <div className="text-gray-800 font-medium text-sm leading-relaxed">
                              {currentMessage}
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {showConfetti && floatingHearts.map((heart) => (
                    <motion.div
                      key={heart.id}
                      className="absolute pointer-events-none z-0"
                      style={{
                        left: `${heart.left}%`,
                        fontSize: `${heart.size}px`,
                      }}
                      initial={{ y: '100vh', opacity: 0 }}
                      animate={{ 
                        y: '-20vh',
                        opacity: [0, 1, 1, 0],
                        x: [0, Math.random() * 30 - 15, 0],
                        rotate: [0, 360]
                      }}
                      transition={{
                        duration: heart.duration,
                        delay: heart.delay + 1,
                        repeat: Infinity,
                        ease: "linear"
                      }}
                    >
                      ❤️
                    </motion.div>
                  ))}

                  {showImages && Array.from({ length: 8 }, (_, i) => {
                    // Position images in corners only
                    const corners = [
                      { left: 5, top: 5 },     // top-left
                      { left: 85, top: 5 },    // top-right
                      { left: 5, top: 80 },    // bottom-left
                      { left: 85, top: 80 },   // bottom-right
                      { left: 5, top: 40 },    // mid-left
                      { left: 85, top: 40 },   // mid-right
                      { left: 40, top: 5 },    // top-center
                      { left: 40, top: 85 }    // bottom-center
                    ];
                    const position = corners[i % corners.length];
                    const startDelay = 3 + i * 5;
                    const showDuration = 6 + Math.random() * 3;
                    const randomImage = imageFiles[Math.floor(Math.random() * imageFiles.length)];
                    
                    return (
                      <motion.div
                        key={`image-${i}`}
                        className="absolute w-24 h-24 md:w-32 md:h-32 rounded-2xl shadow-xl z-20 overflow-hidden pointer-events-none"
                        style={{
                          left: `${position.left}%`,
                          top: `${position.top}%`,
                          rotate: letterEmerging ? '180deg' : '0deg'
                        }}
                        initial={{ scale: 0, rotate: 0, opacity: 0 }}
                        animate={{ 
                          scale: [0, 1.1, 1, 1, 0],
                          rotate: letterEmerging ? [180, 190, 175, 180, 170] : [0, 10, -5, 0, -10],
                          opacity: [0, 1, 1, 1, 0]
                        }}
                        transition={{
                          duration: showDuration,
                          delay: startDelay,
                          times: [0, 0.15, 0.2, 0.85, 1],
                          ease: "easeInOut"
                        }}
                      >
                        <img 
                          src={randomImage} 
                          alt="" 
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.target.style.display = 'none';
                            e.target.parentElement.innerHTML = '📷';
                            e.target.parentElement.classList.add('bg-gradient-to-br', 'from-pink-200', 'to-rose-300', 'flex', 'items-center', 'justify-center', 'text-4xl');
                          }}
                        />
                      </motion.div>
                    );
                  })}

                  {showConfetti && Array.from({ length: 30 }, (_, i) => (
                    <motion.div
                      key={`confetti-${i}`}
                      className="absolute w-2 h-2 md:w-3 md:h-3 rounded-full z-0"
                      style={{
                        left: `${Math.random() * 100}%`,
                        top: '-10%',
                        backgroundColor: ['#fbbf24', '#f59e0b', '#fb923c', '#fdba74', '#fcd34d'][Math.floor(Math.random() * 5)]
                      }}
                      animate={{
                        y: ['0vh', '110vh'],
                        x: [0, Math.random() * 100 - 50],
                        rotate: [0, Math.random() * 720],
                        opacity: [1, 1, 0]
                      }}
                      transition={{
                        duration: Math.random() * 3 + 4,
                        delay: Math.random() * 3 + 1,
                        repeat: Infinity,
                        ease: "linear"
                      }}
                    />
                  ))}
                </>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Debug Messages Overlay */}
      {debugMessages.length > 0 && (
        <div className="fixed top-4 left-4 z-[9999] max-w-xs">
          <div className="bg-black/80 text-white text-xs p-3 rounded-lg shadow-2xl backdrop-blur-sm">
            <div className="font-bold mb-2 text-green-400">🐛 Debug Log:</div>
            {debugMessages.map((debug, i) => (
              <div key={i} className="mb-1 font-mono">
                <span className="text-gray-400">{debug.timestamp}</span>
                <br />
                <span className="text-white">{debug.msg}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default HomePage
