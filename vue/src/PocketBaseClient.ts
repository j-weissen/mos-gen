import PocketBase from "pocketbase";
import type { Category, Measure, User } from "./Models";

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

  private constructor() {
    this.pb = new PocketBase(import.meta.env.VITE_POCKETBASE_URL);
    this._data = null;
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
    return (
      await this.pb
        .collection("users" as Collection)
        .authWithPassword<User>(user, password)
    ).record;
  }

  public logout(): void {
    this.pb.authStore.clear();
  }

  public get isLoggedIn(): boolean {
    return this.pb.authStore.isValid;
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
