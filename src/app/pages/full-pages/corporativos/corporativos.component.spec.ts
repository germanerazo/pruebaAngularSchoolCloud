import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CorporativosComponent } from './corporativos.component';

describe('CorporativosComponent', () => {
  let component: CorporativosComponent;
  let fixture: ComponentFixture<CorporativosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CorporativosComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CorporativosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
