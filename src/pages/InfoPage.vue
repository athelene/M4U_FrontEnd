<template>
  <!--STARTING Policy PAGE-->
  <q-card qc-card>
    <q-card-section class="text-h4 text-accent">
      Memories For Us
    </q-card-section>
    <q-card-section class="text-center">
      <q-btn
        fab
        size="xl"
        label="Get Started"
        color="accent"
        to="login/?page=registration"
        style="z-index: 3"
      ></q-btn>
    </q-card-section>
    <q-separator />
    <q-card-section class="text-subitle2">
      <q-parallax src="../../public/m4u_background.jpg" :height="200" />
      <q-card-section>
        <div class="text-h6">
          Save, organize and share memories across time and generations
        </div>
      </q-card-section>
    </q-card-section>
    <q-card-section>
      <q-card-section class="text-h4"> Features </q-card-section>
      <q-card-section class="text-h6">
        <q-list bordered separator class="rounded-borders">
          <q-expansion-item
            expand-separator
            label="Capture memories from the past"
          >
            <div class="q-pa-lg text-body1">
              Use the Interview feature to ask older family members questions
              about their past. If you don't know where to start, try our
              interview quesetions to get the conversation going. Save their
              answers in a video to capture their face and voice. Always
              remember how they told the story!
            </div>
          </q-expansion-item>
          <q-expansion-item
            expand-separator
            label="Capture memories you make today"
          >
            <div class="q-pa-lg text-body1">
              Use Memories For Us instead of social media to capture pictures,
              videos and notes about the memories you are creating today. We
              help you to save them in a way you can find them in the future. We
              make it easy to share and browse them later.
            </div>
          </q-expansion-item>
          <q-expansion-item expand-separator label="Create a time capsule">
            <div class="q-pa-lg text-body1">
              Fill up a time capsule with notes and selfie videos to share with
              grandchildren later. Save a year’s worth of memories to share with
              family each New Year’s Eve. There are so many ways to bring
              memories forward so they aren’t lost.
            </div>
          </q-expansion-item>
          <q-expansion-item expand-separator label="Save family recipes">
            <div class="q-pa-lg text-body1">
              Our family recipes are just another type of memories that we love
              to share. Save them along with your other memories. Take a picture
              of those handwritten recipes before they fade away.
            </div>
          </q-expansion-item>
          <q-expansion-item expand-separator label="Keep journals">
            <div class="q-pa-lg text-body1">
              You can keep a traditional journal/diary, an exercise journal,
              vacation journals, a gratitude journal or any other type of
              journal you might enjoy. Only you will ever see the memories in
              your journal.
            </div>
          </q-expansion-item>
          <q-expansion-item expand-separator label="Record family traditions">
            <div class="q-pa-lg text-body1">
              Every family has traditions. Save and share yours to keep the
              spirit going across generations.
            </div>
          </q-expansion-item>
          <q-expansion-item
            expand-separator
            label="Easily find and browse through your memories"
          >
            <div class="q-pa-lg text-body1">
              We make it easy to go back and find all your memories. You can
              save a memory in one or more books. For example, keep a book for
              the grandchildrens' memories, keep another book for your 2023
              Thanksgiving gathering, or keep a book of journal memories. Create
              as many books as you like.
            </div>
          </q-expansion-item>
          <q-expansion-item expand-separator label="Bulk Importing">
            <div class="q-pa-lg text-body1">
              Import batches of photos to save in a book so you can share and
              browse them. A great way to make your digital photos more
              accessible and easy to enjoy.
            </div>
          </q-expansion-item>
          <q-expansion-item
            expand-separator
            label="Easily share with specific groups"
          >
            <div class="q-pa-lg text-body1">
              Create Share Groups from the people you are connected with. For
              example, you might create a group just for immediate family, or
              for neighbors, or for your bridge playing friends. When you create
              a memory, you can pick which group will be able to see it. And you
              don’t have to worry about it being shared outside the group. Only
              the creator can share a memory.
            </div>
          </q-expansion-item>
          <q-expansion-item
            expand-separator
            label="Check in with your connections each day in just seconds"
          >
            <div class="q-pa-lg text-body1">
              Each day you can answer a Quick Connect question. The questions
              are fun and only take a few seconds to answer. It’s a fun way to
              stay in touch in our busy world. And you'll learn more about your
              friends and family.
            </div>
          </q-expansion-item>
          <q-expansion-item
            expand-separator
            label="No advertising - You will never become our product"
          >
            <div class="q-pa-lg text-body1">
              We only offer a paid app because we do not want to depend on
              advertising. We want to sell the Memories For Us services to
              everyday people who want to stay connected with the people they
              love. We are not in the business of selling our members to
              advertisers. You won’t be bothered by ads or propaganda.
            </div>
          </q-expansion-item>
        </q-list>
      </q-card-section>
      <q-card-section>
        <q-card-section class="text-h4"> Pricing </q-card-section>
        <q-card-section class="text-body1"
          >The monthly rate is just $3.99 per month after the first month. In
          return, these members get full access to all of the features of
          Memories For Us. Plus, you won't see ads and we won't sell your
          information to anyone. You can connect with your loved ones without
          concern for your privacy or being exposed to
          propaganda.</q-card-section
        >
      </q-card-section>
    </q-card-section>
    <q-card-section class="text-center">
      <q-btn
        fab
        size="xl"
        label="Get Started"
        color="accent"
        to="login/?page=registration"
        style="z-index: 3"
      ></q-btn>
    </q-card-section>
  </q-card>
</template>

<script>
import { useRoute } from "vue-router";
import { useRouter } from "vue-router";
import { defineComponent, ref, onMounted, computed } from "vue";

export default defineComponent({
  name: "InfoPage",
  components: {},
  setup() {
    const rules = ref(false);
    const tandc = ref(false);
    const privacy = ref(false);

    onMounted(() => {});

    return {};
  },
});
</script>
<style scoped>
.q-card {
  width: 85%;
  margin-top: 5%;
  margin-right: auto;
  margin-left: auto;
  margin-bottom: auto;
}

.qpage {
  width: 100%;
  padding-top: 10%;
}

.feed-card {
  width: 75%;
  margin: auto;
}

.bg-image {
  background-image: url(../../public/m4u_background.jpg);
  background-size: contain;
  background-repeat: repeat;
}
</style>
