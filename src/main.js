import { createApp } from 'vue'
import App from './App.vue'
import router from './router/routes'
import store from './store/store'
import '@/styles/global.css'
import 'bootstrap'
import 'bootstrap/dist/css/bootstrap.min.css'



createApp(App).use(store).use(router).mount('#app')