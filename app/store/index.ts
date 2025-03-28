import { createPinia } from 'pinia';
import { useData } from '@/store/modules/data';

export const pinia = createPinia();
export const dataStore = useData(pinia);