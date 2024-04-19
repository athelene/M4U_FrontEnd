<template>
  <q-page class="flex-center qpage bg-image">
    <!--STARTING Success PAGE-->
    <div class="text-center text-h5 text-accent">
      Your payment was successful. We sent you an email to verify your account.
      Please click on the link in that email to start saving your memories. YOu
      can close this window.
    </div>
  </q-page>
</template>

<script>
import { defineComponent, ref, onMounted } from "vue";

export default defineComponent({
  name: "SuccessPage",
  components: {},
  setup() {
    const rules = ref(false);
    const tandc = ref(false);
    const privacy = ref(false);

    onMounted(() => {});

    return {
      rules,
      tandc,
      privacy,
    };
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
