export type BookStatus = "DOSTUPNO" | "POZAJMLJENO" | "REZERVISANO";

export interface Book {
  id: number;
  title: string;
  author: string;
  publishedYear: number | null;
  status: BookStatus;
  createdAt: string;
  updatedAt: string | null;
}

export interface BookRequest {
  title: string;
  author: string;
  publishedYear: number | null;
  status: BookStatus;
}
