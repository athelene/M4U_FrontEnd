<template>
  <q-page class="flex-center qpage bg-image">
    <!--STARTING SHARE GROUPS PAGE-->
    <q-card class="q-mt-md feed-card text-accent" flat>
      <q-card-section class="q-ml-lg">
        <p class="text-h5 text-info">CONTACT US</p>
      </q-card-section>
      <q-card-section class="text-center relative-center" id="list">
        Email us at
        <a
          href="mailto:info@memoriesforus.com?subject=Comment about Memories For Us"
          >Comments</a
        >
      </q-card-section>

      <q-card-section class="text-center relative-center" id="list">
        Report a problem at
        <a href="mailto:support@memoriesforus.com?subject=Problem Report"
          >Problem</a
        >
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script>
import { defineComponent, reactive } from "vue";
import { ref, onMounted, computed } from "vue";
import { useUserStore } from "stores/user";
import { storeToRefs } from "pinia";

export default defineComponent({
  name: "ContactPage",
  components: {},
  setup() {
    const userState = useUserStore();
    const user = reactive(userState.user);
    const { isLoggedIn, token, pageLength } = storeToRefs(userState);

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

.feed-card {
  width: 75%;
  margin: auto;
}

.qpage {
  width: 100%;
  padding-top: 10%;
}

.imageBtnBackground {
  background-color: #fefbee;
}

.bg-image {
  background-image: url(../../public/m4u_background.jpg);
  background-size: contain;
  background-repeat: repeat;
}

.groupList {
  width: 100%;
  font-size: 1.25em;
  text-align: center;
}
</style>
