import { dataStore, toastStore } from '@/store';

function debounce(fn: (...args: any[]) => void, delay = 5000) {
    let timer: ReturnType<typeof setTimeout> | null = null;
    return (...args: any[]) => {
        if (timer) clearTimeout(timer);
        timer = setTimeout(() => fn(...args), delay);
    }
}

export function useAutoSaveUserData() {
    const ds = dataStore;
    const ts = toastStore;
    const { t } = useI18n();

    async function saveToServer(userData: any) {
        try {
            const token = useCookie('sanovise_token').value;
            if (!token) return;

            const res = await $fetch('http://138.68.77.184:6969/api/auth/update', {
                method: 'POST',
                headers: { Authorization: `Bearer ${token}` },
                body: { userData }
            }) as any;

            if (res && res.success) {
                if (res.user && res.user.userData) {
                    ds.userData = { ...ds.userData, ...res.user.userData };
                }
                ts.show(t('global.autoSaveSuccess'), 'success');
            }
        } catch (err: any) {
            const errMsg = err?.data?.error || err?.message || '';
            ts.show(t('global.autoSaveFailure', { error: errMsg }), 'error');
        }
    }

    const debouncedSave = debounce((ud: any) => {
        saveToServer(ud);
    }, 5000);

    function start() {
        const stop = watch(() => JSON.stringify(dataStore.userData), (newVal, oldVal) => {
            if (!dataStore.isLoggedIn) return;
            try {
                const ud = JSON.parse(newVal as string);
                debouncedSave(ud);
            } catch (e) {
                console.error('Failed to parse userData for auto-save:', e);
            }
        });

        return stop;
    }

    return { start };
}