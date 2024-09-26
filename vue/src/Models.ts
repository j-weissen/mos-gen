export interface Category {
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

export interface FormInfos {
  studentInfos: StudentInfos;
  categories: Category[];
  comment: string | null;
}

export interface StudentInfos {
  name: string;
  dateOfBirth: string;
}
