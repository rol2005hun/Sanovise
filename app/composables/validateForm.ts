import { dataStore, toastStore } from '@/store';

export const validateForm = () => {
    const { t } = useNuxtApp().$i18n;
    const data = dataStore.userData;

    if (parseInt(data.height) < 50 || parseInt(data.height) > 250) {
        toastStore.show(`⚠️ ${t('components.userForm.invalidHeight')}`, 'error');
        return false;
    }

    if (parseInt(data.weight) < 1 || parseInt(data.weight) > 500) {
        toastStore.show(`⚠️ ${t('components.userForm.invalidWeight')}`, 'error');
        return false;
    }

    if (parseInt(data.waterIntake) < 0 || parseInt(data.waterIntake) > 50) {
        toastStore.show(`⚠️ ${t('components.userForm.invalidWaterIntake')}`, 'error');
        return false;
    }

    if (parseInt(data.heartRate) < 30 || parseInt(data.heartRate) > 250) {
        toastStore.show(`⚠️ ${t('components.userForm.invalidHeartRate')}`, 'error');
        return false;
    }

    if (parseInt(data.sleep) < 0 || parseInt(data.sleep) > 24) {
        toastStore.show(`⚠️ ${t('components.userForm.invalidSleep')}`, 'error');
        return false;
    }

    if (data.bloodPressure && !/^\d{2,3}\/\d{2,3}$/.test(data.bloodPressure)) {
        toastStore.show(`⚠️ ${t('components.userForm.invalidBloodPressure')}`, 'error');
        return false;
    }

    return true;
}