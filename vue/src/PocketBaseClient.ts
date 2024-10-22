import PocketBase, { type CollectionModel } from "pocketbase";
import { ref, type Ref, type ComputedRef } from "vue";
import type { Category, Subcategory, Measure, User } from "./Models";
import { computed } from "@vue/reactivity";

type QueryCategory = Category &
  CollectionModel & {
    expand: { subcategories: QuerySubcategory[] };
  };
type QuerySubcategory = Subcategory &
  CollectionModel & { expand: { measures: Measure[] } };

export type Collection = "categories" | "subcategories" | "measures" | "users";

export class PocketBaseClient {
  // Singleton
  private static _instance: PocketBaseClient;
  public static get instance(): PocketBaseClient {
    if (!this._instance) {
      this._instance = new PocketBaseClient();
    }
    return this._instance;
  }

  // members
  private pb: PocketBase;
  private _data: Category[] | null;
  private _loggedIn: Ref<boolean>;
  public isLoggedIn: ComputedRef<boolean>;

  // constants
  private static get PB_USER_RECORD_KEY(): string {
    return "pb_user_record";
  }

  // utils
  private get storedUserRecord(): string | null {
    return localStorage.getItem(PocketBaseClient.PB_USER_RECORD_KEY);
  }

  private set storedUserRecord(value: string | null) {
    if (!value) {
      localStorage.removeItem(PocketBaseClient.PB_USER_RECORD_KEY);
    } else {
      localStorage.setItem(PocketBaseClient.PB_USER_RECORD_KEY, value);
    }
  }

  private constructor() {
    this.pb = new PocketBase(import.meta.env.VITE_POCKETBASE_URL);
    this._data = null;
    if (this.storedUserRecord) {
      this.pb.authStore.loadFromCookie(this.storedUserRecord);
      if (!this.pb.authStore.isValid) {
        this.pb.authStore.clear();
        this.storedUserRecord = null;
        this._loggedIn = ref(false);
      } else {
        this._loggedIn = ref(true);
      }
    } else {
      this._loggedIn = ref(false);
    }
    this.isLoggedIn = computed(() => this._loggedIn.value);
  }

  public transformQuery(item: CollectionModel) {
    return Object.assign(item, item.expand);
  }

  public saveQuery(query: QueryCategory[]): Category[] {
    query.forEach((category) => {
      if (!category.expand) {
        category.subcategories = [];
        return;
      }
      category.expand.subcategories.forEach((subcategory) =>
        this.transformQuery(subcategory),
      );
      this.transformQuery(category);
    });
    this._data = query;
    return this._data;
  }

  public async fetchData(): Promise<Category[]> {
    const query = await this.pb
      .collection("categories" as Collection)
      .getFullList<QueryCategory>({
        expand: "subcategories,subcategories.measures",
      });
    return this.saveQuery(query);
  }

  public async login(user: string, password: string): Promise<boolean> {
    return new Promise<boolean>(async (resolve) => {
      this.pb
        .collection("users" as Collection)
        .authWithPassword<User>(user, password)
        .then(() => {
          this.storedUserRecord = this.pb.authStore.exportToCookie();
          this._loggedIn.value = true;
          resolve(true);
        })
        .catch(() => {
          resolve(false);
        });
    });
  }

  public logout(): void {
    this.pb.authStore.clear();
    this.storedUserRecord = null;
    this._loggedIn.value = false;
  }

  public async delete(collection: Collection, id: string) {
    this.pb.collection(collection).delete(id);
  }

  public async createCategory(name: string): Promise<Category> {
    return await this.pb
      .collection("categories" as Collection)
      .create<Category>({ name });
  }

  public async createSubcategory(
    name: string,
    categoryId: string,
  ): Promise<Subcategory> {
    const subcategory = await this.pb
      .collection("subcategories" as Collection)
      .create<Subcategory>({ name });
    await this.pb
      .collection("categories" as Collection)
      .update<Category>(categoryId, { "subcategories+": subcategory.id });
    return subcategory;
  }

  public async createMeasure(
    name: string,
    subcategoryId: string,
  ): Promise<Measure> {
    const measure = await this.pb
      .collection("measures" as Collection)
      .create<Measure>({ name });
    await this.pb
      .collection("subcategories" as Collection)
      .update<Subcategory>(subcategoryId, { "measures+": measure.id });
    return measure;
  }
}
