// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
    compatibilityDate: '2024-04-03',
    devtools: { enabled: false },

    modules: [
        "@ant-design-vue/nuxt",
        '@pinia/nuxt'
    ],
    runtimeConfig: {
        public: {
            apiBase: process.env.API_BASE || 'http://15.235.131.24:8000'
        }
    },
})
