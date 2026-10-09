import { provideZonelessChangeDetection } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { MoviesService } from '../../core/services/movies';
import { Movies } from './movies';

describe('Movies', () => {
  const calls: any[] = [];
  const api = { getMovies: (...args: any[]) => {
    calls.push(args);
    return of({ content: [], totalPages: 3, totalElements: 45, number: args[0] });
  }};
  beforeEach(() => { calls.length = 0; TestBed.configureTestingModule({ imports: [Movies], providers: [provideZonelessChangeDetection(), { provide: MoviesService, useValue: api }] }); });
  it('carrega a primeira página', () => {
    const component = TestBed.createComponent(Movies).componentInstance;
    component.ngOnInit();
    expect(calls[0][0]).toBe(0);
    expect(component.totalPages()).toBe(3);
  });
  it('aplica os filtros e volta à primeira página', () => {
    const component = TestBed.createComponent(Movies).componentInstance;
    component.page.set(2);
    component.year = 2018;
    component.winner = 'false';
    component.filter();
    expect(calls[0]).toEqual([0, 15, 2018, false]);
  });
  it('impede páginas inválidas', () => {
    const component = TestBed.createComponent(Movies).componentInstance;
    component.totalPages.set(3);
    component.goToPage(-1);
    expect(calls.length).toBe(0);
    component.goToPage(1);
    expect(calls[0][0]).toBe(1);
  });
});
