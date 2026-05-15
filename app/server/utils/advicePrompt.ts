export type AdvicePayload = {
  birthDate?: string;
  gender?: string;
  height?: string;
  weight?: string;
  language?: string;
  heartRate?: string;
  bloodPressure?: string;
  sports?: string;
  medications?: string;
  chronicDiseases?: string;
  allergies?: string;
  diet?: string;
  waterIntake?: string;
  familyHistory?: string;
  smoking?: string;
  alcohol?: string;
  sleep?: string;
  symptoms?: string;
  medicalHistory?: string;
  vaccinations?: string;
  supplements?: string;
  sleepQuality?: string;
  mentalHealth?: string;
  cholesterolLevel?: string;
  bloodSugarLevel?: string;
  reproductiveHealth?: string;
  visionAndHearing?: string;
  messages?: any[];
  selectedModel?: string;
};

export function getMissingFields(input: AdvicePayload) {
  const missingFields: string[] = [];
  if (!input.birthDate) missingFields.push('birthDate');
  if (!input.gender) missingFields.push('gender');
  if (!input.height) missingFields.push('height');
  if (!input.weight) missingFields.push('weight');
  if (!input.language) missingFields.push('language');
  return missingFields;
}

export function createSystemPrompt() {
  return `
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
  `;
}

export function createUserPrompt(input: AdvicePayload) {
  const age = input.birthDate ? new Date().getFullYear() - new Date(input.birthDate).getFullYear() : 'N/A';

  return `
    Here are my details:

    - Date of Birth: ${input.birthDate}
    - Age: ${age}
    - Gender: ${input.gender}
    - Height: ${input.height} cm
    - Weight: ${input.weight} kg
    - Heart Rate: ${input.heartRate || 'N/A'}
    - Blood Pressure: ${input.bloodPressure || 'N/A'}
    - Sports Activity: ${input.sports || 'N/A'}
    - Medications: ${input.medications || 'N/A'}
    - Chronic Diseases: ${input.chronicDiseases || 'N/A'}
    - Allergies: ${input.allergies || 'N/A'}
    - Diet: ${input.diet || 'N/A'}
    - Water Intake: ${input.waterIntake || 'N/A'}
    - Family History: ${input.familyHistory || 'N/A'}
    - Smoking: ${input.smoking || 'N/A'}
    - Alcohol Consumption: ${input.alcohol || 'N/A'}
    - Sleep Patterns: ${input.sleep || 'N/A'}
    - Symptoms: ${input.symptoms || 'N/A'}
    - Medical History: ${input.medicalHistory || 'N/A'}
    - Vaccinations: ${input.vaccinations || 'N/A'}
    - Supplements: ${input.supplements || 'N/A'}
    - Sleep Quality: ${input.sleepQuality || 'N/A'}
    - Mental Health: ${input.mentalHealth || 'N/A'}
    - Cholesterol Level: ${input.cholesterolLevel || 'N/A'}
    - Blood Sugar Level: ${input.bloodSugarLevel || 'N/A'}
    - Reproductive Health: ${input.reproductiveHealth || 'N/A'}
    - Vision and Hearing: ${input.visionAndHearing || 'N/A'}

    Based on all of this, please give me a clear and direct medical assessment. Speak to me like we’re in a real consultation. Tell me what my data means, point out any risks, and explain how they might affect my health. I want **practical, specific advice** on what I should do to improve things.

    Please also explain what could happen if I don’t follow these recommendations, and help me understand the long-term consequences — in a way that's easy to grasp.

    Answer in language: ${input.language}
  `;
}
