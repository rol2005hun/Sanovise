import { createPinia } from 'pinia';
import { useData } from '@/store/modules/data';
import { useToast } from '@/store/modules/toast';

export const pinia = createPinia();
export const dataStore = useData(pinia);
export const toastStore = useToast(pinia);