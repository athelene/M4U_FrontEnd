<template>
  <q-page class="flex-center qpage bg-image">
    <!--STARTING SHARE GROUPS PAGE-->
    <q-card class="q-mt-md feed-card text-accent" flat>
      <q-card-section class="q-ml-lg">
        <p class="text-h5 text-info">Credits</p>
      </q-card-section>
      <q-card-section class="relative-center" id="list">
        Memories For Us wouldn't have happened without the help and support of
        many people along the way. The following list includes some of those
        people.
      </q-card-section>

      <q-card-section class="text-center relative-center" id="list">
        <q-list>
          <q-item clickable v-ripple>
            <q-item-section>
              <q-item-label overline>JIM GOSNELL</q-item-label>
              <q-item-label
                >who never said it's time to give up, even when he could
                have.</q-item-label
              >
            </q-item-section>
          </q-item>
          <q-item>
            <q-item-section>
              <q-item-label overline>AUGUST GIESEMAN</q-item-label>
              <q-item-label
                >for technical support, vision, emotional support and incredible
                patience.</q-item-label
              >
            </q-item-section>
          </q-item>
          <q-item>
            <q-item-section>
              <q-item-label overline>HILLARY SHEPARD</q-item-label>
              <q-item-label
                >for her encouragement and expertise in showing us all how to
                create positive connections with friends and family
                online.</q-item-label
              >
            </q-item-section>
          </q-item>

          <q-item>
            <q-item-section>
              <q-item-label overline>joni newcomer</q-item-label>
              <q-item-label
                >for her help in making the app look bright and inviting, easier
                to read, creating content and testing.</q-item-label
              >
            </q-item-section>
          </q-item>

          <q-item>
            <q-item-section>
              <q-item-label overline>GAYLA KELLOGG AND CAROL HALL</q-item-label>
              <q-item-label
                >who encouraged me to keep trying to help families stay
                connected after leaving the senior care industry.</q-item-label
              >
            </q-item-section>
          </q-item>

          <q-item>
            <q-item-section>
              <q-item-label overline>ANNETTE SHEWMAKE</q-item-label>
              <q-item-label
                >for testing and useability suggestions.</q-item-label
              >
            </q-item-section>
          </q-item>

          <q-item>
            <q-item-section>
              <q-item-label overline>KATHY TISDALE</q-item-label>
              <q-item-label
                >for her help and enouragement in developing interview
                questions.</q-item-label
              >
            </q-item-section>
          </q-item>
          <q-item>
            <q-item-section>
              <q-item-label overline>LUKE DIEBOLD</q-item-label>
              <q-item-label
                >for his help learning Quasar through a series of amazing
                tutorials. But particularly for taking time out of his day for a
                stranger about to lose her mind.
              </q-item-label>
            </q-item-section>
          </q-item>
          <q-item>
            <q-item-section>
              <q-item-label overline
                >SHAUN PELLING AT THE NET NINJA</q-item-label
              >
              <q-item-label
                >for his help learning Vue 2 and Vue 3.</q-item-label
              >
            </q-item-section>
          </q-item>
          <q-item>
            <q-item-section>
              <q-item-label overline>KYLE AT WEBDEV SIMPLIFIED</q-item-label>
              <q-item-label>for his help learning javascript.</q-item-label>
            </q-item-section>
          </q-item>
          <q-item>
            <q-item-section>
              <q-item-label overline>KEVIN POWELL</q-item-label>
              <q-item-label>for his help learning CSS.</q-item-label>
            </q-item-section>
          </q-item>
          <q-item>
            <q-item-section>
              <q-item-label overline
                >DANNY CONNELL OF MAKE APPS WITH DANNY</q-item-label
              >
              <q-item-label>for his help using Quasar.</q-item-label>
            </q-item-section>
          </q-item>
          <q-item>
            <q-item-section>
              <q-item-label overline>GAURAV MANTRI</q-item-label>
              <q-item-label
                >for his help on StackOverflow related to Azure
                SQL.</q-item-label
              >
            </q-item-section>
          </q-item>
          <q-item>
            <q-item-section>
              <q-item-label overline>JOEL COCHRAN</q-item-label>
              <q-item-label
                >for his help on StackOverflow related to Azure.</q-item-label
              >
            </q-item-section>
          </q-item>
          <q-item>
            <q-item-section>
              <q-item-label overline
                >SO MANY OTHERS IN THE ONLINE DEV COMMUNITY</q-item-label
              >
              <q-item-label
                >The amount of sharing that is done in this community is
                amazing. There are thousands on StackOverflow, GitHub, YouTube,
                Medium and countless blogs. These folks contribute untold hours
                for the benefit of all developers. You all ROCK!
              </q-item-label>
            </q-item-section>
          </q-item>
        </q-list>
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
