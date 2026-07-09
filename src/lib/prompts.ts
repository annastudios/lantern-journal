export const writingPrompts: string[] = [
  "What felt heavier or lighter than usual today?",
  "Describe a small moment today that you don't want to forget.",
  "What's something you're grateful for right now, even if it's tiny?",
  "Who made you smile recently, and what did they do?",
  "What's a memory from this week that keeps replaying in your mind?",
  "If today had a color, what would it be and why?",
  "What's something you're avoiding thinking about? Write about it a little.",
  "What did you learn about yourself today?",
  "Describe your current mood using only weather.",
  "What's a conversation that stuck with you recently?",
  "What are you looking forward to?",
  "What's something at work or school that's been on your mind?",
  "Write about a place that feels like home right now.",
  "What would you tell yourself from a year ago?",
  "What's a small win you had today that no one else noticed?",
  "What's something you're proud of but rarely say out loud?",
  "Describe a moment today when you felt truly present.",
  "What's weighing on you that you haven't told anyone?",
  "What made today different from yesterday?",
  "Write about someone you miss.",
  "What's a habit you want to build, and why does it matter to you?",
  "If you could redo one part of today, what would it be?",
  "What's something beautiful you noticed today?",
  "What does rest look like for you right now?",
  "Write about a fear you're slowly becoming less afraid of.",
  "What's a goal you're working toward, and how did you move closer to it today?",
  "Describe the version of yourself you're trying to become.",
  "What's something you wish people understood about you?",
  "Write three sentences about how your body feels right now.",
  "What's a question you've been sitting with lately?",
];

export function getRandomPrompt(exclude?: string): string {
  const options = exclude
    ? writingPrompts.filter((prompt) => prompt !== exclude)
    : writingPrompts;

  return options[Math.floor(Math.random() * options.length)];
}
