import './assets/css/main.min.css'
import 'vue-toastification/dist/index.css'

import { createApp } from 'vue'
import App from './App.vue'
import Toast, { POSITION } from 'vue-toastification'

const app = createApp(App)

app.use(Toast, {
  position: POSITION.TOP_RIGHT
})

app.mount('#app')
