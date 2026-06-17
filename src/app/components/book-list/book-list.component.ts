import { Component, OnInit, inject } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterLink } from "@angular/router";

import { BookService } from "../../services/book.service";
import { Book, BookStatus } from "../../models/book.model";

const STATUS_LABELS: Record<BookStatus, string> = {
  DOSTUPNO: "Dostupna",
  POZAJMLJENO: "Pozajmljena",
  REZERVISANO: "Rezervisana",
};

@Component({
  selector: "app-book-list",
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: "./book-list.component.html",
  styleUrl: "./book-list.component.css",
})
export class BookListComponent implements OnInit {
  private readonly bookService = inject(BookService);

  books: Book[] = [];
  loading = true;
  error = "";

  ngOnInit(): void {
    this.loadBooks();
  }

  loadBooks(): void {
    this.loading = true;
    this.error = "";
    this.bookService.getBooks().subscribe({
      next: (books) => {
        this.books = books;
        this.loading = false;
      },
      error: () => {
        this.error =
          "Katalog trenutno nije dostupan. Proveri da li je API pokrenut, pa osveži stranicu.";
        this.loading = false;
      },
    });
  }

  statusLabel(status: BookStatus): string {
    return STATUS_LABELS[status];
  }

  deleteBook(book: Book): void {
    if (!confirm(`Obrisati "${book.title}" iz kataloga?`)) {
      return;
    }
    this.bookService.deleteBook(book.id).subscribe({
      next: () => {
        this.books = this.books.filter((b) => b.id !== book.id);
      },
      error: () => {
        this.error = `Brisanje knjige "${book.title}" nije uspelo. Pokušaj ponovo.`;
      },
    });
  }
}
