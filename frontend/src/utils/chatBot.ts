import axios from "axios";
import appDescription from "./appDescription";

const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

export async function chatWithBot({ message }: { message: string }) {
  try {
    console.log(appDescription)
    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`,
      {
        contents: [
          {
            role: "user",
            parts: [{ text: `${appDescription}\n\nUser question: ${message}` }],
          },
        ],
      }
    );

    let reply =
      response.data.candidates[0]?.content?.parts[0]?.text ||
      "Sorry, I couldn't generate a response.";

    reply = cleanBotResponse(reply);

    return reply;
  } catch (error: any) {
    console.log("error on the chatBot", error.message);
  }
}

function cleanBotResponse(response: string): string {
  response = response.replace(
    /^(Okay! To help you with LostLink, I need to understand what you're trying to do\.?|Since you just said "hello," I'll assume you're new to the system\.)/i,
    ""
  );

  response = response.replace(/\*\*Possible options:\*\*.*?(?=\n\n)/s, "");

  response = response.replace(
    /\*\*Please tell me what you would like to do\.\*\*.*$/s,
    ""
  );

  response = response.replace(/^\*\s+/gm, "");

  return response.trim();
}
