import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { createVuetify } from 'vuetify'
import 'vuetify/styles'
import store from './store'
// import vuetify from './plugins/vuetify'
import { loadFonts } from './plugins/webfontloader'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'


loadFonts()

const vuetify = createVuetify({
  components,
  directives,
})

createApp(App).use(router)
  .use(router)
  .use(store)
  .use(vuetify)
  .mount('#app')
