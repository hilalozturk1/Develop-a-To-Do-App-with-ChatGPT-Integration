import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

export const getChatGPTRecommendation = async (content: string): Promise<string> => {
  try {
    const response = await axios.post(
      "https://api.openai.com/v1/chat/completions",
      {
        model: "gpt-3.5-turbo",
        messages: [
          { role: "system", content: "You are a helpful assistant." },
          { role: "user", content: `Provide recommendations for the following task: "${content}".` },
        ],
        max_tokens: 100,
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    return response.data.choices[0].message.content.trim();
  } catch (error: any) {
    if (error.response?.data?.error?.code === "insufficient_quota") {
      return error.response?.data?.error?.code;
    }

    console.error("Error fetching recommendation from ChatGPT:", error.response?.data || error.message);
    return "No recommendation available.";
  }
};