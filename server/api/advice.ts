import express, { Request, Response, NextFunction } from 'express';
import { pipeline, env, TextStreamer } from '@huggingface/transformers';

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

const advice = async (req: Request, res: Response, next: NextFunction) => {
    let cancelled = false;
    res.on('close', () => {
        cancelled = true;
    });

    try {
        const { birthDate, gender, height, weight, heartRate, bloodPressure, sports, medications, chronicDiseases, allergies, diet, waterIntake, familyHistory, smoking, alcohol, sleep, symptoms, medicalHistory } = req.body;

        if (!birthDate || !gender || !height || !weight) {
            return res.status(400).json({
                success: false,
                error: 'Hiányzó mezők! Kérlek, add meg az összes szükséges adatot.',
                missingFields: { birthDate, gender, height, weight }
            });
        }

        const messages = [
            {
                role: 'system',
                content: `You are an experienced doctor with years of clinical practice. You always communicate clearly and empathetically,
                        just as you would during a real consultation. Your advice is practical, professional, and medically sound.
                        You do not introduce yourself, and you do not use excessive pleasantries—just give clear, structured, and medically
                        relevant information. Do not use any name parameter in your answer. Today's date is: ${new Date().getFullYear()}-
                        ${String(new Date().getMonth() + 1).padStart(2, '0')}-${String(new Date().getDate()).padStart(2, '0')}.
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
        console.error('Hiba a válasz generálása közben: ', error);
        res.write('Hiba történt a folyamat során. Kérlek, próbáld újra.\n');
        res.write(`Hibakód: ${error.message}\n`);
        res.end();
    }
}

router.post('/advice', (req, res, next) => {
    advice(req, res, next).catch(next);
});

export default router;