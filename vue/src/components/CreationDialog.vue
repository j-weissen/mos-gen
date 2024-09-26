<script setup lang="ts">
import { useTranslatedCollection } from "../composables/useTranslatedCollection.ts";
const props = defineProps<{
  collection: Collection | null;
  thing: string | null;
}>();

const creationDialog = ref<HTMLDialogElement>();
const translatedCollection = useTranslatedCollection(props.collection);
</script>

<template>
  <dialog ref="creationDialog">
    <p>Neue {{ translatedCollection }} "{{ props.thing ?? "" }}" erstellen?</p>
    <input type="text" v-model="creationModalInput" />
    <button @click="cancelCreation()">Abbrechen</button>
    <button @click="confirmCreation()">Bestätigen</button>
  </dialog>
</template>
