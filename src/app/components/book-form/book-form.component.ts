import { Component, OnInit, inject } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormBuilder, ReactiveFormsModule, Validators } from "@angular/forms";
import { ActivatedRoute, Router, RouterLink } from "@angular/router";

import { BookService } from "../../services/book.service";
import { BookRequest, BookStatus } from "../../models/book.model";

@Component({
  selector: "app-book-form",
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: "./book-form.component.html",
  styleUrl: "./book-form.component.css",
})
export class BookFormComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly bookService = inject(BookService);

  form = this.fb.nonNullable.group({
    title: ["", [Validators.required, Validators.maxLength(255)]],
    author: ["", [Validators.required, Validators.maxLength(255)]],
    publishedYear: [
      null as number | null,
      [Validators.min(1000), Validators.max(2100)],
    ],
    status: ["DOSTUPNO" as BookStatus],
  });

  isEdit = false;
  bookId: number | null = null;
  saving = false;
  error = "";

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get("id");
    if (idParam) {
      this.isEdit = true;
      this.bookId = Number(idParam);
      this.bookService.getBook(this.bookId).subscribe({
        next: (book) => {
          this.form.patchValue({
            title: book.title,
            author: book.author,
            publishedYear: book.publishedYear,
            status: book.status,
          });
        },
        error: () => {
          this.error =
            "Knjiga nije pronađena. Vrati se na katalog i pokušaj ponovo.";
        },
      });
    }
  }

  invalid(controlName: string): boolean {
    const control = this.form.get(controlName);
    return !!control && control.invalid && (control.dirty || control.touched);
  }

  save(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const value = this.form.getRawValue();
    const request: BookRequest = {
      title: value.title.trim(),
      author: value.author.trim(),
      publishedYear: value.publishedYear,
      status: value.status,
    };

    this.saving = true;
    this.error = "";

    const operation =
      this.isEdit && this.bookId !== null
        ? this.bookService.updateBook(this.bookId, request)
        : this.bookService.createBook(request);

    operation.subscribe({
      next: () => this.router.navigate(["/"]),
      error: () => {
        this.saving = false;
        this.error =
          "Čuvanje nije uspelo. Proveri unete podatke i pokušaj ponovo.";
      },
    });
  }
}
