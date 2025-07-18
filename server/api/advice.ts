import express, { Request, Response, NextFunction } from 'express';
import { pipeline, env, TextStreamer } from '@huggingface/transformers';
import OpenAI from 'openai';
import 'dotenv/config';
import { sendDiscordLog } from '../utils/discordLogger';
import * as crypto from 'crypto';

const router = express.Router();

let pipe: any;
(async () => {
    try {
        env.cacheDir = './.cache';
        pipe = await pipeline('text-generation', 'zeeshaan-ai/Medical-Summary-Notes-ONNX');
        console.log('[Sanovise - Success] Model loaded successfully.');
        sendDiscordLog('Hugging Face model loaded successfully.', 'INFO');
    } catch (error) {
        console.error('[Sanovise - Error] Error loading model: ', error);
        sendDiscordLog(`Error loading Hugging Face model: ${error instanceof Error ? error.message : JSON.stringify(error)}`, 'ERROR');
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
    const startTime = Date.now();
    const requestId = crypto.randomUUID();

    sendDiscordLog(
        `[RequestID: ${requestId}] '/advice' request started. ` +
        `IP: ${req.ip || 'unknown'} | ` +
        `User-Agent: ${req.headers['user-agent'] || 'unknown'}`,
        'INFO'
    );

    let cancelled = false;
    res.on('close', () => {
        cancelled = true;
        const duration = Date.now() - startTime;
        sendDiscordLog(
            `[RequestID: ${requestId}] '/advice' request cancelled by client. ` +
            `Duration: ${duration}ms.`,
            'WARNING'
        );
    });

    try {
        const {
            birthDate, gender, height, weight, language,
            heartRate, bloodPressure, sports, medications, chronicDiseases, allergies, diet, waterIntake,
            familyHistory, smoking, alcohol, sleep, symptoms, medicalHistory, vaccinations, supplements, sleepQuality,
            mentalHealth, cholesterolLevel, bloodSugarLevel, reproductiveHealth, visionAndHearing,
            messages
        } = req.body;

        if (!birthDate || !gender || !height || !weight || !language) {
            const errorMessage = 'Missing fields! Please provide all required data.';
            const missingFields: string[] = [];
            if (!birthDate) missingFields.push('birthDate');
            if (!gender) missingFields.push('gender');
            if (!height) missingFields.push('height');
            if (!weight) missingFields.push('weight');
            if (!language) missingFields.push('language');
            const missingFieldsInfo = missingFields.join(', ');

            console.warn(`[Sanovise - Warning] [RequestID: ${requestId}] Missing data in /advice request: ${missingFieldsInfo}`);
            sendDiscordLog(
                `[RequestID: ${requestId}] Missing data in '/advice' request. ` +
                `Required fields missing: ${missingFieldsInfo}`,
                'WARNING'
            );
            return res.status(400).json({
                success: false,
                error: errorMessage,
                missingFields: { birthDate, gender, height, weight, language }
            });
        }

        sendDiscordLog(
            `[RequestID: ${requestId}] '/advice' request data received and validated.`,
            'INFO'
        );

        let chatMessages = [
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
                    - Heart Rate: ${heartRate || 'N/A'}
                    - Blood Pressure: ${bloodPressure || 'N/A'}
                    - Sports Activity: ${sports || 'N/A'}
                    - Medications: ${medications || 'N/A'}
                    - Chronic Diseases: ${chronicDiseases || 'N/A'}
                    - Allergies: ${allergies || 'N/A'}
                    - Diet: ${diet || 'N/A'}
                    - Water Intake: ${waterIntake || 'N/A'}
                    - Family History: ${familyHistory || 'N/A'}
                    - Smoking: ${smoking || 'N/A'}
                    - Alcohol Consumption: ${alcohol || 'N/A'}
                    - Sleep Patterns: ${sleep || 'N/A'}
                    - Symptoms: ${symptoms || 'N/A'}
                    - Medical History: ${medicalHistory || 'N/A'}
                    - Vaccinations: ${vaccinations || 'N/A'}
                    - Supplements: ${supplements || 'N/A'}
                    - Sleep Quality: ${sleepQuality || 'N/A'}
                    - Mental Health: ${mentalHealth || 'N/A'}
                    - Cholesterol Level: ${cholesterolLevel || 'N/A'}
                    - Blood Sugar Level: ${bloodSugarLevel || 'N/A'}
                    - Reproductive Health: ${reproductiveHealth || 'N/A'}
                    - Vision and Hearing: ${visionAndHearing || 'N/A'}

                    Based on all of this, please give me a clear and direct medical assessment. Speak to me like we’re in a real consultation. Tell me what my data means, point out any risks, and explain how they might affect my health. I want **practical, specific advice** on what I should do to improve things.

                    Please also explain what could happen if I don’t follow these recommendations, and help me understand the long-term consequences — in a way that's easy to grasp.

                    Answer in language: ${language}
                `
            }
        ];

        chatMessages = chatMessages.concat(messages || []);

        res.setHeader('Content-Type', 'text/plain');
        res.setHeader('Transfer-Encoding', 'chunked');

        sendDiscordLog(
            `[RequestID: ${requestId}] Calling Hugging Face model for '/advice' endpoint.`,
            'INFO'
        );

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

        await pipe(chatMessages, { max_new_tokens: 512, temperature: 0.7, top_k: 100, top_p: 0.8, do_sample: true, streamer });
        res.end();

        const duration = Date.now() - startTime;
        sendDiscordLog(
            `[RequestID: ${requestId}] '/advice' request successfully processed and response sent. ` +
            `Duration: ${duration}ms.`,
            'INFO'
        );

    } catch (error: Error | any) {
        const duration = Date.now() - startTime;
        console.error('[Sanovise - Error] Error during streaming (/advice): ', error);
        sendDiscordLog(
            `[RequestID: ${requestId}] Error during streaming (/advice): ${error instanceof Error ? error.message : JSON.stringify(error)}. ` +
            `Duration (error): ${duration}ms.`,
            'ERROR'
        );
        res.write('An error occurred during the process. Please try again.\n');
        res.write(`Error Code: ${error.message}\n`);
        res.end();
    }
}

const advice2 = async (req: Request, res: Response, next: NextFunction) => {
    const startTime = Date.now();
    const requestId = crypto.randomUUID();

    sendDiscordLog(
        `[RequestID: ${requestId}] '/advice2' request started. ` +
        `IP: ${req.ip || 'unknown'} | ` +
        `User-Agent: ${req.headers['user-agent'] || 'unknown'}`,
        'INFO'
    );

    let cancelled = false;
    res.on('close', () => {
        cancelled = true;
        const duration = Date.now() - startTime;
        sendDiscordLog(
            `[RequestID: ${requestId}] '/advice2' request cancelled by client. ` +
            `Duration: ${duration}ms.`,
            'WARNING'
        );
    });

    try {
        const {
            birthDate, gender, height, weight, language,
            heartRate, bloodPressure, sports, medications, chronicDiseases, allergies, diet, waterIntake,
            familyHistory, smoking, alcohol, sleep, symptoms, medicalHistory, vaccinations, supplements, sleepQuality,
            mentalHealth, cholesterolLevel, bloodSugarLevel, reproductiveHealth, visionAndHearing,
            messages, selectedModel
        } = req.body;

        if (!birthDate || !gender || !height || !weight || !language) {
            const errorMessage = 'Missing fields! Please provide all required data.';
            const missingFields: string[] = [];
            if (!birthDate) missingFields.push('birthDate');
            if (!gender) missingFields.push('gender');
            if (!height) missingFields.push('height');
            if (!!weight) missingFields.push('weight');
            if (!language) missingFields.push('language');
            const missingFieldsInfo = missingFields.join(', ');

            console.warn(`[Sanovise - Warning] [RequestID: ${requestId}] Missing data in /advice2 request.`);
            sendDiscordLog(
                `[RequestID: ${requestId}] Missing data in '/advice2' request. ` +
                `Required fields missing: ${missingFieldsInfo}`,
                'WARNING'
            );
            return res.status(400).json({
                success: false,
                error: errorMessage,
                missingFields: { birthDate, gender, height, weight, language }
            });
        }

        sendDiscordLog(
            `[RequestID: ${requestId}] '/advice2' request data received and validated. ` +
            `Model: ${selectedModel || 'deepseek/deepseek-r1:free'}.`,
            'INFO'
        );

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
                    - Heart Rate: ${heartRate || 'N/A'}
                    - Blood Pressure: ${bloodPressure || 'N/A'}
                    - Sports Activity: ${sports || 'N/A'}
                    - Medications: ${medications || 'N/A'}
                    - Chronic Diseases: ${chronicDiseases || 'N/A'}
                    - Allergies: ${allergies || 'N/A'}
                    - Diet: ${diet || 'N/A'}
                    - Water Intake: ${waterIntake || 'N/A'}
                    - Family History: ${familyHistory || 'N/A'}
                    - Smoking: ${smoking || 'N/A'}
                    - Alcohol Consumption: ${alcohol || 'N/A'}
                    - Sleep Patterns: ${sleep || 'N/A'}
                    - Symptoms: ${symptoms || 'N/A'}
                    - Medical History: ${medicalHistory || 'N/A'}
                    - Vaccinations: ${vaccinations || 'N/A'}
                    - Supplements: ${supplements || 'N/A'}
                    - Sleep Quality: ${sleepQuality || 'N/A'}
                    - Mental Health: ${mentalHealth || 'N/A'}
                    - Cholesterol Level: ${cholesterolLevel || 'N/A'}
                    - Blood Sugar Level: ${bloodSugarLevel || 'N/A'}
                    - Reproductive Health: ${reproductiveHealth || 'N/A'}
                    - Vision and Hearing: ${visionAndHearing || 'N/A'}

                    Based on all of this, please give me a clear and direct medical assessment. Speak to me like we’re in a real consultation. Tell me what my data means, point out any risks, and explain how they might affect my health. I want **practical, specific advice** on what I should do to improve things.

                    Please also explain what could happen if I don’t follow these recommendations, and help me understand the long-term consequences — in a way that's easy to grasp.

                    Answer in language: ${language}
                `
            }
        ];

        chatMessages = chatMessages.concat(messages || []);

        res.setHeader('Content-Type', 'text/plain; charset=utf-8');
        res.setHeader('Transfer-Encoding', 'chunked');

        sendDiscordLog(
            `[RequestID: ${requestId}] Calling OpenAI model for '/advice2' endpoint. Model: ${model}.`,
            'INFO'
        );

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

        const duration = Date.now() - startTime;
        sendDiscordLog(
            `[RequestID: ${requestId}] '/advice2' request successfully processed and response sent. ` +
            `Duration: ${duration}ms.`,
            'INFO'
        );

    } catch (error: Error | any) {
        const duration = Date.now() - startTime;
        console.error('[Sanovise - Error] Error during streaming (/advice2): ', error);
        sendDiscordLog(
            `[RequestID: ${requestId}] Error during streaming (/advice2): ${error instanceof Error ? error.message : JSON.stringify(error)}. ` +
            `Duration (error): ${duration}ms.`,
            'ERROR'
        );
        res.write('An error occurred during the response generation. Please try again.\n');
        res.write(`Error Code: ${error.message}\n`);
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