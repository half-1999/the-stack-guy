import { useState, useRef } from 'react';
import { toPng } from 'html-to-image';
import {
  Quote, Heart, Sun, CloudRain, Zap, Sparkles,
  Instagram, Download, Copy, Check, Image,
  Type, Palette as PaletteIcon, Download as DownloadIcon,
  Smile, Meh, Flame, Star, Moon, Leaf, Layout, History,
  BadgeCheck, Share2
} from 'lucide-react';

const MOODS = [
  { id: 'inspirational', label: 'Purple', icon: Sun, color: '#fff', bg: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' },
  { id: 'romantic', label: 'Pink', icon: Heart, color: '#fff', bg: 'linear-gradient(135deg, #ff9a9e 0%, #fecfef 50%, #ff69b4 100%)' },
  { id: 'heartbreak', label: 'Red', icon: CloudRain, color: '#fff', bg: 'linear-gradient(135deg, #c0392b 0%, #8e44ad 100%)' },
  { id: 'motivational', label: 'Orange', icon: Zap, color: '#fff', bg: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)' },
  { id: 'happy', label: 'Green', icon: Smile, color: '#fff', bg: 'linear-gradient(135deg, #84fab0 0%, #8fd3f4 100%)' },
  { id: 'nature', label: 'Nature', icon: Leaf, color: '#fff', bg: 'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)' },
  { id: 'night', label: 'Night', icon: Moon, color: '#fff', bg: 'linear-gradient(135deg, #0f0c29 0%, #302b63 50%, #24243e 100%)' },
  { id: 'fire', label: 'Fire', icon: Flame, color: '#fff', bg: 'linear-gradient(135deg, #ff4b1f 0%, #ff9068 100%)' },
  { id: 'royal', label: 'Gold', icon: Star, color: '#fff', bg: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)' },
  { id: 'ocean', label: 'Ocean', icon: Star, color: '#fff', bg: 'linear-gradient(180deg, #1e3c72 0%, #2a5298 100%)' }
];

const BACKGROUND_IMAGES = [
  { id: 'floral', name: 'Floral', url: 'https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?w=800' },
  { id: 'gradient', name: 'Abstract', url: 'https://images.unsplash.com/photo-1557683316-973673baf926?w=800' },
  { id: 'marble', name: 'Marble', url: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800' },
  { id: 'sunset', name: 'Sunset', url: 'https://images.unsplash.com/photo-1507400492013-162706c8c05e?w=800' },
  { id: 'stars', name: 'Stars', url: 'https://images.unsplash.com/photo-1534796636912-3b95b3ab5986?w=800' },
  { id: 'nature', name: 'Nature', url: 'https://images.unsplash.com/photo-1501854140801-50d01698950b?w=800' },
  { id: 'neon', name: 'Neon', url: 'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?w=800' },
  { id: 'gold', name: 'Gold', url: 'https://images.unsplash.com/photo-1511909525232-61113c912358?w=800' }
];

const FONTS = [
  { id: 'dancing', name: 'Dancing', family: "'Dancing Script', cursive", style: 'italic' },
  { id: 'pacifico', name: 'Pacifico', family: "'Pacifico', cursive", style: 'italic' },
  { id: 'great', name: 'Great Vibes', family: "'Great Vibes', cursive", style: 'italic' },
  { id: 'playfair', name: 'Playfair', family: "'Playfair Display', serif", style: 'normal' },
  { id: 'oswald', name: 'Oswald', family: "'Oswald', sans-serif", style: 'normal' },
  { id: 'montserrat', name: 'Montserrat', family: "'Montserrat', sans-serif", style: 'normal' },
  { id: 'poppins', name: 'Poppins', family: "'Poppins', sans-serif", style: 'normal' },
  { id: 'raleway', name: 'Raleway', family: "'Raleway', sans-serif", style: 'normal' },
  { id: 'lora', name: 'Lora', family: "'Lora', serif", style: 'italic' },
  { id: 'cinzel', name: 'Cinzel', family: "'Cinzel', serif", style: 'normal' },
  { id: 'bebas', name: 'Bebas', family: "'Bebas Neue', sans-serif", style: 'normal' },
  { id: 'archer', name: 'Archer', family: "'Archetype', serif", style: 'normal' },
  { id: 'sacramento', name: 'Sacramento', family: "'Sacramento', cursive", style: 'italic' },
  { id: 'permanent', name: 'Permanent', family: "'Permanent Marker', cursive", style: 'italic' },
  { id: 'alexbrush', name: 'Alex Brush', family: "'Alex Brush', cursive", style: 'italic' },
  { id: 'libre', name: 'Libre Baskerville', family: "'Libre Baskerville', serif", style: 'italic' },
  { id: 'vollkorn', name: 'Vollkorn', family: "'Vollkorn', serif", style: 'normal' },
  { id: 'josefin', name: 'Josefin', family: "'Josefin Sans', sans-serif", style: 'normal' },
  { id: 'abel', name: 'Abel', family: "'Abel', sans-serif", style: 'normal' },
  { id: 'righteous', name: 'Righteous', family: "'Righteous', cursive", style: 'normal' }
];

const LAYOUTS = [
  { id: 1, name: 'Center', position: 'center', overlay: false },
  { id: 2, name: 'Top Center', position: 'top-center', overlay: false },
  { id: 3, name: 'Bottom Center', position: 'bottom-center', overlay: false },
  { id: 4, name: 'Left', position: 'left', overlay: false },
  { id: 5, name: 'Right', position: 'right', overlay: false },
  { id: 6, name: 'Center Dark', position: 'center', overlay: true },
  { id: 7, name: 'Quote Style', position: 'center', overlay: 'quote' },
  { id: 8, name: 'Boxed', position: 'center', overlay: 'boxed' },
  { id: 9, name: 'Minimal', position: 'minimal', overlay: false },
  { id: 10, name: 'Frame', position: 'center', overlay: 'frame' }
];

const EMOJIS = ['✨', '💫', '🌟', '⭐', '🔥', '💥', '❤️', '💯', '🙏', '🙌', '💪', '🌈', '🎯', '🚀', '💡', '⚡', '🌸', '🌺', '🎨', '📝'];

const HINDI_QUOTES = {
  short: [
    "कोडिंग सीखो, सपने पूरो। 💻",
    "बग मिले, फिक्र न करो। 🐛",
    "कोड लिखो, ड्रीम बनाओ। ✨",
    "हार न मानो, कोड लिखो। 💪",
    "लाइन लिखो, सफलता पाओ। 📝"
  ],
  medium: [
    "कोडिंग सीखो, सपने पूरे करो। 💻\nहर बग एक लेसन है, समझो। 🔍",
    "कंप्यूटर के सामने बैठो। 💻\nकोड लिखो, ड्रीम बनाओ। ✨"
  ],
  long: [
    "कोडिंग सीखो, सपने पूरे करो। 💻\nहर बग एक लेसन है, समझो। 🔍\nप्रैक्टिस से महारत होती है। ⚡\nआज सीखो, कल महारानी बनो। 👑",
    "तूने कोडिंग सीखी, ज़िंदगी बदल गई। 💻\nहर बग से सीखा, हर एरर से समझा। 🐛\nडेटा फ्लो हुआ, दिल भी धड़का। 💔\nतू ही मेरा सबसे बेस्ट कोडर है। 👨‍💻"
  ],
  heartbreak: [
    "तू चला गया, मेरा कोड अधूरा रहा। 💔\nबिना तेरे, मेरा loop अनंत चला। 🔄\n404 error आता है, तेरा नाम खोजने में। 🔍\nHeart में तेरा exception, कभी handle नहीं हुआ। 💔",
    "कोड में तेरा नाम था, मिटा दिया। 🗑️\nCommits सब हटाए, तेरे साथ वाले। 😢\nDeploy हुआ तेरा जवाब, बिना बताए। 🚀\nHeart broken है, पर code still running है। 💻"
  ]
};

const SAMPLE_QUOTES = {
  inspirational: {
    short: [
      "Code is poetry. 💻",
      "Ship fast, learn faster. ⚡",
      "Write, debug, repeat. 🔄",
      "Ship code daily. 🚀"
    ],
    medium: [
      "Code is poetry, written in logic. 💻\nEvery line brings you closer to success. ✨",
      "Write code that makes a difference. 💡\nSolve problems, one function at a time. 🎯"
    ],
    long: [
      "Code is poetry, written in logic. 💻\nEvery line you write, brings you closer. ✨\nDebug with patience, code with passion. 🔥\nYour code today, builds your tomorrow. 🚀",
      "Write code that makes a difference. 💡\nSolve problems, one function at a time. 🎯\nLearn from every error, grow every day. 📈\nThe best code is the one you write. ✨",
      "First solve the problem. Then write code. 💻\nKeep it simple, keep it clean. 🎨\nCode like no one's watching. 😎\nShip fast, fix later. ⚡"
    ]
  },
  romantic: {
    short: [
      "I heart you. ❤️",
      "You're my CSS to my HTML. 💻",
      "Merge our hearts. 💕",
      "My heart beats API calls. 🌐"
    ],
    medium: [
      "I love you more than all my commits. 💻\nYou're my favorite pull request. 💕",
      "You're the CSS to my HTML. 💻\nYou make my heart render perfectly. ❤️"
    ],
    long: [
      "I love you more than all my commits. 💻\nYou're my favorite pull request. 💕\nWithout you, my code is incomplete. 💖\nLet's merge our hearts together. 💘",
      "You're the CSS to my HTML. 💻\nYou make my heart render perfectly. ❤️\nI want to spend my loops with you. 💕\nYou're the bug I never want to fix. 💖"
    ]
  },
  heartbreak: {
    short: [
      "Null pointer in my heart. 💔",
      "404: Happiness not found. 🔍",
      "Memory leak in feelings. 😢",
      "Heart got segmentation fault. 💔"
    ],
    medium: [
      "Null pointer exception, in my heart. 💔\nMemory leak, in my feelings. 😢",
      "The bug I can't fix, is missing you. 🐛\nStack overflow, in my mind. 🧠"
    ],
    long: [
      "Null pointer exception, in my heart. 💔\nMemory leak, in my feelings. 😢\n404: Happiness not found. 🔍\nSometimes life gives undefined errors. 💻",
      "The bug I can't fix, is missing you. 🐛\nStack overflow, in my mind. 🧠\nSegmentation fault, in my dreams. 💔\nCan't catch the exceptions, called loneliness.",
      "Empty array, of happy moments. 📭\nSegfault, when you're not around. 💔\nBlue screen, of my life. 💻\nWaiting for timeout, of this pain. ⏰",
      "You left without warning, like an uncaught error. 🐛\nMy heart threw exception, no catch block found. 💔\nFinally block ran, but you still stayed gone. 😢\nNow I'm stuck in infinite loop, of missing you. 🔄"
    ]
  },
  motivational: {
    short: [
      "Don't stop. Keep coding. 💪",
      "Ship it, fix later. 🚀",
      "Debug and conquer. 🔥",
      "Code beats everything. 💻"
    ],
    medium: [
      "Don't stop coding when tired. 💻\nStop when your code is done. 🏆",
      "Code is 10% writing, 90% debugging. 💻\nEmbrace the errors, they teach you. 📚"
    ],
    long: [
      "Don't stop coding when you're tired. 💻\nStop when your code is done. 🏆\nShip it, fix it later. 🚀\nShip fast, break things, learn more. ⚡",
      "Code is 10% writing, 90% debugging. 💻\nEmbrace the errors, they teach you. 📚\nEvery expert was once a beginner. 🌱\nYour code today, is your legacy tomorrow. ✨",
      "Hard work beats talent, when talent doesn't code. 💪\nWrite code that matters, every single day. 💻\nThe only way to learn, is to code. 📝\nKeep calm and commit on. 🔥"
    ]
  },
  happy: {
    short: [
      "Hello, World! ☀️",
      "Tests passing! ✅",
      "Green checkmarks! 🎉",
      "Deploy success! 🚀"
    ],
    medium: [
      "Console.log('Hello, World!') ☀️\nMy first commit, a beautiful day. 💻",
      "No bugs found today! 🎉\nTests passing, code working. ✅"
    ],
    long: [
      "Console.log('Hello, World!') ☀️\nMy first commit, a beautiful day. 💻\nGreen checkmarks, pure happiness. ✅\nProduction deployed, time to celebrate! 🎉",
      "No bugs found today! 🎉\nTests passing, code working. ✅\nPull request approved! 👏\nBest day ever, as a developer! ✨"
    ]
  },
  nature: {
    short: [
      "Code grows like tree. 🌳",
      "Debug like pruning. ✂️",
      "Code creates like nature. 🌿",
      "Functions branch out. 🌱"
    ],
    medium: [
      "Code grows like a tree, from roots. 🌳\nEvery function is like a branch. 🌿",
      "Trees have roots, developers have commits. 💻\nNature heals, code creates. 🌿"
    ],
    long: [
      "Code grows like a tree, from roots. 🌳\nEvery function is like a branch. 🌿\nDebug like pruning, for growth. ✂️\nBeautiful code, like nature's art. 🍃",
      "Trees have roots, developers have commits. 💻\nNature heals, code creates. 🌿\nGrow your skills, like a forest. 🌲\nPlant seeds of knowledge, daily. 📚"
    ]
  },
  night: {
    short: [
      "Code through night. 🌙",
      "Midnight oil burns. 🕯️",
      "Stars light code. ⭐",
      "Dark mode best. 🌃"
    ],
    medium: [
      "The code works, before it works. 🌙\nStars can't shine without darkness. ⭐",
      "Midnight oil burns, for great code. 🕯️\nNight owls catch the best bugs. 🦉"
    ],
    long: [
      "The code is darkest, before it works. 🌙\nStars can't shine without darkness. ⭐\nKeep coding through the night. 🌃\nDawn will bring your breakthrough. 🌅",
      "Midnight oil burns, for great code. 🕯️\nNight owls catch the best bugs. 🦉\nThe quiet hours, are productive hours. 💻\nCode while the world sleeps. 😴"
    ]
  },
  fire: {
    short: [
      "Set code ablaze. 🔥",
      "Code burns bright. 💥",
      "Fuel your passion. ⚡",
      "Keyboard on fire. ⌨️"
    ],
    medium: [
      "Set your code ablaze, with passion. 🔥\nLet your creativity burn bright. 💡",
      "Where there's code, there's fire. 🔥\nCode with heat of determination. 💪"
    ],
    long: [
      "Set your code ablaze, with passion. 🔥\nLet your creativity burn bright. 💡\nFire purifies, code creates. 💻\nBurn the bugs, not yourself. ⚡",
      "Where there's code, there's fire. 🔥\nCode with the heat of determination. 💪\nFuel your passion, write more code. 🚀\nLet your keyboard catch fire! ⌨️"
    ]
  },
  royal: {
    short: [
      "Code like royalty. 👑",
      "Write royal code. 💎",
      "Crown your code. 👸",
      "King of code. 🏰"
    ],
    medium: [
      "Queens write code, with style. 👑\nKings debug their own errors. 💻",
      "Born to code, destined to lead. 💻\nRoyal blood runs through commits. 👑"
    ],
    long: [
      "Queens write their own code, with style. 👑\nKings debug their own errors. 💻\nBe royal in approach, legendary in output. ✨\nCode like royalty, ship like king. 👸",
      "Born to code, destined to lead. 💻\nRoyal blood runs through your commits. 👑\nExcellence is the standard, always. 🏆\nYour code is your kingdom! 🏰"
    ]
  },
  ocean: {
    short: [
      "Flow like ocean. 🌊",
      "Dive in code. 🤿",
      "Waves of logic. 💻",
      "Blue ocean code. 🧊"
    ],
    medium: [
      "Life is like ocean, full of waves. 🌊\nCode flows like water, constantly. 💻",
      "The ocean of code, is endless. 🌊\nDive deep, into algorithms. 🤿"
    ],
    long: [
      "Life is like the ocean, full of waves. 🌊\nCode flows like water, constantly. 💻\nGo with the flow, of logic. 🌊\nStay afloat, keep swimming in code. 🏊",
      "The ocean of code, is endless. 🌊\nDive deep, into algorithms. 🤿\nTides change, bugs get fixed. 🌊\nKeep swimming, in the sea of code. 💻"
    ]
  }
};

const INSTA_HANDLE = '@thestackguy';

export default function InstaPostGenerator() {
  const [text, setText] = useState('');
  const [author, setAuthor] = useState('');
  const [mood, setMood] = useState('inspirational');
  const [activeLayout, setActiveLayout] = useState(1);
  const [activeFont, setActiveFont] = useState('dancing');
  const [bgImage, setBgImage] = useState(null);
  const [useImageBg, setUseImageBg] = useState(false);
  const [copied, setCopied] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [selectedEmojis, setSelectedEmojis] = useState([]);
  const [usedQuotesEN, setUsedQuotesEN] = useState({});
  const [usedQuotesHI, setUsedQuotesHI] = useState([]);
  const [history, setHistory] = useState([]);
  const [showDownloadModal, setShowDownloadModal] = useState(false);
  const [downloadSettings, setDownloadSettings] = useState({
    size: 'square',
    quality: 'high',
    format: 'png'
  });
  const previewRef = useRef(null);
  const downloadRef = useRef(null);

  const currentMood = MOODS.find(m => m.id === mood);
  const currentLayout = LAYOUTS.find(l => l.id === activeLayout);
  const currentFont = FONTS.find(f => f.id === activeFont);

  const showToastMessage = (msg) => {
    setToastMessage(msg);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  const generateAIQuote = (lang = 'en') => {
    setGenerating(true);
    setTimeout(() => {
      let quote = '';
      let emojisToAdd = [];
      
      const getRandomLength = () => {
        const rand = Math.random();
        if (rand < 0.3) return 'short';
        if (rand < 0.6) return 'medium';
        return 'long';
      };
      
      const selectedLength = getRandomLength();
      
      if (lang === 'hi') {
        const hiQuotes = HINDI_QUOTES[selectedLength] || HINDI_QUOTES.short;
        const availableHI = hiQuotes.filter(q => !usedQuotesHI.includes(q));
        
        if (availableHI.length === 0) {
          setUsedQuotesHI([]);
          quote = hiQuotes[Math.floor(Math.random() * hiQuotes.length)];
          setUsedQuotesHI([quote]);
        } else {
          quote = availableHI[Math.floor(Math.random() * availableHI.length)];
          setUsedQuotesHI(prev => [...prev, quote]);
        }
        emojisToAdd = ['💻', '🔥', '⚡', '👨‍💻', '🌟'];
      } else {
        const moodQuotes = SAMPLE_QUOTES[mood];
        if (!moodQuotes || !moodQuotes[selectedLength]) {
          quote = SAMPLE_QUOTES.inspirational.long[0];
        } else {
          const quotesArray = moodQuotes[selectedLength];
          const usedKey = `${mood}_${selectedLength}`;
          const usedForMood = usedQuotesEN[usedKey] || [];
          
          const available = quotesArray.filter(q => !usedForMood.includes(q));
          
          if (available.length === 0) {
            const newUsed = {};
            newUsed[usedKey] = [];
            setUsedQuotesEN(prev => ({ ...prev, ...newUsed }));
            quote = quotesArray[Math.floor(Math.random() * quotesArray.length)];
            setUsedQuotesEN(prev => ({ ...prev, [usedKey]: [quote] }));
          } else {
            quote = available[Math.floor(Math.random() * available.length)];
            setUsedQuotesEN(prev => ({ ...prev, [usedKey]: [...(prev[usedKey] || []), quote] }));
          }
        }
        
        const emojiOptions = {
          inspirational: ['💻', '⚡', '🚀', '💡', '🔥'],
          romantic: ['❤️', '💻', '💕', '💘', '🤵'],
          heartbreak: ['💔', '🐛', '💻', '😢', '🔄'],
          motivational: ['💪', '⚡', '🚀', '🏆', '🔥'],
          happy: ['🎉', '✅', '💻', '☕', '✨'],
          nature: ['🌳', '🌿', '🍃', '🌸', '🌲'],
          night: ['🌙', '⭐', '🌃', '🌟', '💫'],
          fire: ['🔥', '💥', '⚡', '🌟', '🚀'],
          royal: ['👑', '💎', '🏆', '👨‍💻', '💫'],
          ocean: ['🌊', '🧊', '💻', '🌊', '💙']
        };
        emojisToAdd = emojiOptions[mood] || emojiOptions.inspirational;
      }
      
      setText(quote);
      setAuthor('The Stack Guy');
      setSelectedEmojis(emojisToAdd.slice(0, 4));
      setGenerating(false);
      
      setHistory(prev => {
        const newHistory = [{ quote, mood: lang === 'hi' ? 'Hindi' : mood, emojis: emojisToAdd.slice(0, 2), timestamp: Date.now() }, ...prev];
        return newHistory.slice(0, 20);
      });
      
      showToastMessage(lang === 'hi' ? 'Hindi coding shayari generated!' : 'Coding quote generated!');
    }, 800);
  };

  const handleDownloadClick = () => {
    setShowDownloadModal(true);
  };

  const handleDownload = async () => {
    if (downloadRef.current) {
      try {
        const pixelRatio = downloadSettings.quality === 'high' ? 3 : downloadSettings.quality === 'medium' ? 2 : 1;
        
        const dataUrl = await toPng(downloadRef.current, { 
          quality: downloadSettings.quality === 'high' ? 1 : 0.9, 
          pixelRatio: pixelRatio,
          cacheBust: true
        });
        
        const filename = `insta-post-${mood}-${downloadSettings.size}-${Date.now()}.${downloadSettings.format}`;
        const link = document.createElement('a');
        link.download = filename;
        link.href = dataUrl;
        link.click();
        
        setShowDownloadModal(false);
        showToastMessage(`Downloaded as ${downloadSettings.format.toUpperCase()}!`);
      } catch (err) {
        console.error('Download error:', err);
        showToastMessage('Failed to download image');
      }
    }
  };

  const handleCopyText = async () => {
    try {
      const fullText = text + (author ? `\n\n— ${author}` : '');
      await navigator.clipboard.writeText(fullText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      showToastMessage('Text copied!');
    } catch {
      showToastMessage('Failed to copy');
    }
  };

  const handleWhatsappShare = async () => {
    try {
      if (!downloadRef.current) {
        showToastMessage('Generating image...');
        return;
      }

      const dataUrl = await toPng(downloadRef.current, { 
        quality: 1, 
        pixelRatio: 2,
        cacheBust: true
      });

      const fullText = `${text}${author ? `\n\n— ${author}` : ''}\n\nCreated by @thestackguy\n#coding #developer #tech`;
      const encodedText = encodeURIComponent(fullText);
      const whatsappNumber = '918218503993';
      
      const waUrl = `https://wa.me/${whatsappNumber}?text=${encodedText}`;
      window.open(waUrl, '_blank');

      setTimeout(() => {
        const link = document.createElement('a');
        link.download = `insta-post-whatsapp-${Date.now()}.png`;
        link.href = dataUrl;
        link.click();
      }, 1000);

      showToastMessage('WhatsApp opened! Image downloading...');
    } catch (err) {
      console.error('Share error:', err);
      showToastMessage('Failed to share');
    }
  };

  const toggleEmoji = (emoji) => {
    if (selectedEmojis.includes(emoji)) {
      setSelectedEmojis(selectedEmojis.filter(e => e !== emoji));
    } else if (selectedEmojis.length < 4) {
      setSelectedEmojis([...selectedEmojis, emoji]);
    }
  };

  const getPositionStyle = () => {
    switch (currentLayout?.position) {
      case 'top-center':
        return { justifyContent: 'flex-start', alignItems: 'center', textAlign: 'center' };
      case 'bottom-center':
        return { justifyContent: 'flex-end', alignItems: 'center', textAlign: 'center' };
      case 'left':
        return { justifyContent: 'center', alignItems: 'flex-start', textAlign: 'left', paddingLeft: '3rem' };
      case 'right':
        return { justifyContent: 'center', alignItems: 'flex-end', textAlign: 'right', paddingRight: '3rem' };
      case 'minimal':
        return { justifyContent: 'center', alignItems: 'center', textAlign: 'center', padding: '2rem' };
      default:
        return { justifyContent: 'center', alignItems: 'center', textAlign: 'center' };
    }
  };

  const getOverlayStyle = () => {
    switch (currentLayout?.overlay) {
      case true:
        return { background: 'rgba(0,0,0,0.5)', padding: '2rem', borderRadius: '1rem' };
      case 'quote':
        return { 
          background: 'rgba(255,255,255,0.1)', 
          backdropFilter: 'blur(10px)',
          padding: '2.5rem',
          borderRadius: '0',
          border: '1px solid rgba(255,255,255,0.2)'
        };
      case 'boxed':
        return { 
          background: 'rgba(255,255,255,0.95)', 
          padding: '2rem',
          borderRadius: '0.5rem',
          color: '#000'
        };
      case 'frame':
        return { 
          border: '3px solid rgba(255,255,255,0.3)',
          padding: '2rem'
        };
      default:
        return {};
    }
  };

  return (
    <div className="space-y-6 pb-20">
      <link href="https://fonts.googleapis.com/css2?family=Dancing+Script:wght@400;700&family=Pacifico&family=Great+Vibes&family=Playfair+Display:wght@400;700&family=Oswald:wght@400;700&family=Montserrat:wght@400;700&family=Poppins:wght@400;700&family=Raleway:wght@400;700&family=Lora:wght@400;700&family=Cinzel:wght@400;700&family=Bebas+Neue&family=Archetype&family=Sacramento&family=Permanent+Marker&family=Alex+Brush&family=Libre+Baskerville:wght@400;700&family=Vollkorn:wght@400;700&family=Josefin+Sans:wght@400;700&family=Abel&family=Righteous&display=swap" rel="stylesheet" />

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl md:text-5xl font-bold text-white mb-2 font-display uppercase leading-tight">
            Insta <span className="gradient-text">Post Creator</span>
          </h1>
          <p className="text-sm text-[#9ca3af] font-medium italic">
            Create stunning posts • Hindi/English • 10 Layouts + Images
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Left Controls - Compact */}
        <div className="xl:col-span-1 space-y-3">
          {/* AI Generator - Top */}
          <div className="bg-[#0a0a0f] border border-white/5 rounded-2xl p-3">
            <h3 className="text-xs font-black text-white uppercase tracking-widest mb-2 flex items-center gap-2">
              <Sparkles size={12} className="text-green-400" />
              AI Generator
            </h3>
            <div className="flex gap-2">
              <button
                onClick={() => generateAIQuote('en')}
                disabled={generating}
                className="flex-1 btn-primary h-8 text-xs font-bold uppercase disabled:opacity-50"
              >
                English
              </button>
              <button
                onClick={() => generateAIQuote('hi')}
                disabled={generating}
                className="flex-1 bg-gradient-to-r from-orange-600 to-pink-600 h-8 text-xs font-bold uppercase rounded-xl"
              >
                Hindi शायरी
              </button>
            </div>
          </div>

          {/* Quick Settings - Background, Mood, Layout */}
          <div className="bg-[#0a0a0f] border border-white/5 rounded-2xl p-3">
            <div className="flex gap-2 mb-2">
              <button
                onClick={() => { setUseImageBg(false); setBgImage(null); }}
                className={`flex-1 py-1.5 rounded-lg text-[10px] font-bold uppercase ${!useImageBg ? 'bg-blue-600 text-white' : 'bg-white/10 text-gray-400'}`}
              >
                Gradient
              </button>
              <button
                onClick={() => setUseImageBg(true)}
                className={`flex-1 py-1.5 rounded-lg text-[10px] font-bold uppercase ${useImageBg ? 'bg-blue-600 text-white' : 'bg-white/10 text-gray-400'}`}
              >
                Image
              </button>
            </div>
            {useImageBg ? (
              <div className="grid grid-cols-4 gap-1">
                {BACKGROUND_IMAGES.slice(0, 4).map((img) => (
                  <button
                    key={img.id}
                    onClick={() => setBgImage(img.url)}
                    className={`aspect-square rounded overflow-hidden bg-white/5 ${bgImage === img.url ? 'ring-2 ring-white' : ''}`}
                  >
                    <img src={img.url} alt={img.name} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-5 gap-1">
                {MOODS.map((m) => (
                  <button
                    key={m.id}
                    onClick={() => setMood(m.id)}
                    className={`px-2 py-1.5 rounded-lg text-[9px] font-bold uppercase ${mood === m.id ? 'ring-2 ring-white' : ''}`}
                    style={{ background: m.bg, color: m.color }}
                  >
                    {m.label}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Layouts */}
          <div className="bg-[#0a0a0f] border border-white/5 rounded-2xl p-3">
            <h3 className="text-xs font-black text-white uppercase tracking-widest mb-2 flex items-center gap-2">
              <Layout size={12} className="text-purple-400" />
              Layouts
            </h3>
            <div className="grid grid-cols-5 gap-1">
              {LAYOUTS.map((l) => (
                <button
                  key={l.id}
                  onClick={() => setActiveLayout(l.id)}
                  className={`py-1.5 rounded-lg text-[9px] font-bold uppercase ${activeLayout === l.id ? 'bg-blue-600 text-white' : 'bg-white/5 text-gray-400'}`}
                >
                  {l.name}
                </button>
              ))}
            </div>
          </div>

          {/* Typography */}
          <div className="bg-[#0a0a0f] border border-white/5 rounded-2xl p-3">
            <h3 className="text-xs font-black text-white uppercase tracking-widest mb-2 flex items-center gap-2">
              <Type size={12} className="text-blue-400" />
              Typography
            </h3>
            <div className="grid grid-cols-5 gap-1">
              {FONTS.slice(0, 5).map((f) => (
                <button
                  key={f.id}
                  onClick={() => setActiveFont(f.id)}
                  className={`px-1 py-1.5 rounded-lg text-[9px] font-bold uppercase transition-all border ${activeFont === f.id ? 'bg-blue-600/30 border-blue-500 text-white' : 'border-white/10 text-gray-400'}`}
                  style={{ fontFamily: f.family }}
                >
                  {f.name}
                </button>
              ))}
            </div>
          </div>

          {/* Text Input */}
          <div className="bg-[#0a0a0f] border border-white/5 rounded-2xl p-3">
            <h3 className="text-xs font-black text-white uppercase tracking-widest mb-2 flex items-center gap-2">
              <Quote size={12} className="text-cyan-400" />
              Your Text
            </h3>
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Enter quote (Hindi/English)"
              className="w-full h-20 bg-[#08080c] border border-white/10 rounded-xl p-2 text-xs text-gray-200 resize-none focus:outline-none"
            />
            <input
              type="text"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              placeholder="Author (optional)"
              className="w-full mt-1 bg-[#08080c] border border-white/10 rounded-xl px-2 py-1.5 text-xs text-gray-300 focus:outline-none"
            />
            <div className="flex gap-1 mt-1">
              <button onClick={handleCopyText} className="flex-1 btn-secondary h-7 text-[10px] font-bold uppercase flex items-center justify-center gap-1">
                {copied ? <Check size={10} /> : <Copy size={10} />}
                {copied ? 'Copied!' : 'Copy'}
              </button>
              <button onClick={handleDownloadClick} className="flex-1 btn-primary h-7 text-[10px] font-bold uppercase flex items-center justify-center gap-1">
                <DownloadIcon size={10} />
                Download
              </button>
              <button 
                onClick={handleWhatsappShare} 
                className="flex-1 bg-gradient-to-r from-green-500 to-green-600 h-7 text-[10px] font-bold uppercase flex items-center justify-center gap-1 rounded-xl"
              >
                <Share2 size={10} />
                WhatsApp
              </button>
            </div>
          </div>

          {/* History */}
          <div className="bg-[#0a0a0f] border border-white/5 rounded-2xl p-3">
            <h3 className="text-xs font-black text-white uppercase tracking-widest mb-2 flex items-center gap-2">
              <History size={12} className="text-yellow-400" />
              History ({history.length})
            </h3>
            <div className="space-y-2 max-h-[200px] overflow-y-auto">
              {history.length > 0 ? (
                history.map((item, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      setText(item.quote);
                      setSelectedEmojis(item.emojis);
                    }}
                    className="w-full text-left p-2 bg-white/5 rounded-lg hover:bg-white/10 transition-all"
                  >
                    <p className="text-[10px] text-gray-300 line-clamp-2">{item.quote.slice(0, 60)}...</p>
                    <div className="flex items-center justify-between mt-1">
                      <span className="text-[9px] text-blue-400 font-bold uppercase">{item.mood}</span>
                      <span className="text-[9px] text-gray-500">{item.emojis?.join('')}</span>
                    </div>
                  </button>
                ))
              ) : (
                <p className="text-xs text-gray-500 text-center py-4">No quotes generated yet</p>
              )}
            </div>
          </div>
        </div>

        {/* Right - Preview Only */}
        <div className="xl:col-span-1">
          <div className="flex justify-center py-4">
            {/* Download Wrapper - Complete Preview */}
            <div 
              ref={downloadRef}
              className="w-full max-w-[420px] bg-white rounded-3xl shadow-2xl overflow-hidden border-4 border-white"
              style={{ boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)' }}
            >

              {/* 👤 Profile Row - Instagram Style */}
              <div className="flex items-center justify-between px-3 py-2.5">
                <div className="flex items-center gap-2.5">
                  {/* Story Ring */}
                  <div className="w-10 h-10 rounded-full p-[2px] bg-gradient-to-tr from-yellow-400 via-pink-500 to-purple-600">
                    <div className="w-full h-full rounded-full bg-white p-[2px]">
                      <div className="w-full h-full rounded-full bg-gray-800 flex items-center justify-center">
                        <span className="text-white text-xs font-bold">TSG</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col">
                    <div className="flex items-center gap-1">
                      <span className="font-semibold text-sm text-gray-800">thestackguy</span>
                        <BadgeCheck className="w-5 h-5 text-white fill-blue-500" />
                    </div>
                    <span className="text-xs text-gray-500">India</span>
                  </div>
                </div>
                <button className="text-gray-600 text-2xl font-bold">•••</button>
              </div>

              {/* 📸 Post Content with Actions Overlay */}
              <div className="relative">
                <div
                  ref={previewRef}
                  className="relative w-full aspect-square overflow-hidden rounded-xl"
                  style={{
                    background: useImageBg && bgImage
                      ? `url(${bgImage}) center/cover no-repeat`
                      : currentMood?.bg,
                  }}
                >
                  {/* Overlay */}
                  {currentLayout?.overlay && currentLayout.overlay !== false && (
                    <div className="absolute inset-0 flex flex-col" style={getOverlayStyle()}>
                      <div className="flex-1 flex" style={getPositionStyle()} />
                    </div>
                  )}

                  {/* Content */}
                  <div
                    className="absolute inset-0 flex flex-col "
                    style={{
                      ...getPositionStyle(),
                      padding: currentLayout?.position === 'minimal' ? '1rem' : '1.5rem'
                    }}
                  >
                    {/* Emojis Top Right */}
                    {/* {selectedEmojis.length > 0 && (
                      <div className="absolute top-4 right-4 text-3xl flex gap-1 drop-shadow-lg">
                        {selectedEmojis.slice(0, 2).map((e, i) => <span key={i}>{e}</span>)}
                      </div>
                    )} */}

                    {/* Quote Icon */}
                    <div className="absolute top-8 left-8 opacity-25" style={{ color: '#fff' }}>
                      <Quote size={60} />
                    </div>

                    {/* Text */}
                    <div className="flex-1 flex flex-col justify-center items-center text-center">
                      <p
                        className="text-2xl md:text-3xl font-bold leading-snug"
                        style={{
                          fontFamily: currentFont?.family,
                          color: '#fff',
                          textShadow: '2px 2px 8px rgba(0,0,0,0.5), 0 0 30px rgba(0,0,0,0.3)'
                        }}
                      >
                        {text || "Your text here..."}
                      </p>

                      {author && (
                        <span className="mt-4 text-base text-white/90 font-medium" style={{ fontFamily: currentFont?.family }}>
                          — {author}
                        </span>
                      )}
                    </div>

                    {/* Quote Bottom */}
                    <div className="absolute bottom-8 right-8 opacity-25" style={{ color: '#fff' }}>
                      <Quote size={40} />
                    </div>
                  </div>
                </div>

                
              </div>

              {/* ❤️ Actions Footer */}
              <div className="px-3 py-2.5">
                <div className="flex justify-between items-start">
                  <div className="flex gap-4">
                    <button className="text-2xl hover:text-red-500 transition-colors transform hover:scale-110">❤️</button>
                    <button className="text-xl text-gray-600 hover:text-gray-800">💬</button>
                    <button onClick={handleWhatsappShare} className="text-xl text-green-500 hover:text-green-600 hover:scale-110 transition-transform">📱</button>
                  </div>
                  <button className="text-2xl text-gray-600 hover:text-gray-800">🔖</button>
                </div>
                
                {/* Likes count */}
                {/* <div className="mt-1.5">
                  <span className="font-semibold text-sm text-gray-800">1,234 likes</span>
                </div> */}

                {/* Caption with hashtags */}
                {/* <div className="mt-1">
                  <div>
                    <span className="font-semibold text-sm text-gray-800">thestackguy</span>
                    <span className="text-blue-500 text-xs ml-1">✓</span>
                  </div>
                  <div className="text-sm text-gray-600 mt-0.5">
                    {text ? (
                      <>
                        <span>{text.split('\n')[0].slice(0, 40)}</span>
                        {text.split('\n')[0].length > 40 && <span>...</span>}
                        <span className="text-gray-400"> #coding #developer #tech #programming</span>
                      </>
                    ) : (
                      <span>Your caption here... #coding #developer #tech</span>
                    )}
                  </div>
                </div> */}

                {/* Time */}
                {/* <div className="mt-1">
                  <button className="text-xs text-gray-400 uppercase hover:text-gray-600">View all 12 comments</button>
                </div>
                <div className="mt-0.5">
                  <span className="text-[10px] text-gray-400 uppercase tracking-wide">2 HOURS AGO •</span>
                  <span className="text-[10px] text-gray-400 ml-1">India</span>
                </div> */}
              </div>

              {/* Quick Action Bar */}
              {/* <div className="border-t border-gray-100 px-3 py-2 flex items-center justify-between">
                <div className="flex items-center gap-1 text-gray-400">
                  <span className="text-2xl">😊</span>
                  <span className="text-sm">Add a comment...</span>
                </div>
                <div className="flex gap-3">
                  <span className="text-pink-500 text-xl">❤️</span>
                  <span className="text-gray-400 text-xl">➕</span>
                </div>
              </div> */}

            </div>
          </div>
        </div>
      </div>

      {/* Download Modal */}
      {showDownloadModal && (
        <div 
          className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 backdrop-blur-sm"
          onClick={() => setShowDownloadModal(false)}
        >
          <div className="bg-[#1a1a2e] border border-white/10 rounded-2xl p-6 w-full max-w-2xl mx-4 shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-white">Download Settings</h3>
              <button 
                onClick={() => setShowDownloadModal(false)}
                className="text-gray-400 hover:text-white text-2xl"
              >
                ×
              </button>
            </div>

            {/* Size Selection */}
            <div className="mb-5">
              <label className="text-xs font-bold text-gray-400 uppercase mb-2 block">Post Size</label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'square', label: 'Square', desc: '1080×1080' },
                  { id: 'portrait', label: 'Portrait', desc: '1080×1350' },
                  { id: 'story', label: 'Story', desc: '1080×1920' }
                ].map((s) => (
                  <button
                    key={s.id}
                    onClick={() => setDownloadSettings({ ...downloadSettings, size: s.id })}
                    className={`p-3 rounded-xl border-2 text-left transition-all ${
                      downloadSettings.size === s.id 
                        ? 'border-blue-500 bg-blue-500/20' 
                        : 'border-white/10 hover:border-white/30'
                    }`}
                  >
                    <div className="font-bold text-sm text-white">{s.label}</div>
                    <div className="text-xs text-gray-400">{s.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Quality Selection */}
            <div className="mb-5">
              <label className="text-xs font-bold text-gray-400 uppercase mb-2 block">Quality</label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'low', label: 'Standard', desc: '1x' },
                  { id: 'medium', label: 'High', desc: '2x' },
                  { id: 'high', label: 'Ultra', desc: '3x' }
                ].map((q) => (
                  <button
                    key={q.id}
                    onClick={() => setDownloadSettings({ ...downloadSettings, quality: q.id })}
                    className={`p-3 rounded-xl border-2 text-center transition-all ${
                      downloadSettings.quality === q.id 
                        ? 'border-green-500 bg-green-500/20' 
                        : 'border-white/10 hover:border-white/30'
                    }`}
                  >
                    <div className="font-bold text-sm text-white">{q.label}</div>
                    <div className="text-xs text-gray-400">{q.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Format Selection */}
            <div className="mb-6">
              <label className="text-xs font-bold text-gray-400 uppercase mb-2 block">Format</label>
              <div className="flex gap-3">
                {['png', 'jpg', 'webp'].map((f) => (
                  <button
                    key={f}
                    onClick={() => setDownloadSettings({ ...downloadSettings, format: f })}
                    className={`flex-1 py-2.5 rounded-xl border-2 font-bold uppercase text-sm transition-all ${
                      downloadSettings.format === f 
                        ? 'border-purple-500 bg-purple-500/20 text-purple-400' 
                        : 'border-white/10 text-gray-400 hover:border-white/30'
                    }`}
                  >
                    {f}
                  </button>
                ))}
              </div>
            </div>

            {/* Download Button */}
            <button 
              onClick={handleDownload}
              className="w-full py-4 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl font-bold text-white text-lg hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
            >
              <DownloadIcon size={20} />
              Download {downloadSettings.size.toUpperCase()} ({downloadSettings.quality === 'high' ? '3x' : downloadSettings.quality === 'medium' ? '2x' : '1x'} {downloadSettings.format.toUpperCase()})
            </button>

            {/* Info */}
            <div className="mt-4 text-center text-xs text-gray-500">
              Estimated size: {downloadSettings.size === 'story' ? '~2.5MB' : downloadSettings.size === 'portrait' ? '~1.8MB' : '~1.5MB'} • Quality: {downloadSettings.quality}
            </div>
          </div>
        </div>
      )}

      <div 
        className={`fixed bottom-6 right-6 bg-green-500 text-white px-5 py-3 rounded-xl font-bold text-sm flex items-center gap-2 transition-all duration-300 z-50 ${
          showToast ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
        }`}
      >
        <Check size={16} />
        {toastMessage}
      </div>
    </div>
  );
}
