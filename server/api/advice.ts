import express, { Request, Response, NextFunction } from 'express';
import { pipeline, env, TextStreamer } from '@huggingface/transformers';
import OpenAI from 'openai';
import 'dotenv/config';

const router = express.Router();

let pipe: any;
(async () => {
    try {
        env.cacheDir = './.cache';
        pipe = await pipeline('text-generation', 'HuggingFaceTB/SmolLM2-1.7B-Instruct');
        console.log('[Sanovise - Siker] A modell sikeresen betöltve.');
    } catch (error) {
        console.error('[Sanovise - Hiba] Hiba a modell betöltésekor: ', error);
    }
})();

const openai = new OpenAI({
    baseURL: 'https://openrouter.ai/api/v1',
    apiKey: process.env.OPENAI_API_KEY,
    defaultHeaders: {
        'HTTP-Referer': 'https://app.sanovise.ranzak.site',
        'X-Title': 'Sanovise'
    }
});

const advice = async (req: Request, res: Response, next: NextFunction) => {
    let cancelled = false;
    res.on('close', () => {
        cancelled = true;
    });

    try {
        const {
            birthDate, gender, height, weight, heartRate, bloodPressure,
            sports, medications, chronicDiseases, allergies, diet, waterIntake,
            familyHistory, smoking, alcohol, sleep, symptoms, medicalHistory,
            language
        } = req.body;

        if (!birthDate || !gender || !height || !weight || !language) {
            return res.status(400).json({
                success: false,
                error: 'Hiányzó mezők! Kérlek, add meg az összes szükséges adatot.',
                missingFields: { birthDate, gender, height, weight }
            });
        }

        const age = new Date().getFullYear() - new Date(birthDate).getFullYear();
        const toneInstruction = age >= 50
            ? 'Use formal and respectful language, as if speaking to an older patient or in a professional setting.'
            : 'Use informal and friendly language, as if speaking to a peer or younger patient.';
        const messages = [
            {
                role: 'system',
                content: `You are an experienced doctor with years of clinical practice. Your communication should be direct, empathetic, 
                and professional, just like an in-person consultation. ${toneInstruction} You always address the patient’s concerns directly and 
                suggest specific, personalized actions. Provide clear, actionable advice, and explain the implications of their health data, guiding 
                them through the necessary steps for improvement. You don't need to be formal or overly polite unless appropriate; aim for clarity 
                and empathy. Today's date is: ${new Date().toISOString().split('T')[0]}. Example patient data:
                - Age: 45
                - Gender: Male
                - Symptoms: High blood pressure, fatigue
                - Medical history: Hypertension
                In your response, focus on delivering actionable advice directly to the patient without excessive pleasantries.`
            },
            {
                role: 'user',
                content: `
                Patient Details:
                - Date of Birth: ${birthDate}
                - Age: ${new Date().getFullYear() - new Date(birthDate).getFullYear()}
                - Gender: ${gender}
                - Height: ${height} cm
                - Weight: ${weight} kg
                - Heart Rate: ${heartRate}
                - Blood Pressure: ${bloodPressure}
                - Sports Activity: ${sports}
                - Medications: ${medications}
                - Chronic Diseases: ${chronicDiseases}
                - Allergies: ${allergies}
                - Diet: ${diet}
                - Water Intake: ${waterIntake}
                - Family History: ${familyHistory}
                - Smoking: ${smoking}
                - Alcohol Consumption: ${alcohol}
                - Sleep Patterns: ${sleep}
                - Symptoms: ${symptoms}
                - Medical History: ${medicalHistory}
        
                Based on this data, please provide a clear and direct medical assessment. Address the patient's concerns directly, point out potential 
                risks, and explain the significance of their health data. Provide practical advice with specific recommendations for actions they should 
                take to improve their health. Make sure to explain what might happen if they ignore these recommendations, and help them understand the 
                long-term consequences. Answer in language: ${language}`
            }
        ];

        res.setHeader('Content-Type', 'text/plain');
        res.setHeader('Transfer-Encoding', 'chunked');

        const streamer = new TextStreamer(pipe.tokenizer, {
            skip_prompt: true,
            callback_function: (token: string) => {
                res.write(token);

                if (cancelled) {
                    streamer.end();
                    res.end();
                    return;
                }
            },
        });

        await pipe(messages, { max_new_tokens: 512, temperature: 0.7, top_k: 100, top_p: 0.8, do_sample: true, streamer });
        res.end();

    } catch (error: Error | any) {
        console.error('[Sanovise - Hiba] Hiba a streamelés során: ', error);
        res.write('Hiba történt a folyamat során. Kérlek, próbáld újra.\n');
        res.write(`Hibakód: ${error.message}\n`);
        res.end();
    }
}

const advice2 = async (req: Request, res: Response, next: NextFunction) => {
    let cancelled = false;
    res.on('close', () => {
        cancelled = true;
    });

    try {
        const {
            birthDate, gender, height, weight, heartRate, bloodPressure,
            sports, medications, chronicDiseases, allergies, diet, waterIntake,
            familyHistory, smoking, alcohol, sleep, symptoms, medicalHistory,
            language, messages
        } = req.body;

        if (!birthDate || !gender || !height || !weight || !language) {
            return res.status(400).json({
                success: false,
                error: 'Hiányzó mezők! Kérlek, add meg az összes szükséges adatot.',
                missingFields: { birthDate, gender, height, weight }
            });
        }

        const age = new Date().getFullYear() - new Date(birthDate).getFullYear();
        const toneInstruction = age >= 50
            ? 'Please use a very respectful and formal tone, as if addressing an old patient in a medical consultation.'
            : 'Use an informal and friendly tone, appropriate for a younger patient or peer.';
        let chatMessages: OpenAI.ChatCompletionMessageParam[] = [
            {
                role: 'system',
                content: `You are an experienced doctor with years of clinical practice. Your communication should be direct, empathetic, 
                and professional, just like an in-person consultation. You always address the patient’s concerns directly and 
                suggest specific, personalized actions. Provide clear, actionable advice, and explain the implications of their health data, guiding 
                them through the necessary steps for improvement. You don't need to be formal or overly polite unless appropriate; aim for clarity 
                and empathy. Begin your response directly with the medical advice. Do not use any introductory or filler phrases like “My answer is”, 
                “Here’s what I think”, “Let me explain”, etc. Your reply must start directly with the medical insights and advice, with no preamble. 
                Feel free to use emojis to enhance the message, but not to much.`
            },
            {
                role: 'user',
                content: `
                Patient Details:
                - Date of Birth: ${birthDate}
                - Age: ${new Date().getFullYear() - new Date(birthDate).getFullYear()}
                - Gender: ${gender}
                - Height: ${height} cm
                - Weight: ${weight} kg
                - Heart Rate: ${heartRate}
                - Blood Pressure: ${bloodPressure}
                - Sports Activity: ${sports}
                - Medications: ${medications}
                - Chronic Diseases: ${chronicDiseases}
                - Allergies: ${allergies}
                - Diet: ${diet}
                - Water Intake: ${waterIntake}
                - Family History: ${familyHistory}
                - Smoking: ${smoking}
                - Alcohol Consumption: ${alcohol}
                - Sleep Patterns: ${sleep}
                - Symptoms: ${symptoms}
                - Medical History: ${medicalHistory}
        
                Based on this data, please provide a clear and direct medical assessment. Address my concerns directly, point out potential 
                risks, and explain the significance of my health data. Provide practical advice with specific recommendations for actions I should 
                take to improve my health. Make sure to explain what might happen if I ignore these recommendations, and help me understand the 
                long-term consequences. ${toneInstruction} Answer in language: ${language}`
            }
        ];

        chatMessages = chatMessages.concat(messages || []);

        res.setHeader('Content-Type', 'text/plain; charset=utf-8');
        res.setHeader('Transfer-Encoding', 'chunked');

        const stream = await openai.chat.completions.create({
            model: 'deepseek/deepseek-r1:free',
            messages: chatMessages,
            stream: true,
            temperature: 0.7,
            top_p: 0.8
        });

        for await (const chunk of stream) {
            if (cancelled) {
                res.end();
                return;
            }

            const content = chunk.choices?.[0]?.delta?.content;
            if (content) {
                res.write(content);
            }
        }

        res.end();

    } catch (error: any) {
        console.error('[Sanovise - Hiba] Hiba a streamelés során: ', error);
        res.write('Hiba történt a válasz generálása közben.\n');
        res.write(`Hibakód: ${error.message}\n`);
        res.end();
    }
};

router.post('/advice', (req, res, next) => {
    advice(req, res, next).catch(next);
});

router.post('/advice2', (req, res, next) => {
    advice2(req, res, next).catch(next);
});

export default router;