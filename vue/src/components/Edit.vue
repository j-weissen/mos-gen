<script setup lang="ts">
import type { Category, Measure } from "@/Models";
import { PocketBaseClient, type Collection } from "@/PocketBaseClient";
import { computed, onMounted, ref, type Ref } from "vue";
import { useTranslatedCollection } from "@/composables/useTranslatedCollection";

const pb = PocketBaseClient.instance;
const data: Ref<Category[]> = ref([]);
onMounted(async () => (data.value = await pb.fetchData()));

const deletionDialog = ref<HTMLDialogElement>();
const thingToDelete: Ref<Category | Measure | null> = ref(null);
const collectionToDelete: Ref<Collection | null> = ref(null);
const translatedCollectionToDeleteName =
  useTranslatedCollection(collectionToDelete);

function showDeleteModal(thing: Category | Measure, collection: Collection) {
  thingToDelete.value = thing;
  collectionToDelete.value = collection;
  deletionDialog.value?.showModal();
}
async function confirmDelete() {
  if (!collectionToDelete.value || !thingToDelete.value)
    throw new Error("No collection or thing specified");
  await pb.delete(collectionToDelete.value, thingToDelete.value.id);
  resetDeletionDialog();
  location.reload();
}
async function cancelDelete() {
  resetDeletionDialog();
}
function resetDeletionDialog() {
  deletionDialog.value?.close();
  thingToDelete.value = null;
  collectionToDelete.value = null;
}

const creationDialog = ref<HTMLDialogElement>();
const collectionToCreate: Ref<Collection | null> = ref(null);
const translatedCollectionToCreateName =
  useTranslatedCollection(collectionToCreate);
const categoryIdToAddMeasureTo: Ref<string | null> = ref(null);
const creationModalInput = ref("");

function showCreationModal(collection: Collection, categoryId?: string) {
  collectionToCreate.value = collection;
  if (collection === "measures") {
    categoryIdToAddMeasureTo.value = categoryId ?? null;
  }
  creationDialog.value?.showModal();
}
async function confirmCreation() {
  if (creationModalInput.value === "")
    throw new Error("Can't create object with empty name");
  if (collectionToCreate.value === "categories") {
    await pb.createCategory(creationModalInput.value);
  } else if (collectionToCreate.value === "measures") {
    if (!categoryIdToAddMeasureTo.value)
      throw new Error("Can't create orphaned measure, no categoryId specified");
    await pb.createMeasure(
      creationModalInput.value,
      categoryIdToAddMeasureTo.value,
    );
  } else {
    throw new Error("Unsupported collection encountered during creation");
  }
  resetCreationDialog();
  location.reload();
}

function cancelCreation() {
  resetCreationDialog();
}

function resetCreationDialog() {
  creationDialog.value?.close();
  collectionToCreate.value = null;
  categoryIdToAddMeasureTo.value = null;
  creationModalInput.value = "";
}
</script>

<template>
  <div v-if="data">
    <div v-for="category in data">
      <div class="flex w-1/4 justify-between">
        <span
          @click="showDeleteModal(category, 'categories')"
          class="cursor-pointer text-xl font-bold hover:line-through"
          >{{ category.name }}</span
        >
      </div>
      <div v-for="measure in category.measures" class="flex justify-between">
        <li
          @click="showDeleteModal(measure, 'measures')"
          class="cursor-pointer hover:line-through"
        >
          {{ measure.name }}
        </li>
      </div>
      <p
        @click="showCreationModal('measures', category.id)"
        class="cursor-pointer text-sm text-gray-500 underline hover:text-gray-400"
      >
        + Neue Fördermaßnahme in der Kategorie {{ category.name }}
      </p>
    </div>
    <button
      @click="showCreationModal('categories')"
      class="cursor-pointer text-sm text-gray-500 underline hover:text-gray-400"
    >
      + Neue Kategorie
    </button>
  </div>
  <div v-else>Daten werden geladen...</div>
  <dialog ref="deletionDialog" class="w-1/3 p-2">
    <p>Wollen Sie die {{ translatedCollectionToDeleteName }}</p>
    <p class="font-bold">{{ thingToDelete?.name }}</p>
    <p>wirklich löschen?</p>
    <div class="flex justify-end gap-1">
      <button
        class="w-12 border border-black px-1 hover:bg-gray-200"
        @click="cancelDelete()"
      >
        Nein
      </button>
      <button
        class="w-12 border border-red-600 px-1 text-red-600 hover:bg-red-600 hover:text-white"
        @click="confirmDelete()"
      >
        Ja
      </button>
    </div>
  </dialog>
  <dialog ref="creationDialog" class="w-1/3 p-2">
    <p>Wollen Sie die {{ translatedCollectionToCreateName }}</p>
    <p class="font-bold">{{ creationModalInput }}&nbsp;</p>
    <p>wirklich erstellen?</p>
    <input type="text" v-model="creationModalInput" />
    <div class="flex justify-end gap-1">
      <button
        class="w-12 border border-black px-1 hover:bg-gray-200"
        @click="cancelCreation()"
      >
        Nein
      </button>
      <button
        class="w-12 border border-red-600 px-1 text-red-600 hover:bg-red-600 hover:text-white"
        @click="confirmCreation()"
      >
        Ja
      </button>
    </div>
  </dialog>
</template>
