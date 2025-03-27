import express, { Request, Response, NextFunction } from 'express';
import { pipeline, env, TextStreamer } from '@huggingface/transformers';

const router = express.Router();

let pipe: any;
(async () => {
    try {
        env.cacheDir = './.cache';
        pipe = await pipeline('text-generation', 'HuggingFaceTB/SmolLM2-1.7B-Instruct', { dtype: 'q4', device: 'cpu', });
        console.log('[Sanovise - Siker] A modell sikeresen betöltve.');
    } catch (error) {
        console.error('[Sanovise - Hiba] Hiba a modell betöltésekor: ', error);
    }
})();

const advice = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { birthDate, gender, height, weight, heartRate, bloodPressure, symptoms, medicalHistory } = req.body;

        if (!birthDate || !gender || !height || !weight || !heartRate || !bloodPressure || !symptoms || !medicalHistory) {
            return res.status(400).json({
                success: false,
                error: 'Hiányzó mezők! Kérlek, add meg az összes szükséges adatot.',
                missingFields: {
                    birthDate: !!birthDate,
                    gender: !!gender,
                    height: !!height,
                    weight: !!weight,
                    heartRate: !!heartRate,
                    bloodPressure: !!bloodPressure,
                    symptoms: !!symptoms,
                    medicalHistory: !!medicalHistory,
                }
            });
        }

        const messages = [
            {
                role: 'system',
                content: `You are a professional and courteous doctor. Always address the patient directly in a respectful and formal manner.
                Speak as though you are in a face-to-face conversation, focusing on creating trust and clarity in your response. Avoid using farewells,
                as if the conversation were ongoing in person.`
            },
            {
                role: 'user',
                content: `
                    Based on the following medical data, please provide a brief and professional health recommendation.
                    
                    **Patient Details:**
                    - Date of Birth: ${birthDate}
                    - Gender: ${gender}
                    - Height: ${height} cm
                    - Weight: ${weight} kg
                    - Average Heart Rate: ${heartRate}
                    - Blood Pressure: ${bloodPressure}
                    - Symptoms: ${symptoms}
                    - Medical History: ${medicalHistory}
                    
                   Your response should be concise and spoken in a respectful and polite tone, focusing on potential health concerns or next steps to consider.
                `
            }
        ];

        res.setHeader('Content-Type', 'text/plain');
        res.setHeader('Transfer-Encoding', 'chunked');

        const streamer = new TextStreamer(pipe.tokenizer, {
            skip_prompt: true,
            callback_function: (token: string) => {
                res.write(token);
            },
        });

        await pipe(messages, { max_new_tokens: 512, temperature: 1.0, top_k: 50, top_p: 0.9, do_sample: true, streamer });

        res.end();

    } catch (error: Error | any) {
        console.error('Hiba a válasz generálása közben: ', error);
        res.write('Hiba történt a folyamat során.\n');
        res.write(`Hibakód: ${error.message}\n`);
        res.end();
    }
}

router.post('/advice', (req, res, next) => {
    advice(req, res, next).catch(next);
});

export default router;