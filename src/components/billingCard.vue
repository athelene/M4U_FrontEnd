<template>
  <div class="text-center">
    {{ email }} {{ userID }}
    <q-card class="q-pa-md">
      <div>
        <q-input
          type="text"
          label="Name on your card"
          v-model="cardName"
        ></q-input>
      </div>
      <div>
        <q-input
          type="text"
          label="Address Line 1"
          v-model="address_line1"
        ></q-input>
      </div>
      <div>
        <q-input
          type="text"
          label="Address Line 2"
          v-model="address_line2"
        ></q-input>
      </div>
      <div>
        <q-input type="text" label="City" v-model="address_city"></q-input>
      </div>
      <div>
        <q-input type="text" label="State" v-model="address_state"></q-input>
      </div>
      <div>
        <q-input
          type="text"
          label="Postal Code"
          v-model="address_postal_code"
        ></q-input>
      </div>
      <div>
        *Note: Memories For Us is only available for US customers at this time.
      </div>
      <div>
        <q-input type="text" label="Card number" v-model="cardNumber"></q-input>
      </div>
      <div>
        <q-input
          type="text"
          label="Card Expiration Date"
          v-model="cardExp"
        ></q-input>
      </div>
      <div>
        <q-input type="text" label="CVC" v-model="cardCVC"></q-input>
      </div>

      <q-card-actions>
        <q-btn @click="submitPayment()">Submit</q-btn>
        <q-btn>Cancel</q-btn>
      </q-card-actions>
    </q-card>
  </div>
</template>

<script>
import { defineComponent, reactive } from "vue";
import { useRoute } from "vue-router";
import { ref, onMounted, computed } from "vue";
import { useRouter } from "vue-router";
import loginAction from "../actions/login";

export default defineComponent({
  name: "BillingCard",
  props: {
    email: {
      type: String,
    },
    userID: {
      type: Number,
    },
  },

  setup(props, { emit }) {
    onMounted(() => {
      if (props.userID) {
        console.log("UserID is: ", props.userID);
      }
    });

    const cardName = ref(null);
    const cardNumber = ref(null);
    const cardExp = ref(null);
    const cardCVC = ref(null);
    const address_line1 = ref(null);
    const address_line2 = ref(null);
    const address_city = ref(null);
    const address_state = ref(null);
    const address_postal_code = ref(null);
    const address_country = ref(null);
    const submitPayment = async () => {
      console.log("props is: ", props);
      await loginAction.createCustomer(
        props.email,
        cardName.value,
        address_line1.value,
        address_line2.value,
        address_city.value,
        address_state.value,
        address_postal_code.value,
        props.userID
      );
    };
    return {
      submitPayment,
      cardName,
      cardNumber,
      cardExp,
      cardCVC,
      address_line1,
      address_line2,
      address_city,
      address_state,
      address_postal_code,
      address_country,
    };
  },
});
</script>
<style scoped>
.imageBtn {
  background-color: #fefbee;
}

.inputWidth {
  width: "100%" !important;
}
</style>
