import { defineStore } from 'pinia'
import axios from 'axios'
import { useNuxtApp, navigateTo } from '#app'

export const useAuthStore = defineStore('auth', {
    state: () => ({
        isAuthenticated: false,
        user: '',
        token: '',
        apiBaseUrl: useRuntimeConfig().public.apiBase, // Get the API URL from runtime config
    }),
    actions: {
        async login(username: string, password: string) {
            const { $isClient } = useNuxtApp()
            try {
                const response = await axios.post(`${this.apiBaseUrl}/api/login`, {
                    username,
                    password,
                })

                const access_token = response.data.data.access_token
                const user_info = response.data.data.user

                if ($isClient) {
                    // Save token and user to localStorage
                    localStorage.setItem('token', access_token)
                    localStorage.setItem('user', JSON.stringify(user_info))
                }

                // Update the store state
                this.isAuthenticated = true
                this.user = user_info
                this.token = access_token

                return navigateTo('/')

            } catch (error) {
                throw new Error('Invalid username or password')
            }
        },
        logout() {
            const { $isClient } = useNuxtApp()
            if ($isClient) {
                // Clear token and user from localStorage
                localStorage.removeItem('token')
                localStorage.removeItem('user')

            }
            // Update the store state
            this.isAuthenticated = false
            this.user = ''
            this.token = ''

        },
        loadUserFromLocalStorage() {
            const { $isClient } = useNuxtApp()
            // Ensure localStorage is only accessed in the client
            if ($isClient) {
                const token = localStorage.getItem('token')
                const storedUser = localStorage.getItem('user')
                if (token && storedUser) {
                    this.isAuthenticated = true
                    this.user = JSON.parse(storedUser)
                    this.token = token
                }
            }
        }
    }
})
