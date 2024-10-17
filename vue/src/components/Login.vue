<script setup lang="ts">
import { PocketBaseClient } from "@/PocketBaseClient";
import router from "@/router";
import { ref } from "vue";
import LabeledInput from "./LabeledInput.vue";
import ConfirmButton from "./ConfirmButton.vue";

const pb = PocketBaseClient.instance;
if (pb.isLoggedIn.value) router.push("/");

const user = ref("");
const password = ref("");
const failed = ref(false);

async function login() {
  if (await pb.login(user.value, password.value)) {
    router.push("/edit");
    return;
  }
  failed.value = true;
  setTimeout(() => (failed.value = false), 3 * 1000);
}
</script>

<template>
  <div class="pb-4">
    <LabeledInput displayName="Username" v-model="user" />
    <LabeledInput displayName="Passwort" v-model="password" password />
  </div>
  <div class="flex">
    <ConfirmButton @click="login()">Login</ConfirmButton>
    <p v-if="failed" class="text-s pt-2 text-red-600">&otimes; Login failed!</p>
  </div>
</template>
