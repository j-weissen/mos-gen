export interface Category {
  id: string;
  name: string;
  subcategories: Subcategory[];
}

export interface Subcategory {
  id: string;
  name: string;
  measures: Measure[];
}

export interface Measure {
  id: string;
  name: string;
}

export interface User {
  id: string;
  username: string;
}

export type CommentedCategory = Category & { comment?: string };

export interface FormInfos {
  studentInfos: StudentInfos;
  categories: CommentedCategory[];
}

export interface StudentInfos {
  name?: string;
  dateOfBirth?: string;
}
