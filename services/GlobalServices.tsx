import axios from "axios";
import OpenAI from "openai";
import { Coachingclass } from "./CoachingOptions";

export const getToken = async () => {
    try {
        const result = await axios.get("/api/getToken");
        return result.data;
    } catch (error) {
        console.error("Error fetching token:", error);
        return null;
    }
};

const openai = new OpenAI({
    baseURL: "https://openrouter.ai/api/v1",
    apiKey: process.env.NEXT_PUBLIC_API_KEY, 
    dangerouslyAllowBrowser:true
});

export const AIModel = async (topic: string, coachingOption: string, msg: string) => {
    const option = Coachingclass.find((item) => item.name == coachingOption);
    
    if (!option || !option.prompt) {
        console.error("Invalid coaching option or prompt missing");
        return null;
    }

    const PROMPT = (option.prompt).replace("{user_topic}", topic);

    try {
        const completion = await openai.chat.completions.create({
            model: "google/gemini-2.0-pro-exp-02-05:free",
            messages: [
                { role: "assistant", content: PROMPT },
                { role: "user", content: msg }
            ],
        });

        console.log(completion.choices[0].message);
        return completion.choices[0].message;
    } catch (error) {
        console.error("Error generating AI response:", error);
        return null;
    }
};
