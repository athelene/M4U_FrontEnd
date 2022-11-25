<template>
  <q-page class="flex-center qpage bg-image">
    <!--STARTING Success PAGE-->
    <div class="text-center text-h5 text-accent">
      You have successfully signed up for Memories For Us!
      <div>
        <q-btn fullwidth to="/login" color="accent">Click here to log in</q-btn>
      </div>
    </div>
  </q-page>
</template>

<script>
import { useRoute } from "vue-router";
import { useRouter } from "vue-router";
import { defineComponent, ref, onMounted, computed } from "vue";

export default defineComponent({
  name: "SuccessPage",
  components: {},
  setup() {
    const rules = ref(false);
    const tandc = ref(false);
    const privacy = ref(false);

    onMounted(() => {
      console.log("new subscriber success started");
    });

    const exampleFunction = async () => {
      console.log("running exampleFunction");
    };

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
  background-image: url(/background.jpg);
  background-size: contain;
  background-repeat: repeat;
}
</style>
