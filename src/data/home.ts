
        
export interface FeatureCardModel {
  title: string;
  description: string;
  iconName: string;
}

export interface FAQItemModel {
  id: number;
  question: string;
  answer: string;
}

export interface TipItemModel {
  tipText: string;
}

export interface InterestTagModel {
  id: number;
  name: string;
}

export const PLATFORM_FEATURES: FeatureCardModel[] = [
  {
    title: "Actually Free",
    description: "No \"upgrade to premium\" BS. Just free. Forever.",
    iconName: "DollarSignOff", 
  },
  {
    title: "Zero Sign-Up",
    description: "No email, no account, no verification code. Click and chat.",
    iconName: "UserOff",
  },
  {
    title: "AI + Human Mods",
    description: "We got both watching for creeps 24/7. Way less sketch than old Omegle.",
    iconName: "ShieldCheck",
  },
  {
    title: "Interest Matching",
    description: "Type what you're into, get matched with people who actually vibe with that.",
    iconName: "SlidersHorizontal",
  },
  {
    title: "Works on Your Phone",
    description: "No app download, just works in browser. iPhone, Android, whatever.",
    iconName: "Smartphone",
  },
  {
    title: "Anonymous AF",
    description: "We don't track, store, or sell your data. Chat and ghost guilt-free.",
    iconName: "EyeOff",
  },
];

export const GOOD_FOR_LIST: string[] = [
  "Language Practice - Way better than Duolingo for actual conversation",
  "Meeting People from Everywhere - Like study abroad but from your couch",
  "Making Actual Friends - Shared interests = better convos = sometimes real friendships",
  "Killing Boredom - More entertaining than scrolling TikTok for the 47th time today",
];

export const HOMEPAGE_FAQS: FAQItemModel[] = [
  {
    id: 1,
    question: "Wait, is this actually free?",
    answer: "Yup, 100% free! No credit card, no subscription BS, no 'free trial' that charges you later. Just pure random chat vibes whenever you want.",
  },
  {
    id: 2,
    question: "How's this different from the OG Omegle?",
    answer: "We basically took everything cool about Omegle and made it safer. Got AI watching for weirdos, better matching based on interests, works great on mobile, and way less sketch overall. Think Omegle 2.0 but actually maintained lol.",
  },
  {
    id: 3,
    question: "Is it safe tho? Like actually safe?",
    answer: "For real - we have AI + human mods watching 24/7, fake webcam detection, instant skip button, and you can report creeps. Way safer than old Omegle. Still anonymous but not a total wild west.",
  },
  {
    id: 4,
    question: "Do I need to download anything?",
    answer: "Nah, works right in your browser! No app, no download, no installing random stuff. Just click and chat. Works on phone, laptop, tablet - whatever you got.",
  },
];

export const ALL_FAQS: FAQItemModel[] = [
  ...HOMEPAGE_FAQS,
  {
    id: 5,
    question: "Does it work on mobile?",
    answer: "Hell yeah! Works perfectly on iPhone and Android. Same experience as desktop, just tap and go. Perfect for chatting while you're bored in class or on the bus (we won't tell 😉).",
  },
  {
    id: 6,
    question: "How does the interest matching thing work?",
    answer: "Just type in stuff you're into before you start - like \"anime\", \"skateboarding\", whatever. We'll try to match you with people who vibe with the same stuff. Makes convos way less awkward than random matching.",
  },
  {
    id: 7,
    question: "What if someone's being weird?",
    answer: "Hit that Skip button ASAP! We also have AI that auto-detects inappropriate stuff and kicks people. You can report them too. Don't waste your time with weirdos.",
  },
  {
    id: 8,
    question: "Can people see my info?",
    answer: "Nope, you're totally anonymous. We don't save your convos, don't need your email or name, nothing. Chat and ghost, that's the whole point.",
  },
  {
    id: 9,
    question: "Why'd I get randomly disconnected?",
    answer: "Could be their internet died, they bailed, or our system caught something sketchy. Just start a new chat - there's always more people online.",
  },
  {
    id: 10,
    question: "Can I find someone I chatted with again?",
    answer: "Nah, that's not how this works. Once you disconnect, they're gone. That's kinda the whole anonymous random chat vibe - keeps it spontaneous and private for everyone.",
  },
];

export const USAGE_TIPS: TipItemModel[] = [
  {
    tipText: "Be specific with your interests. Don't just put 'music' - say 'lofi hip hop' or 'metal' or whatever you're actually into. Way better matches = way better convos. Generic interests = generic people.",
  },
  {
    tipText: "Fix your lighting before video chat. Nobody wants to talk to a shadow person lol. Sit near a window or turn on a lamp. First impressions matter even in random chat!",
  },
  {
    tipText: "Don't be a dick about cultural differences. You're gonna meet people from literally everywhere. Different doesn't mean wrong. Ask questions, learn stuff, share your perspective. That's the whole point.",
  },
  {
    tipText: "Skip the boring 'hi' opener. 'Hi' = instant skip energy. Ask something interesting right away. \"What's the weirdest thing you've eaten?\" hits different than \"hi how r u\". Put in like 2% effort.",
  },
  {
    tipText: "Don't trauma dump immediately. Keep it light at first. Nobody wants your whole life story in the first 30 seconds. Build up to the deep stuff or save it for therapy (respectfully).",
  },
  {
    tipText: "Use interests to filter out randos. The more specific your interests, the less likely you'll match with someone totally random. 'Niche indie games' > 'gaming'. Quality over quantity.",
  },
];

export const SUGGESTED_INTERESTS: InterestTagModel[] = [
  { id: 1, name: "anime" },
  { id: 2, name: "skateboarding" },
  { id: 3, name: "lofi hip hop" },
  { id: 4, name: "indie devs" },
  { id: 5, name: "cooking" },
  { id: 6, name: "vintage movies" },
];
        
      