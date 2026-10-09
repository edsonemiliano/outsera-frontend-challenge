import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';
import { Movie, MoviesService } from '../../core/services/movies';

@Component({ selector: 'app-movies', imports: [FormsModule], templateUrl: './movies.html', styleUrl: './movies.scss' })
export class Movies implements OnInit {
  private api = inject(MoviesService);
  private request?: Subscription;
  movies = signal<Movie[]>([]);
  page = signal(0);
  totalPages = signal(0);
  totalElements = signal(0);
  loading = signal(false);
  error = signal('');
  pages = computed(() => {
    const total = this.totalPages();
    const start = Math.max(0, Math.min(this.page() - 2, total - 5));
    return Array.from({ length: Math.min(5, total) }, (_, i) => start + i);
  });
  size = 15;
  year: number | null = null;
  winner = '';

  ngOnInit() { this.load(); }

  load() {
    this.request?.unsubscribe();
    this.loading.set(true);
    this.error.set('');
    const year = this.year && this.year > 0 ? this.year : undefined;
    const winner = this.winner === '' ? undefined : this.winner === 'true';
    this.request = this.api.getMovies(this.page(), this.size, year, winner).subscribe({
      next: data => {
        this.movies.set(data.content);
        this.totalPages.set(data.totalPages);
        this.totalElements.set(data.totalElements);
        this.loading.set(false);
      },
      error: () => { this.error.set('Erro ao carregar os filmes.'); this.loading.set(false); }
    });
  }

  filter() { this.page.set(0); this.load(); }

  goToPage(page: number) {
    if (page < 0 || page >= this.totalPages() || page === this.page()) return;
    this.page.set(page);
    this.load();
  }
}
