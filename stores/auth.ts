import { defineStore } from 'pinia'
import { navigateTo } from '#app'

export const useAuthStore = defineStore('auth', {
    state: () => ({
        isAuthenticated: false,
        user: '',
        token: '',
        apiBaseUrl: useRuntimeConfig().public.apiBase, // Get the API URL from runtime config
    }),
    actions: {

        async login(username: string, password: string) {

            try {
                // Use the fetch API for making the POST request
                const response = await fetch(`${this.apiBaseUrl}/api/login`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        username,
                        password,
                    })
                });

                if (response.status === 302) {
                    console.warn('Redirect detected. Check your login logic.');
                    return;
                }

                // Check if the response is okay
                if (!response.ok) {
                    throw new Error('Invalid username or password');
                }

                const data = await response.json();
                const token = data.data.token;
                const user = data.data.user;


                // Save token and user to localStorage
                localStorage.setItem('token', token);
                localStorage.setItem('user', JSON.stringify(user));


                // Update the store state
                this.isAuthenticated = true;
                this.user = user;
                this.token = token;

                // Optionally, navigate to the home page or another page after login
                return navigateTo('/')

            } catch (error) {
                throw new Error('Invalid username or password');
            }
        },
        logout() {


            // Clear token and user from localStorage
            localStorage.removeItem('token');
            localStorage.removeItem('user');

            // Update the store state
            this.isAuthenticated = false;
            this.user = '';
            this.token = '';

        },
        loadUserFromLocalStorage() {
            const token = localStorage.getItem('token');
            const storedUser = localStorage.getItem('user');
            if (token && storedUser) {
                this.isAuthenticated = true;
                this.user = JSON.parse(storedUser);
                this.token = token;
            }

        }
    }
})
