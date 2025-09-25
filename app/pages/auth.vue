<template>
    <div class="form-card auth-card">
        <PrivacyModalAuth v-if="dataStore.showPrivacyModal" />
        <header class="auth-header">
            <h1>{{ mode === 'login' ? $t('pages.auth.login') : $t('pages.auth.register') }}</h1>
            <button class="toggle-btn" @click="toggleMode">
                {{ mode === 'login' ? $t('pages.auth.goToRegister') : $t('pages.auth.goToLogin') }}
            </button>
        </header>

        <p class="required-info" v-html="$t('components.userForm.requiredInfo')"></p>

        <form @submit.prevent="mode === 'login' ? handleLogin() : handleRegister()" novalidate>
            <template v-if="mode === 'register'">
                <label class="input-label">
                    {{ $t('pages.auth.email') }} <span class="required">*</span>
                </label>
                <input class="input" type="email" v-model.trim="registerForm.email" required />

                <label class="input-label">
                    {{ $t('pages.auth.password') }} <span class="required">*</span>
                </label>
                <input class="input" type="password" v-model="registerForm.password" required />

                <label class="input-label">
                    {{ $t('pages.auth.passwordConfirm') }} <span class="required">*</span>
                </label>
                <input class="input" type="password" v-model="registerForm.confirm" required />

                <div class="checkbox">
                    <input type="checkbox" v-model="registerForm.acceptPrivacy" />
                    <label for="checkbox-label">
                        {{ $t('pages.auth.acceptPrivacy') }}
                        <span @click.stop.prevent="dataStore.showPrivacyModal = true" class="privacy-link">
                            {{ $t('pages.auth.privacyLink') }}<span class="required">*</span>
                        </span>
                    </label>
                </div>

                <div class="actions">
                    <button type="submit" class="go" :disabled="!canRegister">
                        {{ $t('pages.auth.register') }}
                    </button>
                </div>
            </template>

            <template v-else>
                <label class="input-label">
                    {{ $t('pages.auth.email') }} <span class="required">*</span>
                </label>
                <input class="input" type="email" v-model.trim="loginForm.email" required />

                <label class="input-label">
                    {{ $t('pages.auth.password') }} <span class="required">*</span>
                </label>
                <input class="input" type="password" v-model="loginForm.password" required />

                <div class="checkbox">
                    <input type="checkbox" v-model="loginForm.remember" />
                    <label class="checkbox-label">
                        {{ $t('pages.auth.rememberMe') }}
                    </label>
                </div>

                <div class="actions">
                    <button type="submit" class="go" :disabled="!canLogin">
                        {{ $t('pages.auth.login') }}
                    </button>
                </div>
            </template>
        </form>
    </div>
</template>

<script setup lang="ts">
import { dataStore, toastStore } from '@/store';

const tokenCookie = useCookie('sanovise_token', { path: '/', maxAge: 60 * 60 * 24 * 30 });

const mode = ref<'login' | 'register'>('login');
const { t } = useNuxtApp().$i18n;
const ds = dataStore;

function showErrorToast(key: string) {
    toastStore.show(`⚠️ ${t(key)}`, 'error')
}

const toggleMode = () => {
    mode.value = mode.value === 'login' ? 'register' : 'login'
}

const loginForm = reactive({
    email: '',
    password: '',
    remember: false,
});

const registerForm = reactive({
    email: '',
    password: '',
    confirm: '',
    acceptPrivacy: false,
});

const canLogin = computed(() => {
    return loginForm.email.trim().length > 0 && loginForm.password.length > 0
});

const canRegister = computed(() => {
    return (
        registerForm.email.trim().length > 0 &&
        registerForm.password.length > 0 &&
        registerForm.confirm.length > 0 &&
        registerForm.password === registerForm.confirm &&
        registerForm.acceptPrivacy === true
    )
});

async function handleLogin() {
    if (!canLogin.value) {
        showErrorToast('pages.auth.fillEmailPassword')
        return
    }

    try {
        const payload = {
            email: loginForm.email,
            password: loginForm.password,
        }

        const res = await $fetch('http://138.68.77.184:6969/api/auth/login', {
            method: 'POST',
            body: payload,
            headers: { 'Content-Type': 'application/json' }
        })

        if (res && (res as any).success) {
            const token = (res as any).token;
            tokenCookie.value = token;
            ds.setLoggedIn(true);
            toastStore.show(`✅ ${t('pages.auth.loginSuccess')}`, 'success');
            navigateTo('/');
            return;
        }

        showErrorToast('pages.auth.loginFailed');
    } catch (err: any) {
        showErrorToast('pages.auth.loginFailed');
    }
}

async function handleRegister() {
    if (!canRegister.value) {
        showErrorToast('pages.auth.fillAll');
        return;
    }

    try {
        const payload = {
            email: registerForm.email,
            password: registerForm.password,
            userData: ds.userData,
            language: ds.userData?.language || 'en'
        }

        const res = await $fetch('http://138.68.77.184:6969/api/auth/register', {
            method: 'POST',
            body: payload,
            headers: { 'Content-Type': 'application/json' }
        })

        if (res && (res as any).success) {
            const token = (res as any).token;
            tokenCookie.value = token;
            ds.setLoggedIn(true);
            toastStore.show(`✅ ${t('pages.auth.registerSuccess')}`, 'success');
            navigateTo('/');
            return;
        }

        showErrorToast('pages.auth.registerFailed');
    } catch (err: any) {
        showErrorToast('pages.auth.registerFailed');
    }
}

function handleLogout() {
    tokenCookie.value = null;
    toastStore.show('✅ Logged out', 'info');
    ds.setLoggedIn(false);
}
</script>

<style scoped lang="scss">
@use '@/assets/styles/pages/auth.scss';
</style>