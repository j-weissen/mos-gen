<script setup lang="ts">
import { PocketBaseClient } from "@/PocketBaseClient";
import router from "@/router";
import { ref } from "vue";

const pb = PocketBaseClient.instance;
if (pb.isLoggedIn) router.push("/");

const user = ref("");
const password = ref("");

async function login() {
  await pb.login(user.value, password.value);
  router.push("/edit");
}
</script>

<template>
  <label>Username oder E-Mail</label><br />
  <input type="text" v-model="user" /><br />
  <label>Passwort</label><br />
  <input type="password" v-model="password" /><br />
  <button @click="login()">Login</button>
</template>
