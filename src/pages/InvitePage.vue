<template>
  <q-page class="flex-center qpage bg-image text-accent">
    <q-pull-to-refresh @refresh="refresh">
      <!--STARTING SHARE GROUPS PAGE-->

      <q-card class="q-mt-md feed-card text-accent" flat>
        <q-card-section>
          <div>
            <span class="text-h6">Send an Invitation to Memories For Us</span>
          </div>
          <div v-if="freeInvitations > 0">
            <span class="text-h6"
              >You have {{ freeInvitations }} lifetime free invitations left to
              share.</span
            >
          </div>
        </q-card-section>
        <q-card-section>
          <span class="text-weight-bold">{{ message }}</span>
        </q-card-section>
        <q-card-section>
          <q-item>
            <q-input
              v-model="email"
              type="text"
              label="Email address"
              class="inputWidth"
            ></q-input>
          </q-item>
          <q-item>
            <q-input
              v-model="invitee"
              type="text"
              label="Name"
              class="inputWidth"
            ></q-input>
          </q-item>
          <q-item>
            <q-btn icon="mdi-send" @click="sendInvitation()"></q-btn>
          </q-item>
        </q-card-section>
      </q-card>
    </q-pull-to-refresh>
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
  name: "SharePage",
  components: {},
  setup() {
    const userState = useUserStore();
    const user = reactive(userState.user);
    const { isLoggedIn, token, pageLength } = storeToRefs(userState);
    const message = ref("");
    const invitee = ref("");
    const email = ref("");
    const tcDate = ref("");
    const tcMonth = ref(0);
    const tcDay = ref(0);
    const tcYear = ref(0);
    const freeInvitations = ref(0);

    onMounted(() => {
      setUpDate();
      getFreeInvitations();
    });

    const sendInvitation = async () => {
      message.value = "";
      await inviteActions
        .sendInvitation(
          user.UserID,
          invitee.value,
          email.value,
          tcDate.value,
          user.UserDisplayName,
          user.UserSubType
        )
        .then((invitationreturn) => {
          if (invitationreturn === "Duplicate") {
            message.value = "You have already invited this person.";
          } else if (invitationreturn === "Member") {
            message.value =
              "This person is already a member. You can invite them to your Share Groups.";
          } else {
            message.value =
              "Your invitation to " + invitee.value + " has been sent.";
            invitee.value = "";
            email.value = "";
          }
        })
        .then((sendInvitationReturn) => {
          getFreeInvitations();
        });
    };

    const getFreeInvitations = async () => {
      await inviteActions
        .getFreeInvitations(user.UserID, user.UserSubType)
        .then((freereturn) => {
          freeInvitations.value = freereturn;
        });
    };

    const setUpDate = async () => {
      var dateObj = new Date();
      tcMonth.value = dateObj.getUTCMonth() + 1; //months from 1-12
      if (tcMonth.value < 10) {
        tcMonth.value = "0" + tcMonth.value;
      }
      tcDay.value = dateObj.getUTCDate();
      if (tcDay.value < 10) {
        tcDay.value = "0" + tcDay.value;
      }
      tcYear.value = dateObj.getUTCFullYear();
      tcDate.value = tcYear.value + "-" + tcMonth.value + "-" + tcDay.value;
    };

    const refresh = (done) => {};

    return {
      refresh,
      invitee,
      email,
      tcDate,
      tcMonth,
      tcDay,
      tcYear,
      getFreeInvitations,
      sendInvitation,
      message,
      freeInvitations,
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

.feed-card {
  width: 75%;
  margin: auto;
}

.inputWidth {
  width: 90%;
}
</style>
