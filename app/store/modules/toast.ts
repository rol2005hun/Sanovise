import { defineStore } from 'pinia';

let idCounter = 0;
export const useToast = defineStore('toast', {
    state: () => ({
        toasts: [] as {
            id: number
            message: string
            type: 'success' | 'error' | 'info' | 'warning'
            duration: number
        }[]
    }),

    actions: {
        show(message: string, type: 'success' | 'error' | 'info' | 'warning' = 'info', duration = 3000) {
            const id = ++idCounter
            this.toasts.push({ id, message, type, duration })

            setTimeout(() => {
                this.toasts = this.toasts.filter(t => t.id !== id)
            }, duration)
        }
    }
});