<script setup lang="ts">
import { PocketBaseClient } from "./PocketBaseClient";
import router from "./router";
const pb = PocketBaseClient.instance;
function currentUri() {
  return window.location.pathname;
}
</script>

<template>
  <div class="flex justify-between bg-red-600 p-2 py-4 text-white">
    <div class="flex items-center">
      <p
        class="cursor-pointer text-3xl font-bold hover:underline"
        @click="router.push('/form')"
      >
        Fördermaßnahmen-Formulare
      </p>
    </div>
    <div class="flex items-center">
      <div
        v-if="pb.isLoggedIn.value"
        class="mr-2 cursor-pointer border border-white px-2 hover:bg-white hover:text-red-600"
      >
        <RouterLink v-if="pb.isLoggedIn.value" to="/edit">Editieren</RouterLink>
      </div>
      <div
        class="cursor-pointer border border-white px-2 hover:bg-white hover:text-red-600"
      >
        <RouterLink v-if="!pb.isLoggedIn.value" to="/login">Login</RouterLink>
        <RouterLink v-else to="/" @click="pb.logout()">Logout</RouterLink>
      </div>
    </div>
  </div>
  <div class="flex justify-center p-2">
    <div class="flex-1" />
    <div class="flex-[10]">
      <RouterView></RouterView>
    </div>
    <div class="flex-1" />
  </div>
</template>
