import mongoose, { Schema, Document } from 'mongoose';

export interface IUserData {
    birthDate: string;
    gender: string;
    height: string;
    weight: string;
    heartRate: string;
    bloodPressure: string;
    sports: string;
    medications: string;
    chronicDiseases: string;
    allergies: string;
    diet: string;
    waterIntake: string;
    familyHistory: string;
    smoking: string;
    alcohol: string;
    sleep: string;
    physicalActivityLevel: string;
    workType: string;
    stressLevel: string;
    mentalHealth: string;
    cholesterolLevel: string;
    bloodSugarLevel: string;
    supplements: string;
    vaccinations: string;
    reproductiveHealth: string;
    visionAndHearing: string;
    sleepQuality: string;
    symptoms: string;
    medicalHistory: string;
    language: string;
    selectedModel: {
        id: string;
        name: string;
        type: string;
    };
}

export interface IUser extends Document {
    email: string;
    passwordHash: string;
    favoriteModel: string;
    language: string;
    userData: IUserData;
    createdAt: Date;
    updatedAt: Date;
}

const SelectedModelSchema = new Schema(
    {
        id: { type: String, default: 'deepseek/deepseek-r1:free' },
        name: { type: String, default: 'DeepSeek R1' },
        type: { type: String, default: 'advice2' }
    },
    { _id: false }
);

const UserDataSchema = new Schema(
    {
        birthDate: { type: String, default: '' },
        gender: { type: String, default: '' },
        height: { type: String, default: '' },
        weight: { type: String, default: '' },
        heartRate: { type: String, default: '' },
        bloodPressure: { type: String, default: '' },
        sports: { type: String, default: '' },
        medications: { type: String, default: '' },
        chronicDiseases: { type: String, default: '' },
        allergies: { type: String, default: '' },
        diet: { type: String, default: '' },
        waterIntake: { type: String, default: '' },
        familyHistory: { type: String, default: '' },
        smoking: { type: String, default: '' },
        alcohol: { type: String, default: '' },
        sleep: { type: String, default: '' },
        physicalActivityLevel: { type: String, default: '' },
        workType: { type: String, default: '' },
        stressLevel: { type: String, default: '' },
        mentalHealth: { type: String, default: '' },
        cholesterolLevel: { type: String, default: '' },
        bloodSugarLevel: { type: String, default: '' },
        supplements: { type: String, default: '' },
        vaccinations: { type: String, default: '' },
        reproductiveHealth: { type: String, default: '' },
        visionAndHearing: { type: String, default: '' },
        sleepQuality: { type: String, default: '' },
        symptoms: { type: String, default: '' },
        medicalHistory: { type: String, default: '' },
        language: { type: String, default: '' },
        selectedModel: { type: SelectedModelSchema, default: () => ({}) }
    },
    { _id: false }
);

const UserSchema = new Schema<IUser>(
    {
        email: { type: String, required: true, unique: true },
        passwordHash: { type: String, required: true },
        userData: { type: UserDataSchema, default: () => ({}) }
    },
    { timestamps: true }
);

export default mongoose.models.User || mongoose.model<IUser>('User', UserSchema);