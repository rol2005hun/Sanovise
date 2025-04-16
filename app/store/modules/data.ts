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
        serverResponse: null as string | null,
        responseType: null as string | null,
        showOptionalFields: false,
        showPrivacyModal: false,
        controller: <AbortController | null>(null),
    }),

    actions: {
        
    }
});