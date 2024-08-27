export default defineNuxtRouteMiddleware((to, from) => {
    if (process.client) {
        const accessToken = localStorage.getItem('token'); // Use localStorage only on the client side

        // If the token does not exist and the user is not on login page, redirect to login
        if (!accessToken && to.path !== '/login') {
            return navigateTo('/login');
        }

        // If the user is already authenticated and tries to access the login page, redirect to home
        if (accessToken && to.path === '/login') {
            return navigateTo('/');
        }
    }
});
