import { provideZonelessChangeDetection } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { MoviesService } from '../../core/services/movies';
import { Dashboard } from './dashboard';

describe('Dashboard', () => {
  const api = {
    getYears: () => of({ years: [{ year: 1986, winnerCount: 2 }] }),
    getStudios: () => of({ studios: [{ name: 'A', winCount: 1 }, { name: 'B', winCount: 3 }, { name: 'C', winCount: 2 }, { name: 'D', winCount: 0 }] }),
    getIntervals: () => of({ min: [], max: [] }),
    getWinnersByYear: () => of([{ id: 1, year: 2018, title: 'Filme', studios: [], producers: [], winner: true }])
  };
  beforeEach(() => TestBed.configureTestingModule({ imports: [Dashboard], providers: [provideZonelessChangeDetection(), { provide: MoviesService, useValue: api }] }));
  it('carrega os painéis e limita os estúdios a três', () => {
    const component = TestBed.createComponent(Dashboard).componentInstance;
    component.ngOnInit();
    expect(component.years().length).toBe(1);
    expect(component.studios().map(s => s.name)).toEqual(['B', 'C', 'A']);
  });
  it('valida e busca os vencedores', () => {
    const component = TestBed.createComponent(Dashboard).componentInstance;
    component.search();
    expect(component.searchError()).toBeTruthy();
    component.year = 2018;
    component.search();
    expect(component.winners().length).toBe(1);
  });
});
