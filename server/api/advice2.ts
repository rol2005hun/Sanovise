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

        const age = new Date().getFullYear() - new Date(birthDate).getFullYear();
        const toneInstruction = age >= 50
            ? 'Use formal and respectful language, as if speaking to an older patient or in a professional setting.'
            : 'Use informal and friendly language, as if speaking to a peer or younger patient.';
        const messages: OpenAI.ChatCompletionMessageParam[] = [
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
