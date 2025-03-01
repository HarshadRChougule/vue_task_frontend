<template>
   <v-app>
    <Header />
    <v-main>
      <v-container fluid>
        <router-view></router-view>
      </v-container>
    </v-main>
    <Footer />
   </v-app>
</template>

<script>
import { defineComponent } from 'vue';
import Header from './components/Header.vue';
import Footer from './components/Footer.vue';


export default defineComponent({
  name :"App",
  components:{
    Header,
    Footer
  }
})
</script>
<style lang="scss">

</style>
