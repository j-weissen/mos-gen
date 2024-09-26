import { computed, type ComputedRef, type Ref } from "vue";
import type { Collection } from "@/PocketBaseClient";

export function useTranslatedCollection(
  collection: Ref<Collection | null>,
): ComputedRef<string> {
  return computed(() => {
    if (!collection.value) return "";
    if (collection.value === "measures") {
      return "Fördermaßnahme";
    } else if (collection.value === "categories") {
      return "Kategorie";
    } else {
      throw new Error("Encountered unexpected collection");
    }
  });
}
