<template>
  <q-page class="flex-center qpage bg-image">
    <!--STARTING Success PAGE-->
    <div class="text-center text-h5 text-accent">
      Your registration was successful. Click
      <router-link to="/">Here</router-link> to log into your new account.
    </div>
  </q-page>
</template>

<script>
import { defineComponent, ref, onMounted } from "vue";

export default defineComponent({
  name: "SuccessPage",
  components: {},
  setup() {
    onMounted(() => {});

    return {};
  },
});
</script>
<style scoped>
.qc-card {
  width: 85%;
  margin-top: 10%;
  padding-top: 15%;
  margin-right: auto;
  margin-left: auto;
  margin-bottom: auto;
}

.qpage {
  width: 100%;
  padding-top: 10%;
}

.bg-image {
  background-image: url(../../m4u_background.jpg);
  background-size: contain;
  background-repeat: repeat;
}
</style>
