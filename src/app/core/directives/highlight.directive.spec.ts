// src/app/core/directives/highlight.directive.spec.ts
import { HighlightDirective } from './highlight.directive';
import { Component, ElementRef } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

@Component({
  template: `<div appHighlight>Test</div>`
})
class TestComponent {}

describe('HighlightDirective', () => {
  let fixture, component, directiveEl, directive;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TestComponent, HighlightDirective]
    });
    fixture = TestBed.createComponent(TestComponent);
    component = fixture.componentInstance;
    directiveEl = fixture.debugElement.query(By.directive(HighlightDirective));
    directive = directiveEl.injector.get(HighlightDirective);
    fixture.detectChanges();
  });

  it('should create an instance', () => {
    expect(directive).toBeTruthy();
  });

  it('should highlight on mouseenter', () => {
    directiveEl.triggerEventHandler('mouseenter', null);
    fixture.detectChanges();
    expect(directiveEl.nativeElement.style.backgroundColor).toBe('yellow');
  });

  it('should remove highlight on mouseleave', () => {
    directiveEl.triggerEventHandler('mouseenter', null);
    fixture.detectChanges();
    directiveEl.triggerEventHandler('mouseleave', null);
    fixture.detectChanges();
    expect(directiveEl.nativeElement.style.backgroundColor).toBe('');
  });
});