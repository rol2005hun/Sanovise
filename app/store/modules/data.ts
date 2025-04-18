import { defineStore } from 'pinia';

export const useData = defineStore('data', {
    state: () => ({
        userData: {
            birthDate: '',
            gender: '',
            height: '',
            weight: '',
            heartRate: '',
            bloodPressure: '',
            sports: '',
            medications: '',
            chronicDiseases: '',
            allergies: '',
            diet: '',
            waterIntake: '',
            familyHistory: '',
            smoking: '',
            alcohol: '',
            sleep: '',
            symptoms: '',
            medicalHistory: '',
            language: ''
        },
        messages: [] as { role: string, content: string }[],
        currentResponse: null as string | null,
        responseType: null as string | null,
        showOptionalFields: false,
        showPrivacyModal: false,
        acceptedPrivacyPolicy: false,
        controller: <AbortController | null>(null),
    }),

    actions: {
        
    }
});