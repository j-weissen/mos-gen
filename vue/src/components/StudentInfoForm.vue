<script setup lang="ts">
import type { StudentInfos } from "@/Models";
import LabeledInput from "./LabeledInput.vue";
const model = defineModel<StudentInfos>();
</script>

<template>
  <div class="pb-4 pt-2">
    <p class="text-2xl font-bold">Daten</p>
    <LabeledInput displayName="NACHNAME Vorname" v-model="model.name" />
    <LabeledInput displayName="Geburtsdatum" v-model="model.dateOfBirth" />
    <LabeledInput
      displayName="Schule/Klasse/Stufe/Besuchsjahr"
      v-model="model.schoolClass"
    />
    <LabeledInput displayName="Betreuungslehrer/in" v-model="model.teacher" />
  </div>
</template>
