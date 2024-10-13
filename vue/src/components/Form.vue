<script setup lang="ts">
import StudentInfoForm from "./StudentInfoForm.vue";
import ConfirmButton from "./ConfirmButton.vue";
import type { Category, FormInfos, StudentInfos } from "@/Models";
import { PocketBaseClient } from "@/PocketBaseClient";
import { onMounted, ref, type Ref } from "vue";
import { saveForm } from "@/formgen/Form";

const pb = PocketBaseClient.instance;
const data: Ref<Category[] | null> = ref(null);

const studentInfos: Ref<StudentInfos> = ref({ name: "", dateOfBirth: "" });
const selectedIds: Ref<string[]> = ref([]);
const comment: Ref<string> = ref("");
onMounted(async () => (data.value = await pb.fetchData()));

function filteredData(): Category[] | undefined {
  return data.value
    ?.map((category) => {
      const newCategory = Object.assign({}, category);
      newCategory.measures = newCategory.measures.filter((measure) =>
        selectedIds.value.includes(measure.id),
      );
      return newCategory;
    })
    .filter((category) => category.measures.length > 0);
}

function generateForm() {
  const formInfos: FormInfos = {
    categories: filteredData()!,
    comment: comment.value === "" ? null : comment.value,
    studentInfos: studentInfos.value,
  };
  console.log(formInfos);
  saveForm(formInfos);
  // TODO: generate form
}
</script>

<template>
  <div v-if="data">
    <StudentInfoForm v-model="studentInfos" />
    <div v-for="category in data">
      <p class="text-2xl font-bold">{{ category.name }}</p>
      <div v-for="measure in category.measures">
        <input
          type="checkbox"
          :value="measure.id"
          :id="measure.id"
          v-model="selectedIds"
          class="after:anchor-center relative h-3 w-3 appearance-none after:absolute after:left-1/2 after:top-1/2 after:h-2 after:w-2 after:bg-black after:opacity-0 after:checked:opacity-100 hover:bg-gray-200"
        />
        <label :for="measure.id" class="pl-1">{{ measure.name }}</label>
      </div>
    </div>
    <div class="pb-2">
      <p>Anmerkungen:</p>
      <textarea
        v-model="comment"
        class="text-s block h-36 w-full border border-black p-1"
      ></textarea>
    </div>
    <ConfirmButton @click="generateForm()"> Formular generieren </ConfirmButton>
  </div>
  <div v-else>Daten werden geladen...</div>
</template>
