import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReplyDelteComponent } from './reply-delte.component';

describe('ReplyDelteComponent', () => {
  let component: ReplyDelteComponent;
  let fixture: ComponentFixture<ReplyDelteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReplyDelteComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReplyDelteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
