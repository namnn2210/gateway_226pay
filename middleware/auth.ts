// middleware/auth.ts
import { useAuthStore } from '@/stores/auth'

export default defineNuxtRouteMiddleware(() => {
    const authStore = useAuthStore()

    authStore.loadUserFromLocalStorage()

    if (!authStore.isAuthenticated) {
        return navigateTo('/login')
    }
})
