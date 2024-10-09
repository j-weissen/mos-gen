import PocketBase from "pocketbase";
import { ref, type Ref, type ComputedRef } from "vue";
import type { Category, Measure, User } from "./Models";
import { computed } from "@vue/reactivity";

type QueryCategory = Category & { expand: { measures: Measure[] } };
export type Collection = "categories" | "measures" | "users";

export class PocketBaseClient {
  // Singleton
  private static _instance: PocketBaseClient;
  public static get instance(): PocketBaseClient {
    if (!this._instance) {
      this._instance = new PocketBaseClient();
    }
    return this._instance;
  }

  private pb: PocketBase;
  private _data: Category[] | null;
  private _loggedIn: Ref<boolean>;
  public isLoggedIn: ComputedRef<boolean>;

  private static get PB_USER_RECORD_KEY(): string {
    return "pb_user_record";
  }

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

  public saveQuery(query: QueryCategory[]): Category[] {
    query.forEach(
      (category) => (category.measures = category.expand?.measures ?? []),
    );
    this._data = query;
    return this._data;
  }

  public async fetchData(): Promise<Category[]> {
    const query = await this.pb
      .collection("categories" as Collection)
      .getFullList<QueryCategory>({ expand: "measures" });
    return this.saveQuery(query);
  }

  public async login(user: string, password: string): Promise<User> {
    const userRecord = (
      await this.pb
        .collection("users" as Collection)
        .authWithPassword<User>(user, password)
    ).record;
    this.storedUserRecord = this.pb.authStore.exportToCookie();
    this._loggedIn.value = true;
    return userRecord;
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

  public async createMeasure(
    name: string,
    categoryId: string,
  ): Promise<Measure> {
    const measure = await this.pb
      .collection("measures" as Collection)
      .create<Measure>({ name });
    await this.pb
      .collection("categories" as Collection)
      .update<Category>(categoryId, { "measures+": measure.id });
    return measure;
  }
}
