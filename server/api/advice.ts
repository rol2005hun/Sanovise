import express, { Request, Response, NextFunction } from 'express';
import { pipeline } from '@xenova/transformers';

const router = express.Router();

let pipe: any;
(async () => {
    try {
        pipe = await pipeline('text2text-generation', 'Xenova/LaMini-Flan-T5-783M');
        console.log('[Sanovise - Siker] AI modell sikeresen betöltve.');
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

        const message = `
        Based on the following medical data, please provide a brief medical recommendation.
        Patient details:
        - Birthdate: ${birthDate}
        - Gender: ${gender}
        - Height: ${height} cm
        - Weight: ${weight} kg
        - Usual heart rate: ${heartRate}
        - Usual blood pressure: ${bloodPressure}
        - Symptoms: ${symptoms}
        - Medical history: ${medicalHistory}
        
        Please keep the response short and focused on potential health concerns or next steps.
        `;

        const output = await pipe(message);

        return res.status(200).json({
            success: true,
            message: 'Sikeres AI válasz generálás.',
            response: output[0]?.generated_text || 'Nincs válasz.',
        });

    } catch (error: Error | any) {
        console.error('Hiba a válasz generálása közben:', error);
        return res.status(500).json({
            success: false,
            error: 'Belső szerver hiba.',
            details: error.message
        });
    }
};

router.post('/advice', (req, res, next) => {
    advice(req, res, next).catch(next);
});

export default router;