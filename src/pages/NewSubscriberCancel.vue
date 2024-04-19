<template>
  <q-page class="flex-center qpage bg-image">
    <!--STARTING Policy PAGE-->
    <q-card> Something went wrong. Please try again. </q-card>
  </q-page>
</template>

<script>
import { useRoute } from "vue-router";
import { useRouter } from "vue-router";
import { defineComponent, ref, onMounted, computed } from "vue";

export default defineComponent({
  name: "NewSubscriberCancel",
  components: {},
  setup() {
    const rules = ref(false);
    const tandc = ref(false);
    const privacy = ref(false);

    onMounted(() => {});

    const exampleFunction = async () => {};

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

.imageBtnBackground {
  background-color: #fefbee;
}

.bg-image {
  background-image: url(../../m4u_background.jpg);
  background-size: contain;
  background-repeat: repeat;
}
</style>
