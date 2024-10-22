<script setup lang="ts">
import StudentInfoForm from "./StudentInfoForm.vue";
import ConfirmButton from "./ConfirmButton.vue";
import type {
  Category,
  FormInfos,
  StudentInfos,
  CommentedCategory,
  Subcategory,
} from "@/Models";
import { PocketBaseClient } from "@/PocketBaseClient";
import { onMounted, ref, type Ref } from "vue";
import { saveForm } from "@/formgen/Form";

const pb = PocketBaseClient.instance;
const data: Ref<CommentedCategory[] | null> = ref(null);

const studentInfos: Ref<StudentInfos> = ref({});
const selectedIds: Ref<string[]> = ref([]);
onMounted(async () => (data.value = await pb.fetchData()));

function filteredData(): CommentedCategory[] {
  return data
    .value!.map((category) => {
      const newCategory = Object.assign({}, category);
      newCategory.subcategories = newCategory.subcategories
        .map((subcategory) => {
          const newSubcategory: Subcategory = Object.assign({}, subcategory);
          newSubcategory.measures = newSubcategory.measures.filter((measure) =>
            selectedIds.value.includes(measure.id),
          );
          return newSubcategory;
        })
        .filter((subcategory) => subcategory.measures.length > 0);
      return newCategory;
    })
    .filter((category) => category.subcategories.length > 0);
}

function generateForm() {
  const formInfos: FormInfos = {
    categories: filteredData()!,
    studentInfos: studentInfos.value,
  };
  console.log(formInfos);
  saveForm(formInfos);
}
</script>

<template>
  <div v-if="data">
    <StudentInfoForm v-model="studentInfos" />
    <div v-for="category in data">
      <p class="text-2xl font-bold">{{ category.name }}</p>
      <div v-for="subcategory in category.subcategories">
        <p class="text-xl font-bold">{{ subcategory.name }}</p>
        <div v-for="measure in subcategory.measures">
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
        <p>
          Anmerkungen zur Kategorie <strong>{{ category.name }}:</strong>
        </p>
        <textarea
          v-model="category.comment"
          class="text-s block h-14 w-full border border-black px-0.5"
        ></textarea>
      </div>
    </div>
    <ConfirmButton @click="generateForm()"> Formular generieren </ConfirmButton>
  </div>
  <div v-else>Daten werden geladen...</div>
</template>
