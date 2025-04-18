import { toastStore } from '@/store';
import { Filesystem } from '@capacitor/filesystem';

export const checkPermissions = async () => {
    const { t } = useNuxtApp().$i18n;
    const permResult = await Filesystem.requestPermissions();

    if (permResult.publicStorage !== 'granted') {
        toastStore.show(t('global.needPermission'), 'error');
        return false;
    } else {
        return true;
    }
}