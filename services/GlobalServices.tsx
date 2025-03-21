import axios from "axios";
import OpenAI from "openai";
import { Coachingclass } from "./Options";

export const getToken = async (): Promise<string | null> => {
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
    apiKey: process.env.NEXT_PUBLIC_API_KEY!,
    dangerouslyAllowBrowser: true
});

export const AIModel = async (topic: string, coachingOption: string, msg: string): Promise<any | null> => {
    console.log("Requested Coaching Option:", coachingOption);

    // Ensure the name exactly matches an existing option
    const option = Coachingclass.find((item) => item.name.trim().toLowerCase() === coachingOption.trim().toLowerCase());

    if (!option) {
        console.error("Invalid coaching option or prompt missing", { coachingOption, availableOptions: Coachingclass.map(c => c.name) });
        return null;
    }

    const PROMPT = option.prompt.replace("{user_topic}", topic);

    try {
        const completion = await openai.chat.completions.create({
            model: "google/gemini-2.0-pro-exp-02-05:free",
            messages: [
                { role: "system", content: PROMPT },
                { role: "user", content: msg }
            ]
        });

        console.log("AI Response:", completion.choices[0]?.message || "No response");
        return completion.choices[0]?.message || null;
    } catch (error) {
        console.error("Error generating AI response:", error);
        return null;
    }
};
