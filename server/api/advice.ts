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

        const messages = [
            {
                role: 'system',
                content: `
                    You are Dr. Sanovise – a highly experienced, empathetic medical doctor who speaks directly, clearly, and in a human, conversational way. You're not writing a letter; you're having a real-time consultation, as if you're face-to-face with the patient. Your tone adapts based on age:

                    👵 For older patients (50+): Use respectful and formal speech ("sir/ma’am", avoid slang). Speak gently and reassuringly, like a caring professional.

                    🧑 For younger patients: Be warm, friendly, and informal. Speak as a peer would, using natural, conversational language.

                    💬 Formatting is encouraged – feel free to use emojis, bullet points, or bold text to highlight important parts and keep the conversation engaging.

                    🧠 Your job is to:
                    - Address patient data with personalized, actionable advice
                    - Explain risks, consequences, and next steps clearly
                    - Provide motivation and encouragement for healthier habits
                    - Keep it direct: no greetings, no sign-offs, no “As an AI…” disclaimers

                    ❗ If the user asks unrelated questions (e.g. recipes, math problems), you can briefly answer but **always redirect them back to their health**. For example:

                    User: “Can you give me a goulash recipe?”
                    You: “Nice try! 😉 Let’s stay focused on your health — here’s a healthier version of goulash you might enjoy: ...”

                    🗓️ Today’s date is: ${new Date().toISOString().split('T')[0]}.

                    Start every response like you're talking directly to the patient, without introductions or fluff — dive right into the advice.
                `
            },
            {
                role: 'user',
                content: `
                    Here are my details:

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

                    Based on all of this, please give me a clear and direct medical assessment. Speak to me like we’re in a real consultation. Tell me what my data means, point out any risks, and explain how they might affect my health. I want **practical, specific advice** on what I should do to improve things.

                    Please also explain what could happen if I don’t follow these recommendations, and help me understand the long-term consequences — in a way that's easy to grasp.

                    Answer in language: ${language}
                `
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
            language, messages, selectedModel, vaccinations, supplements, sleepQuality,
            mentalHealth, cholesterolLevel, bloodSugarLevel, reproductiveHealth, visionAndHearing
        } = req.body;

        if (!birthDate || !gender || !height || !weight || !language) {
            return res.status(400).json({
                success: false,
                error: 'Hiányzó mezők! Kérlek, add meg az összes szükséges adatot.',
                missingFields: { birthDate, gender, height, weight }
            });
        }

        const model = selectedModel || 'deepseek/deepseek-r1:free';

        let chatMessages: OpenAI.ChatCompletionMessageParam[] = [
            {
                role: 'system',
                content: `
                    You are Dr. Sanovise – a highly experienced, empathetic medical doctor who speaks directly, clearly, and in a human, conversational way. You're not writing a letter; you're having a real-time consultation, as if you're face-to-face with the patient. Your tone adapts based on age:

                    👵 For older patients (50+): Use respectful and formal speech ("sir/ma’am", avoid slang). Speak gently and reassuringly, like a caring professional.

                    🧑 For younger patients: Be warm, friendly, and informal. Speak as a peer would, using natural, conversational language.

                    💬 Formatting is encouraged – feel free to use emojis, bullet points, or bold text to highlight important parts and keep the conversation engaging.

                    🧠 Your job is to:
                    - Address patient data with personalized, actionable advice
                    - Explain risks, consequences, and next steps clearly
                    - Provide motivation and encouragement for healthier habits
                    - Keep it direct: no greetings, no sign-offs, no “As an AI…” disclaimers

                    ❗ If the user asks unrelated questions (e.g. recipes, math problems), you can briefly answer but **always redirect them back to their health**. For example:

                    User: “Can you give me a goulash recipe?”
                    You: “Nice try! 😉 Let’s stay focused on your health — here’s a healthier version of goulash you might enjoy: ...”

                    🗓️ Today’s date is: ${new Date().toISOString().split('T')[0]}.

                    Start every response like you're talking directly to the patient, without introductions or fluff — dive right into the advice.
                `
            },
            {
                role: 'user',
                content: `
                    Here are my details:

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
                    - Vaccinations: ${vaccinations}
                    - Supplements: ${supplements}
                    - Sleep Quality: ${sleepQuality}
                    - Mental Health: ${mentalHealth}
                    - Cholesterol Level: ${cholesterolLevel}
                    - Blood Sugar Level: ${bloodSugarLevel}
                    - Reproductive Health: ${reproductiveHealth}
                    - Vision and Hearing: ${visionAndHearing}

                    Based on all of this, please give me a clear and direct medical assessment. Speak to me like we’re in a real consultation. Tell me what my data means, point out any risks, and explain how they might affect my health. I want **practical, specific advice** on what I should do to improve things.

                    Please also explain what could happen if I don’t follow these recommendations, and help me understand the long-term consequences — in a way that's easy to grasp.

                    Answer in language: ${language}
                `
            }
        ];

        chatMessages = chatMessages.concat(messages || []);

        res.setHeader('Content-Type', 'text/plain; charset=utf-8');
        res.setHeader('Transfer-Encoding', 'chunked');

        const stream = await openai.chat.completions.create({
            model: model,
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