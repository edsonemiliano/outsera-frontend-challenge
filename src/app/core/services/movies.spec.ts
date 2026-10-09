import { provideZonelessChangeDetection } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { MoviesService } from './movies';

describe('MoviesService', () => {
  let service: MoviesService;
  let http: HttpTestingController;
  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [provideZonelessChangeDetection(), provideHttpClient(), provideHttpClientTesting()] });
    service = TestBed.inject(MoviesService);
    http = TestBed.inject(HttpTestingController);
  });
  afterEach(() => http.verify());

  it('envia filtros e paginação', () => {
    service.getMovies(2, 15, 2018, false).subscribe();
    const req = http.expectOne(r => r.url.endsWith('/movies'));
    expect(req.request.params.get('page')).toBe('2');
    expect(req.request.params.get('size')).toBe('15');
    expect(req.request.params.get('year')).toBe('2018');
    expect(req.request.params.get('winner')).toBe('false');
    req.flush({ content: [], totalElements: 0, totalPages: 0, number: 2 });
  });
  it('consulta anos', () => {
    service.getYears().subscribe();
    http.expectOne(r => r.url.endsWith('/yearsWithMultipleWinners')).flush({ years: [] });
  });
  it('consulta estúdios', () => {
    service.getStudios().subscribe();
    http.expectOne(r => r.url.endsWith('/studiosWithWinCount')).flush({ studios: [] });
  });
  it('consulta intervalos', () => {
    service.getIntervals().subscribe();
    http.expectOne(r => r.url.endsWith('/maxMinWinIntervalForProducers')).flush({ min: [], max: [] });
  });
  it('consulta vencedores por ano', () => {
    service.getWinnersByYear(2018).subscribe();
    const req = http.expectOne(r => r.url.endsWith('/winnersByYear'));
    expect(req.request.params.get('year')).toBe('2018');
    req.flush([]);
  });
});
