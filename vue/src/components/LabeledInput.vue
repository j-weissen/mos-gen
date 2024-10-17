<script setup lang="ts">
const model = defineModel<string>();
const props = defineProps<{ displayName: string; password?: boolean }>();
</script>

<template>
  <label :for="props.displayName" class="text-xs text-gray-500">{{
    displayName
  }}</label
  ><br />
  <input
    class="w-full px-0.5"
    :id="displayName"
    :type="props.password ? 'password' : 'text'"
    v-model="model"
  />
</template>
