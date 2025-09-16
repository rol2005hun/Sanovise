<template>
    <form @submit.prevent="submitData" class="data-form" v-show="dataStore.showForm">
        <p class="required-info" v-html="$t('components.userForm.requiredInfo')"></p>
        <label for="birthDate">{{ $t('components.userForm.birthDate') }}<span class="required">*</span></label>
        <input type="date" id="birthDate" v-model="dataStore.userData.birthDate" required />

        <label for="gender">{{ $t('components.userForm.gender') }}<span class="required">*</span></label>
        <select id="gender" v-model="dataStore.userData.gender" required>
            <option value="" disabled selected>{{ $t('components.userForm.selectGender') }}</option>
            <option value="male">{{ $t('components.userForm.male') }}</option>
            <option value="female">{{ $t('components.userForm.female') }}</option>
        </select>

        <label for="height">{{ $t('components.userForm.height') }} (cm)<span class="required">*</span></label>
        <input type="number" id="height" v-model="dataStore.userData.height" min="50" max="300" required
            :placeholder="$t('components.userForm.placeholderHeight')" />

        <label for="weight">{{ $t('components.userForm.weight') }} (kg)<span class="required">*</span></label>
        <input type="number" id="weight" v-model="dataStore.userData.weight" min="1" max="500" required
            :placeholder="$t('components.userForm.placeholderWeight')" />

        <button type="button" @click="dataStore.showOptionalFields = !dataStore.showOptionalFields"
            class="toggle-extra">
            {{ dataStore.showOptionalFields ? $t('components.userForm.hideExtra') :
                $t('components.userForm.showExtra') }}
        </button>

        <OptionalFields />

        <div class="privacy-checkbox">
            <input type="checkbox" id="privacyPolicy" v-model="dataStore.acceptedPrivacyPolicy" required />
            <label for="privacyPolicy">
                {{ $t('components.userForm.acceptPrivacy') }}
                <span @click.stop.prevent="dataStore.showPrivacyModal = true" class="privacy-link">
                    {{ $t('components.userForm.privacyLink') }}<span class="required">*</span>
                </span>
            </label>
        </div>

        <div class="buttons">
            <button v-if="!dataStore.responseType" type="submit" @click="validateForm"
                :class="['submit', { 'disabled': !dataStore.acceptedPrivacyPolicy || hasValidMessages || !isUserDataComplete }]"
                :disabled="!dataStore.acceptedPrivacyPolicy || hasValidMessages || !isUserDataComplete">{{
                    $t('components.userForm.submitData')
                }}</button>
            <button v-else type="button" @click="stopAnswering()" class="abort">{{ $t('components.userForm.abort')
                }}</button>
            <button class="open-health-page">
                <NuxtLink to="/health">{{ $t('components.userForm.healthPage') }}</NuxtLink>
            </button>
            <button type="button" :class="['export', {
                'disabled': !isUserDataComplete
            }]" :disabled="!isUserDataComplete" @click="exportData">{{ $t('components.userForm.exportData') }}</button>
        </div>
    </form>
</template>

<script setup lang="ts">
import { Filesystem, Directory, Encoding } from '@capacitor/filesystem';
import { Share } from '@capacitor/share';
import { Capacitor } from '@capacitor/core';
import { dataStore, toastStore } from '@/store';

const { locale } = useI18n();
const { t } = useI18n();

const isUserDataComplete = computed(() => {
    const data = dataStore.userData;
    return (
        data.birthDate !== '' &&
        data.gender !== '' &&
        data.height !== '' &&
        data.weight !== ''
    );
});

const hasValidMessages = computed(() => {
    return dataStore.messages.some(msg =>
        msg.role !== 'assistant' || (
            msg.role === 'assistant' &&
            !msg.content.startsWith('⚠️')
        )
    );
});

async function submitData() {
    if (!validateForm()) return;

    try {
        dataStore.responseType = 'analyzing';
        dataStore.currentResponse = '';
        dataStore.userData.language = locale.value;
        const controller = new AbortController();
        const { signal } = controller;
        dataStore.controller = controller;

        const response = await fetch(`http://138.68.77.184:6969/api/${dataStore.userData.selectedModel.type}`, {
            method: 'POST',
            signal,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            body: (
                JSON.stringify({
                    ...dataStore.userData,
                    messages: dataStore.messages,
                    selectedModel: dataStore.userData.selectedModel.id
                })
            ),
        });

        if (!response.body) throw new Error(t('global.emptyResponse'));

        const reader = response.body.getReader();
        const decoder = new TextDecoder('utf-8');
        dataStore.currentResponse = '';

        while (true) {
            const { done, value } = await reader.read();
            if (done) {
                dataStore.responseType = null;

                if (dataStore.currentResponse.trim()) {
                    dataStore.messages.push({
                        role: 'assistant',
                        content: dataStore.currentResponse.trim()
                    });
                }
                dataStore.currentResponse = '';
                break;
            }

            dataStore.currentResponse += decoder.decode(value, { stream: true });
            dataStore.responseType = 'thinking';
        }
    } catch (error: any) {
        if (error.name !== 'AbortError') {
            let errorMessage = '';

            if (error.message.includes('fetch') || error.message.includes('NetworkError')) {
                errorMessage = `⚠️ ${t('global.networkError')}`;
            } else if (error.message === t('global.emptyResponse')) {
                errorMessage = `⚠️ ${t('global.emptyResponse')}`;
            } else {
                errorMessage = `⚠️ ${t('global.errorSend')}: ${error.message}\n\n${t('global.tryAgain')}`;
            }

            dataStore.messages.push({
                role: 'assistant',
                content: errorMessage
            });
        }

        dataStore.responseType = null;
        dataStore.currentResponse = '';
    }
}

function stopAnswering() {
    if (dataStore.controller) {
        dataStore.controller.abort();
        dataStore.responseType = null;

        if (dataStore.currentResponse && dataStore.currentResponse.trim()) {
            dataStore.messages.push({
                role: 'assistant',
                content: dataStore.currentResponse.trim()
            });
        }

        dataStore.currentResponse = '';
    }
}

async function exportData() {
    const data = JSON.stringify(dataStore.userData, null, 2);
    const fileName = 'user_data.json';

    if (Capacitor.isNativePlatform()) {
        try {
            if (!checkPermissions()) return;

            await Filesystem.writeFile({
                path: fileName,
                data,
                directory: Directory.Documents,
                encoding: Encoding.UTF8,
            });

            toastStore.show(`✅ ${t('global.successSave')}: ${fileName}`, 'success');

            await Filesystem.writeFile({
                path: fileName,
                data,
                directory: Directory.Cache,
                encoding: Encoding.UTF8,
            });

            const fileUri = await Filesystem.getUri({
                path: fileName,
                directory: Directory.Cache,
            });

            await Share.share({
                title: 'user_data.json',
                url: fileUri.uri
            });

            toastStore.show(`✅ ${t('global.successShare')}: ${fileName}`, 'success');
        } catch (err) {
            toastStore.show(`⚠️ ${t('global.errorSave')}\n\n${t('global.tryAgain')}\n${err}`, 'error');
        }
    } else {
        try {
            const blob = new Blob([data], { type: 'application/json' });
            const link = document.createElement('a');
            link.href = URL.createObjectURL(blob);
            link.download = fileName;
            link.click();
        } catch {
            toastStore.show(`⚠️ ${t('global.errorSave')}\n\n${t('global.tryAgain')}`, 'error');
        }
    }
}
import { useAutoSaveUserData } from '@/composables/useAutoSaveUserData';

const { start } = useAutoSaveUserData();

let stopAutosave: (() => void) | null = null;

onMounted(() => {
    const tokenCookie = useCookie('sanovise_token');
    if (tokenCookie.value) {
        dataStore.setLoggedIn(true);
        stopAutosave = start();
        return;
    }

    if (dataStore.isLoggedIn) {
        stopAutosave = start();
    }
});

watch(() => dataStore.isLoggedIn, (val) => {
    if (val) {
        if (!stopAutosave) stopAutosave = start();
    } else {
        if (stopAutosave) {
            stopAutosave();
            stopAutosave = null;
        }
    }
});

onBeforeUnmount(() => {
    if (stopAutosave) stopAutosave();
});

</script>

<style scoped lang="scss">
@use '@/assets/styles/components/userform.scss';
</style>
