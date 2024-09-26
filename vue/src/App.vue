<script setup lang="ts">
import { PocketBaseClient } from "./PocketBaseClient";
const pb = PocketBaseClient.instance;
</script>

<template>
  <div class="flex justify-between bg-red-600 p-2 text-white">
    <p class="text-2xl font-bold">Fördermaßnahmen-Formulare</p>
    <RouterLink v-if="!pb.isLoggedIn" to="/login">Login</RouterLink>
    <RouterLink v-else to="/" @click="pb.logout()">Logout</RouterLink>
  </div>
  <div class="p-2">
    <RouterView></RouterView>
  </div>
</template>
