<template>
  <q-page class="flex-center qpage bg-image">
    <!--STARTING SHARE GROUPS PAGE-->
    <q-card class="q-mt-md feed-card text-accent" flat>
      <div class="q-ml-lg">
        <p class="text-h5 text-info">
          SHARE GROUPS
          <q-icon
            name="mdi-information-outline"
            size="xs"
            @click="getInfo = true"
          ></q-icon>
        </p>

        <q-dialog v-model="getInfo">
          <q-card>
            <q-card-section>
              <div class="text-h6">Share Groups</div>
            </q-card-section>

            <q-card-section class="q-pt-none">
              <p class="text-h6">
                Create groups to use when creating memories and books. You can
                select just the people you want in each group. Share just the
                memories or books you want with the people who really care.
              </p>
            </q-card-section>

            <q-card-actions align="right">
              <q-btn flat label="OK" color="primary" v-close-popup />
            </q-card-actions>
          </q-card>
        </q-dialog>

        <p class="text-h5">{{ errMsg }}</p>
        <q-btn
          icon="mdi-account-multiple-plus-outline"
          @click="newGroup = !newGroup"
        ></q-btn>
      </div>
      <div class="text-center relative-center" id="list">
        <q-list bordered separator class="justify-center groupList">
          <div
            v-for="group in groups"
            :key="group.GroupID"
            class="text-center justify-center relative-center shareList"
          >
            <q-item-section class="relative-center text-center">
              <q-item
                class="text-center"
                clickable
                v-ripple
                v-if="
                  group.CircleName !== 'Everyone' &&
                  group.CircleName !== 'Journal'
                "
                @click="editGroupOpen(group.CircleID, group.CircleName)"
              >
                <q-item-label class="absolute-center">
                  <q-icon name="mdi-account-group"></q-icon>
                  {{ group.CircleName }}
                </q-item-label>
              </q-item>
            </q-item-section>
          </div>
        </q-list>
      </div>

      <!--Beginning of Add Group-->
      <q-dialog v-model="newGroup" persistent>
        <q-card style="min-width: 350px" class="text-info">
          <q-card-section>
            <div class="text-h6">New Group Name</div>
          </q-card-section>

          <q-card-section class="q-pt-none">
            <q-input
              dense
              v-model="newGroupName"
              autofocus
              @keyup.enter="prompt = false"
            />
          </q-card-section>

          <q-card-actions align="right" class="text-primary">
            <q-btn flat label="Cancel" v-close-popup />
            <q-btn flat label="Add group" @click="addGroup()" />
          </q-card-actions>
        </q-card>
      </q-dialog>
      <!--end of Add Group-->

      <!--Beginning of Edit Group-->
      <q-dialog v-model="editGroupDialog" persistent>
        <q-card style="min-width: 350px" class="text-info">
          <q-card-section>
            <q-card-section class="row items-center q-pb-none">
              <q-space />
              <q-btn icon="close" flat round dense v-close-popup />
            </q-card-section>
            <div class="text-h6">
              Edit {{ editGroupName }}
              <p class="text-h6 text-negative">{{ groupNameErrrMsg }}</p>
              <q-btn
                flat
                icon="mdi-delete"
                @click="confirmDelete = !confirmDelete"
                class="text-info"
              ></q-btn>
            </div>
          </q-card-section>

          <q-card-section class="q-pt-none">
            <q-input
              dense
              label="New Group Name"
              v-model="editGroupName"
              autofocus
              @keyup.enter="prompt = false"
            />
          </q-card-section>
          <q-card-actions align="right" class="text-primary">
            <q-btn flat label="Cancel" v-close-popup />
            <q-btn flat label="Save" @click="editGroup()" />
          </q-card-actions>
          <!--Begin list of everyone for choosing who is in the group-->
          <q-card-section>
            <p class="text-subtitle1 text-info">
              Select the people to include in this share group.
            </p>
            <q-scroll-area style="height: 10em">
              <q-list>
                <q-item v-for="person in everyoneList" :key="person.UserID">
                  <q-checkbox
                    dense
                    v-model="person.inorout"
                    color="accent"
                    @click="changeStatus(person.MemberID, person.inorout)"
                  />
                  {{ person.UserDisplayName }}
                </q-item>
              </q-list>
            </q-scroll-area>
          </q-card-section>
          <!--end list of everyone for choosing who is in the group-->
        </q-card>
        <!--Beginning of delete confirmation Dialog-->
        <q-dialog v-model="confirmDelete" persistent>
          <q-card>
            <q-card-section class="row items-center">
              <q-avatar
                icon="mdi-delete-alert-outline"
                color="negative"
                text-color="white"
              />
              <span class="q-ml-sm"
                >Are you sure you want to permenantly delete the group
                {{ editGroupName }}?</span
              >
            </q-card-section>

            <q-card-actions align="right">
              <q-btn flat label="Cancel" color="primary" v-close-popup />
              <q-btn
                flat
                label="Delete"
                color="primary"
                @click="deleteGroup()"
              />
            </q-card-actions>
          </q-card>
        </q-dialog>
        <!--end of delete confirmation Dialog-->
      </q-dialog>
      <!--end of Add Group-->
      <!--Beginning of Duplicate notification-->
      <q-dialog v-model="dupGroup">
        <q-card>
          <q-card-section>
            <div class="text-h6">Duplicate Group</div>
          </q-card-section>

          <q-card-section class="q-pt-none">
            This group name already exists. Please choose another name.
          </q-card-section>

          <q-card-actions align="right">
            <q-btn flat label="OK" color="primary" v-close-popup />
          </q-card-actions>
        </q-card>
      </q-dialog>
      <!--end of duplicate notification-->
    </q-card>
  </q-page>
</template>

<script>
import { defineComponent, reactive } from "vue";
import { useRoute } from "vue-router";
import { useRouter } from "vue-router";
import { ref, onMounted, computed } from "vue";
//import shareActions from "../actions/share"; //
import { useUserStore } from "stores/user";
import { storeToRefs } from "pinia";
import groupActions from "../actions/groups";

export default defineComponent({
  name: "SharePage",
  components: {},
  setup() {
    const userState = useUserStore();
    const user = reactive(userState.user);
    const { isLoggedIn, token, pageLength } = storeToRefs(userState);

    const confirmDelete = ref(false);
    const dupGroup = ref(false);
    const editGroupDialog = ref(false);
    const editGroupID = ref(null);
    const editGroupName = ref(null);
    const errMsg = ref(null);
    const everyoneList = ref(null);
    const getInfo = ref(false);
    const groups = ref(null);
    const groupNameErrrMsg = ref(null);
    const newGroup = ref(false);
    const newGroupName = ref(null);

    onMounted(() => {
      getGroups();
    });

    const getGroups = async () => {
      await groupActions.getGroups(userState.user.UserID).then((apiCircles) => {
        groups.value = apiCircles;
      });
    };

    const addGroup = async () => {
      newGroup.value = false;
      if (!newGroupName.value) {
        errMsg.value = "You must enter a group name.";
      }

      const found = groups.value.some((el) => {
        var listCircle = el.CircleName.trim();
        var newName = newGroupName.value.trim();
        if (listCircle.toLowerCase() === newName.toLowerCase()) {
          return true;
        } else {
          return false;
        }
      });
      if (found) {
        dupGroup.value = true;
        newGroupName.value = null;
        return;
      }

      await groupActions
        .addGroup(newGroupName.value)
        .then((newCircle) => {
          editGroupOpen(
            newCircle.recordset[0].CircleID,
            newCircle.recordset[0].CircleName
          );
        })
        .then((newGroup) => {})
        .then(() => {
          getGroups();
          newGroupName.value = null;
        });
    };

    const editGroup = async () => {
      if (editGroupName.value.length < 1) {
        groupNameErrrMsg.value = "You must enter a name for the group.";
        return;
      }
      await groupActions
        .editGroup(editGroupID.value, editGroupName.value)
        .then(() => {
          editGroupDialog.value = false;
          getGroups();
        });
    };

    const editGroupOpen = async (groupID, oldGroupName) => {
      editGroupDialog.value = true;
      editGroupName.value = oldGroupName;
      editGroupID.value = groupID;
      groupNameErrrMsg.value = null;
      getEveryoneList(groupID);
    };

    const deleteGroup = async () => {
      await groupActions
        .deleteGroup(editGroupID.value, userState.user.UserID)
        .then(() => {
          confirmDelete.value = false;
          editGroupDialog.value = false;
          getGroups();
        });
    };

    const getEveryoneList = async (groupID) => {
      await groupActions
        .getEveryonePickList(groupID, userState.user.UserID)
        .then((pickList) => {
          everyoneList.value = pickList;
        });
    };

    const changeStatus = async (memberID, inorout) => {
      if (inorout === true) {
        await groupActions.addCircleMember(
          memberID,
          editGroupID.value,
          userState.user.UserID
        );
      } else {
        await groupActions.deleteCircleMember(memberID, editGroupID.value);
      }
    };

    return {
      addGroup,
      changeStatus,
      confirmDelete,
      deleteGroup,
      dupGroup,
      getInfo,
      groupNameErrrMsg,
      groups,
      editGroup,
      editGroupDialog,
      editGroupID,
      editGroupName,
      editGroupOpen,
      errMsg,
      everyoneList,
      newGroup,
      newGroupName,
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
  background-image: url(../../m4u_background.jpg);
  background-size: contain;
  background-repeat: repeat;
}

.groupList {
  width: 100%;
  font-size: 1.25em;
  text-align: center;
}
</style>
