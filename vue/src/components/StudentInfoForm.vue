<script setup lang="ts">
import type { StudentInfos } from "@/Models";
const model = defineModel<StudentInfos>();
</script>

<template>
  <div class="w-1/3">
    <div class="flex justify-between">
      <label for="studentName">Name</label>
      <input id="studentName" type="text" v-model="model.name" />
    </div>
    <div class="flex justify-between">
      <label for="studentDob">Geburtsdatum</label>
      <input id="studentDob" type="text" v-model="model.dateOfBirth" />
    </div>
  </div>
</template>
