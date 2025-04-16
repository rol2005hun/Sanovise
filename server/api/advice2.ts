import express, { Request, Response, NextFunction } from 'express';
import OpenAI from 'openai';
import 'dotenv/config';

const router = express.Router();

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

        const messages: OpenAI.ChatCompletionMessageParam[] = [
            {
                role: 'system',
                content: `You are an experienced doctor with years of clinical practice. You always communicate clearly and empathetically,
                just as you would during a real consultation. Your advice is practical, professional, and medically sound.
                Do not introduce yourself, and do not use excessive pleasantries—just give clear, structured, and medically
                relevant information. Do not use any name parameter in your answer. Today's date is: ${new Date().toISOString().split('T')[0]}.
                Example patient data:
                - Age: 45
                - Gender: Male
                - Symptoms: High blood pressure, fatigue
                - Medical history: Hypertension
                Ideal doctor response:
                Your blood pressure readings suggest hypertension, which increases the risk of cardiovascular issues.
                It would be advisable to monitor your BP regularly and consult a doctor if it remains elevated. Lifestyle changes
                like reducing sodium intake and increasing physical activity can help.`
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

                Analyze the following medical data and provide a professional assessment. Identify potential health concerns,
                explain their significance, and suggest specific next steps. Your response should be medically accurate, structured, and concise.
                Answer in language: ${language}`
            }
        ];

        res.setHeader('Content-Type', 'text/plain; charset=utf-8');
        res.setHeader('Transfer-Encoding', 'chunked');

        const stream = await openai.chat.completions.create({
            model: 'deepseek/deepseek-r1:free',
            messages,
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

router.post('/advice2', (req, res, next) => {
    advice(req, res, next).catch(next);
});

export default router;
