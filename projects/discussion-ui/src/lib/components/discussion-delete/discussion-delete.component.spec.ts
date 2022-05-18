import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DiscussionDeleteComponent } from './discussion-delete.component';

describe('DiscussionDeleteComponent', () => {
  let component: DiscussionDeleteComponent;
  let fixture: ComponentFixture<DiscussionDeleteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DiscussionDeleteComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DiscussionDeleteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
