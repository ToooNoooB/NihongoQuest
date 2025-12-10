
// Robust wrapper for Web Speech API to ensure instant, glitch-free audio playback
// Addresses common issues like garbage collection cutting off audio and network latency

let activeUtterance: SpeechSynthesisUtterance | null = null;
let cachedVoice: SpeechSynthesisVoice | null = null;

// Helper to select the best possible voice (Prioritizing Local/Offline for speed)
const selectBestVoice = (): SpeechSynthesisVoice | null => {
  const voices = window.speechSynthesis.getVoices();
  if (voices.length === 0) return null;

  // 1. Local Service + Japanese (Fastest, No Lag)
  let voice = voices.find(v => (v.lang === 'ja-JP' || v.lang === 'ja_JP') && v.localService);
  
  // 2. Any Japanese Voice
  if (!voice) {
    voice = voices.find(v => v.lang === 'ja-JP' || v.lang === 'ja_JP');
  }

  // 3. Fallback to any 'ja' prefix
  if (!voice) {
    voice = voices.find(v => v.lang.startsWith('ja'));
  }

  return voice || null;
};

// Initialize voices
if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
  const initVoices = () => {
    cachedVoice = selectBestVoice();
  };
  
  window.speechSynthesis.onvoiceschanged = initVoices;
  // Try immediately
  initVoices();
}

export const audioService = {
  speak: (text: string) => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      return;
    }

    const synth = window.speechSynthesis;

    // 1. Stop previous audio immediately (This prevents queue lag)
    if (synth.speaking || synth.pending) {
      synth.cancel();
    }

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'ja-JP';
    utterance.rate = 1.0;
    utterance.volume = 1.0;

    // 2. Use Cached Voice (Avoids iterating array on every click)
    if (!cachedVoice) {
      cachedVoice = selectBestVoice();
    }
    if (cachedVoice) {
      utterance.voice = cachedVoice;
    }

    // 3. Garbage Collection Defense (Prevents audio cutting off halfway)
    activeUtterance = utterance;
    utterance.onend = () => {
      activeUtterance = null;
    };
    utterance.onerror = () => {
      activeUtterance = null;
    };

    // 4. Speak Immediately (No SetTimeout)
    synth.speak(utterance);

    // 5. Force Resume (Fixes Mobile Safari/Chrome 'stuck' state)
    if (synth.paused) {
      synth.resume();
    }
  }
};
