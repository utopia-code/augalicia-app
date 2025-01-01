import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RelatedProductsListComponent } from './related-products-list.component';

describe('RelatedProductsListComponent', () => {
  let component: RelatedProductsListComponent;
  let fixture: ComponentFixture<RelatedProductsListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RelatedProductsListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RelatedProductsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
