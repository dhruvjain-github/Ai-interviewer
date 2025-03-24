import axios from "axios";
import OpenAI from "openai";
import { Coachingclass } from "./Options";
import { fromEnv } from "@aws-sdk/credential-provider-env";
import {PollyClient,SynthesizeSpeechCommand,VoiceId} from "@aws-sdk/client-polly"

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

export const AIModel = async (topic: string, coachingOption: string, LastTwoMessage:any): Promise<any | null> => {
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
                { role: "assistant", content: PROMPT },
                ...LastTwoMessage
            ]
        });

        console.log("AI Response:", completion.choices[0]?.message || "No response");
        return completion.choices[0]?.message || null;
    } catch (error) {
        console.error("Error generating AI response:", error);
        return null;
    }
};

export const AIModelToGenerateFeedbackAndNotes = async ( coachingOption: string, conversatation:any): Promise<any | null> => {
    console.log("{GlobalServices} Requested Coaching Option:", coachingOption);

    // Ensure the name exactly matches an existing option
    const option = Coachingclass.find((item) => item.name.trim().toLowerCase() === coachingOption.trim().toLowerCase());

    if (!option) {
        console.error("Invalid coaching option or prompt missing", { coachingOption, availableOptions: Coachingclass.map(c => c.name) });
        return null;
    }

    const PROMPT = (option.summeryPrompt)

    try {
        const completion = await openai.chat.completions.create({
            model: "google/gemini-2.0-pro-exp-02-05:free",
            messages: [
                ...conversatation,
                { role: "assistant", content: PROMPT },
                
            ]
        });
        
        console.log("{GlobalServices}AI Response Full:", completion);
        console.log("{GlobalServices}Generated Notes:", completion.choices[0]?.message || "No response");
        

        console.log("{GlobalServices}AI Response:", completion.choices[0]?.message || "No response");
        return completion.choices[0]?.message || null;
    } catch (error) {
        console.error("Error generating AI response:", error);
        return null;
    }
};



export const ConvertTextToSpeech = async (text: string, expertName: keyof typeof VoiceId): Promise<string | null> => {
    const accessKeyId = process.env.NEXT_PUBLIC_AWS_ACCESS_KEY_ID;
    const secretAccessKey = process.env.NEXT_PUBLIC_AWS_SECRET_KEY;

    if (!accessKeyId || !secretAccessKey) {
        console.error("AWS credentials are missing");
        return null;
    }

    const pollyClient = new PollyClient({
        region: "ap-south-1",
        credentials:{
            accessKeyId: accessKeyId as string,
            secretAccessKey: secretAccessKey as string
        }, 
    });

    const command = new SynthesizeSpeechCommand({
        OutputFormat: "mp3",
        Text: text,
        VoiceId: expertName, // Now properly typed
    });

    try {
        const response = await pollyClient.send(command);

        if (!response.AudioStream) {
            console.error("AudioStream is undefined");
            return null;
        }

        const audioArrayBuffer = await response.AudioStream.transformToByteArray();
        const audioBlob = new Blob([audioArrayBuffer], { type: "audio/mp3" });
        const audioUrl = URL.createObjectURL(audioBlob);

        return audioUrl;
    } catch (error) {
        console.error("Error in converting text to speech:", error);
        return null;
    }
}; 

