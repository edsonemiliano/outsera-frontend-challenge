import { Component, inject, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Movie, MoviesService, ProducerIntervals, Studio, WinnerYear } from '../../core/services/movies';

@Component({ selector: 'app-dashboard', imports: [FormsModule], templateUrl: './dashboard.html', styleUrl: './dashboard.scss' })
export class Dashboard implements OnInit {
  private api = inject(MoviesService);
  years = signal<WinnerYear[]>([]);
  studios = signal<Studio[]>([]);
  intervals = signal<ProducerIntervals>({ min: [], max: [] });
  winners = signal<Movie[]>([]);
  year: number | null = null;
  searched = signal(false);
  yearsError = signal('');
  studiosError = signal('');
  intervalsError = signal('');
  searchError = signal('');

  ngOnInit() {
    this.api.getYears().subscribe({
      next: data => this.years.set(data.years),
      error: () => this.yearsError.set('Erro ao carregar os anos.')
    });
    this.api.getStudios().subscribe({
      next: data => this.studios.set([...data.studios].sort((a, b) => b.winCount - a.winCount).slice(0, 3)),
      error: () => this.studiosError.set('Erro ao carregar os estúdios.')
    });
    this.api.getIntervals().subscribe({
      next: data => this.intervals.set(data),
      error: () => this.intervalsError.set('Erro ao carregar os produtores.')
    });
  }

  search() {
    if (!this.year || this.year < 1900) {
      this.searchError.set('Informe um ano válido.');
      return;
    }
    this.searchError.set('');
    this.searched.set(true);
    this.winners.set([]);
    this.api.getWinnersByYear(this.year).subscribe({
      next: data => this.winners.set(data),
      error: () => this.searchError.set('Erro ao buscar vencedores.')
    });
  }
}
