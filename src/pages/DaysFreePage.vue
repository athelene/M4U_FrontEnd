<template>
  <q-page class="flex-center qpage bg-image text-accent">
    <!--STARTING SHARE GROUPS PAGE-->
    <div
      class="text-center text-h4 text-info flex-center cardTitle text-weight-bolder"
    >
      Get 30 Days Free!
    </div>
    <div class="text-center text-h6 flex-center">
      <div class="col cardSection rounded-borders q-mb-md text-center">
        <div>
          <q-avatar icon="mdi-send" class="text-info"></q-avatar>
          <q-btn color="accent" @click="goToInvitePage()"
            >Click here to send a friend an invitation to join Memories for Us.
            When they sign up, you will receive 30 days free!</q-btn
          >
        </div>
      </div>
      <div class="col cardSection rounded-borders q-mb-md">
        <div>
          <q-avatar icon="mdi-connection" class="text-info"></q-avatar>
          <q-btn color="accent" @click="goToQCPage()"
            >Click here to submit a question we can use for the Quick Connect
            feature.</q-btn
          >
        </div>
      </div>
      <div class="col cardEnd rounded-borders">
        <div>
          <q-avatar
            icon="mdi-head-question-outline"
            class="text-info"
          ></q-avatar>
          <q-btn color="accent" @click="goToInterviewPage()"
            >Click here to submit a question we can use for the Interview
            feature.</q-btn
          >
        </div>
      </div>
    </div>
    <q-dialog v-model="note">
      <q-card>
        <q-card-section>
          <div class="text-h6">Promotion Details</div>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="OK" color="primary" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script>
import { defineComponent, reactive } from "vue";
import { useRoute } from "vue-router";
import { useRouter } from "vue-router";
import { ref, onMounted, computed } from "vue";
import inviteActions from "../actions/invite"; //
import { useUserStore } from "stores/user";
import { storeToRefs } from "pinia";

export default defineComponent({
  name: "DaysFreePage",
  components: {},
  setup() {
    const userState = useUserStore();
    const user = reactive(userState.user);
    const { isLoggedIn, token, pageLength } = storeToRefs(userState);
    const router = useRouter();
    const note = ref(false);

    onMounted(() => {});

    const goToQCPage = () => {
      router.push("/suggestqc");
    };

    const goToInterviewPage = () => {
      router.push("/suggestinterview");
    };

    const goToInvitePage = () => {
      router.push("/invite");
    };

    return {
      note,
      goToInterviewPage,
      goToInvitePage,
      goToQCPage,
    };
  },
});
</script>
<style scoped>
.qc-card {
  width: 30%;
  padding-top: 15%;
  margin-right: auto;
  margin-left: auto;
  margin-bottom: auto;
  display: flex;
}

.cardSection {
  width: 80% !important;
  background-color: #bbb7a9;
  margin-right: auto;
  margin-left: auto;
  margin-bottom: 1.5em;
}

.cardEnd {
  width: 80% !important;
  background-color: #bbb7a9;
  margin-right: auto;
  margin-left: auto;
}
.cardTitle {
  width: 80% !important;
  margin-right: auto;
  margin-left: auto;
  margin-bottom: 1.5em;
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

.inputWidth {
  width: 90%;
}
</style>
