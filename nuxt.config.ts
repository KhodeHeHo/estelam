// https://nuxt.com/docs/api/configuration/nuxt-config
import{fa}from'vuetify/locale'
export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },
  modules: ['vuetify-nuxt-module'],
  vuetify: {
    moduleOptions: {
      
    },
    vuetifyOptions: {
      locale:{
        locale:'fa',
        messages:{fa}
      }
    }
  }
})