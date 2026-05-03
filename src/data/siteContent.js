// To swap in the real DMG download URL, update DOWNLOAD_URL below.
export const DOWNLOAD_URL = 'https://github.com/ngisaiah/soundGuy/releases/download/V1.1.2/SoundGuy.dmg'

export const steps = [
  {
    number: '01',
    label: 'Say "SoundGuy"',
    description: 'Wake the app without touching anything.',
  },
  {
    number: '02',
    label: 'Wait for the beep',
    description: 'A short confirmation tone tells you SoundGuy is ready.',
  },
  {
    number: '03',
    label: 'Say a recording command',
    description: 'Say "record", "stop", "play", or "undo" while staying at the mic.',
  },
  {
    number: '04',
    label: 'Keep recording',
    description: 'Logic responds instantly, so you can stay focused on the next take.',
  },
]

export const features = [
  {
    icon: 'Radio',
    title: 'Hands-free recording control',
    description:
      'Record, stop, play, loop, and undo without walking back to your keyboard.',
  },
  {
    icon: 'WifiOff',
    title: 'Offline by design',
    description:
      'All speech processing happens on your Mac. Nothing leaves your machine — ever.',
  },
  {
    icon: 'Mic',
    title: 'Wake word detection',
    description:
      'Say "SoundGuy", wait for the beep, then control your session from the mic.',
  },
  {
    icon: 'Zap',
    title: 'Fast command recognition',
    description:
      'Local recognition keeps commands fast, reliable, and free from cloud delay.',
  },
  {
    icon: 'Keyboard',
    title: 'Logic Pro shortcuts',
    description:
      'SoundGuy maps your voice commands to real Logic Pro shortcuts for recording, playback, looping, undo, and track creation.',
  },
]

export const setupSteps = [
  {
    step: 1,
    title: 'Download SoundGuy',
    description: 'Grab the .dmg from the pricing section. The build is Apple-notarized and safe to open.',
  },
  {
    step: 2,
    title: 'Move to Applications',
    description: 'Drag SoundGuy.app from the disk image into your /Applications folder.',
  },
  {
    step: 3,
    title: 'Open Logic Pro X',
    description: 'Launch Logic Pro X first, then open SoundGuy. SoundGuy targets whichever Logic project is in focus.',
  },
  {
    step: 4,
    title: 'Open SoundGuy',
    description: 'Double-click to launch. On first open, macOS may ask you to confirm. Click Open.',
  },
  {
    step: 5,
    title: 'Enable Microphone access',
    description: 'SoundGuy needs your mic to hear commands.',
    path: 'System Settings → Privacy & Security → Microphone',
  },
  {
    step: 6,
    title: 'Enable Accessibility access',
    description: 'Required to inject keyboard shortcuts into Logic Pro X.',
    path: 'System Settings → Privacy & Security → Accessibility',
  },
  {
    step: 7,
    title: 'Start recording hands-free',
    description: 'Say "SoundGuy", wait for the beep, then control your session without leaving the mic.',
  },
]
