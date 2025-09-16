import { dataStore, toastStore } from '@/store';

export default defineNuxtRouteMiddleware(async (to, from) => {
    const ds = dataStore;
    const ts = toastStore;

    try {
        const token = useCookie('sanovise_token').value;
        if (!token) {
            ds.setLoggedIn(false);
            return;
        }

        try {
            const res = await $fetch('http://138.68.77.184:6969/api/auth/me', {
                method: 'GET',
                headers: { Authorization: `Bearer ${token}` }
            }) as any;

            if (res && res.success) {
                ds.setLoggedIn(true);
                if (res.user && res.user.userData) {
                    ds.userData = { ...ds.userData, ...res.user.userData };
                }
                if (to.path === '/auth' || to.path.startsWith('/auth/')) {
                    return navigateTo('/');
                }
                return;
            }
        } catch (err: any) {
            useCookie('sanovise_token').value = null;
            ds.setLoggedIn(false);
            const message = err?.data?.error || err?.message || 'Authentication failed';
            ts.show(`⚠️ ${message}`, 'error');
            return;
        }
    } catch (e) {
        ds.setLoggedIn(false);
    }
});