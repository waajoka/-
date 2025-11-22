import { GoogleGenAI } from "@google/genai";

const API_KEY = process.env.API_KEY || '';

// Initialize safety mechanism: if no key, return mock data to prevent crash
const ai = API_KEY ? new GoogleGenAI({ apiKey: API_KEY }) : null;

const LOCAL_QUOTES = [
  "生活不止眼前的苟且，还有诗和远方。",
  "万物皆有裂痕，那是光照进来的地方。",
  "心有猛虎，细嗅蔷薇。",
  "且将新火试新茶，诗酒趁年华。",
  "凡是过去，皆为序章。",
  "人生如逆旅，我亦是行人。",
  "满地都是六便士，他却抬头看见了月亮。",
  "未雨绸缪，勿临渴而掘井。",
  "愿你出走半生，归来仍是少年。",
  "世间所有的相遇，都是久别重逢。",
  "保持热爱，奔赴山海。",
  "岁月不居，时节如流。",
  "既然选择了远方，便只顾风雨兼程。",
  "我见青山多妩媚，料青山见我应如是。",
  "行到水窮處，坐看雲起時。",
  "不乱于心，不困于情。",
  "欲穷千里目，更上一层楼。",
  "知我者，谓我心忧；不知我者，谓我何求。",
  "落霞与孤鹜齐飞，秋水共长天一色。",
  "海内存知己，天涯若比邻。",
  "此情可待成追忆，只是当时已惘然。",
  "仰天大笑出门去，我辈岂是蓬蒿人。",
  "长风破浪会有时，直挂云帆济沧海。",
  "草木有本心，何求美人折。",
  "种一棵树最好的时间是十年前，其次是现在。",
  "斯人若彩虹，遇上方知有。",
  "追风赶月莫停留，平芜尽处是春山。"
];

export const polishText = async (inputText: string): Promise<string> => {
  if (!ai) {
    console.warn("Gemini API Key missing. Returning raw text.");
    return inputText;
  }

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `You are a poetic typewriter assistant for Chinese text. Take the following raw text and rewrite it to be slightly more profound, poetic, or witty in Chinese, but keep it short (max 20 words). It should sound like a fortune cookie or a diary entry.
      
      Input: "${inputText}"`,
    });

    const text = response.text;
    return text ? text.trim() : inputText;
  } catch (error) {
    console.error("Gemini polish failed:", error);
    return inputText;
  }
};

export const generateRandomThought = async (): Promise<string> => {
  // Instant local generation
  const randomIndex = Math.floor(Math.random() * LOCAL_QUOTES.length);
  return LOCAL_QUOTES[randomIndex];
};