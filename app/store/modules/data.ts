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
        },
        serverResponse: null as any,
        thinking: false,
        showOptionalFields: false,
        showPrivacyModal: false,
        controller: <AbortController | null>(null),
    }),

    actions: {

    }
});