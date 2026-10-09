import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

export interface Movie {
  id: number;
  year: number;
  title: string;
  studios: string[];
  producers: string[];
  winner: boolean;
}
export interface MoviePage { content: Movie[]; totalElements: number; totalPages: number; number: number; }
export interface WinnerYear { year: number; winnerCount: number; }
export interface Studio { name: string; winCount: number; }
export interface ProducerInterval { producer: string; interval: number; previousWin: number; followingWin: number; }
export interface ProducerIntervals { min: ProducerInterval[]; max: ProducerInterval[]; }

@Injectable({ providedIn: 'root' })
export class MoviesService {
  private http = inject(HttpClient);
  private url = 'https://challenge.outsera.tech/api/movies';

  getMovies(page = 0, size = 15, year?: number, winner?: boolean) {
    let params = new HttpParams().set('page', page).set('size', size);
    if (year !== undefined) params = params.set('year', year);
    if (winner !== undefined) params = params.set('winner', winner);
    return this.http.get<MoviePage>(this.url, { params });
  }

  getYears() {
    return this.http.get<{ years: WinnerYear[] }>(`${this.url}/yearsWithMultipleWinners`);
  }

  getStudios() {
    return this.http.get<{ studios: Studio[] }>(`${this.url}/studiosWithWinCount`);
  }

  getIntervals() {
    return this.http.get<ProducerIntervals>(`${this.url}/maxMinWinIntervalForProducers`);
  }

  getWinnersByYear(year: number) {
    return this.http.get<Movie[]>(`${this.url}/winnersByYear`, { params: { year } });
  }
}
