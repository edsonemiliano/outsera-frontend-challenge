import { provideZonelessChangeDetection } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { App } from './app';

describe('App', () => {
  it('cria o menu', async () => {
    await TestBed.configureTestingModule({ imports: [App], providers: [provideZonelessChangeDetection(), provideRouter([])] }).compileComponents();
    const fixture = TestBed.createComponent(App);
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelectorAll('nav a').length).toBe(2);
  });
});
