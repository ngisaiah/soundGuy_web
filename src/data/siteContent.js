// To swap in the real DMG download URL, update DOWNLOAD_URL below.
export const DOWNLOAD_URL = 'https://example.com/soundguy.dmg'

export const steps = [
  {
    number: '01',
    label: 'Say "SoundGuy"',
    description: 'The wake word wakes the app from standby. No button press needed.',
  },
  {
    number: '02',
    label: 'Wait for the beep',
    description: 'A short confirmation tone tells you the app is ready for your command.',
  },
  {
    number: '03',
    label: 'Speak a command',
    description: 'Say "record", "stop", "undo" — any command mapped to a Logic Pro X shortcut.',
  },
  {
    number: '04',
    label: 'Logic Pro responds instantly',
    description: 'SoundGuy injects the keyboard shortcut directly into Logic Pro X. No cloud round-trip.',
  },
]

export const features = [
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
      'Say "SoundGuy" to activate. The app listens only for the wake word when idle, keeping CPU usage minimal.',
  },
  {
    icon: 'Zap',
    title: 'Fast command recognition',
    description:
      'Local inference means sub-second response times. No waiting for a server — the shortcut fires as soon as you finish speaking.',
  },
  {
    icon: 'Keyboard',
    title: 'Logic Pro X shortcuts',
    description:
      'Built specifically for Logic Pro X. Voice commands map directly to Logic\'s keyboard shortcuts — record, stop, loop, undo, and more.',
  },
]

export const setupSteps = [
  {
    step: 1,
    title: 'Download SoundGuy',
    description: 'Grab the .dmg from this page. The build is Apple-notarized and safe to open.',
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
    title: 'Start speaking',
    description: 'Say "SoundGuy", wait for the beep, then speak your first command.',
  },
]
