
        
// --- Models ---

export type ChatSenderRole = "You" | "Stranger" | "System";

export interface ChatMessageModel {
  id: number | string;
  senderRole: ChatSenderRole;
  content: string;
  timestamp: string; // ISO string or simple time e.g., "10:30 AM"
}

export interface ReportReasonModel {
  id: number;
  reason: string;
  description: string;
}

export interface SafetyTipModel {
  id: number;
  tip: string;
  iconName: string;
}

export interface StrangerVideoModel {
    placeholderUrl: string;
}

// --- Data ---

export const TYPICAL_MOCK_CONVERSATION: ChatMessageModel[] = [
  { id: 1, senderRole: "System", content: "You're chatting with a stranger. Say hi!", timestamp: "10:00 AM" },
  { id: 2, senderRole: "System", content: "You are now matched based on interest: 'Niche Indie Games'.", timestamp: "10:01 AM" },
  { id: 3, senderRole: "Stranger", content: "Hey! Did you hear about the new update for Stardew Valley?", timestamp: "10:02 AM" },
  { id: 4, senderRole: "You", content: "Oh yeah, the 1.6 patch! I'm actually playing it right now. I'm obsessed with the new festivals.", timestamp: "10:03 AM" },
  { id: 5, senderRole: "Stranger", content: "Same! I hope you're not planning on trauma dumping immediately... just kidding! Are you more of a farmer or a miner?", timestamp: "10:04 AM" },
];

export const DEFAULT_REPORT_REASONS: ReportReasonModel[] = [
  {
    id: 1,
    reason: "Inappropriate Content/Nudity",
    description: "The user displayed nudity, explicit sexual content, or suggestive behavior.",
  },
  {
    id: 2,
    reason: "Harassment/Abuse",
    description: "The user was aggressively hostile, racist, threatening, or engaging in personal attacks.",
  },
  {
    id: 3,
    reason: "Spam or Scams",
    description: "The user attempted to solicit money, promote commercial services, or share malicious links.",
  },
  {
    id: 4,
    reason: "Minor/Underage User",
    description: "The user appears to be under the age of 18 (Video chat reports only).",
  },
  {
    id: 5,
    reason: "Other Violations",
    description: "Content that violates the Terms of Service but doesn't fit the above categories.",
  },
];

export const LIVE_CHAT_SAFETY_TIPS: SafetyTipModel[] = [
  {
    id: 1,
    tip: "Never share personal identifying information (PII) like your full name, location, school, or phone number.",
    iconName: "Lock",
  },
  {
    id: 2,
    tip: "If a conversation becomes uncomfortable or inappropriate, hit the 'Skip' button immediately.",
    iconName: "SkipForward",
  },
  {
    id: 3,
    tip: "Report users who violate guidelines using the 'Report' feature. Our AI and Human mods review all reports 24/7.",
    iconName: "Flag",
  },
  {
    id: 4,
    tip: "Be mindful of your background in video chats. Ensure nothing sensitive or confidential is visible.",
    iconName: "Webcam",
  },
  {
    id: 5,
    tip: "Remember that not everyone online is who they claim to be. Maintain skepticism and keep the conversation light initially.",
    iconName: "UserQuestion",
  },
];

export const MockStrangerVideo: StrangerVideoModel = {
    placeholderUrl: "https://spark-builder.s3.us-east-1.amazonaws.com/image/2025/12/27/a8a00391-af63-4c06-a959-3cae08a40a59.png"
}
        
      