import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DashboardComponent } from './dashboard.component';
import { UserService } from '../../core/services/user.service';
import { of } from 'rxjs';
import { User } from '../../core/interfaces/user.interface';
import { MatCardModule } from '@angular/material/card';
import { MatGridListModule } from '@angular/material/grid-list';
import { CommonModule } from '@angular/common';
import { ActiveUserPipe } from '../../core/pipes/active-user.pipe';
import { InActiveUserPipe } from '../../core/pipes/inactive-user.pipe';

fdescribe('DashboardComponent', () => {
  let component: DashboardComponent;
  let fixture: ComponentFixture<DashboardComponent>;
  let userServiceSpy: jasmine.SpyObj<UserService>;

  const mockUsers: User[] = [
    { userid: '1', username: 'Alice', email: 'alice@mail.com', mobile: 1234567890, address: 'Addr1', active: true },
    { userid: '2', username: 'Bob', email: 'bob@mail.com', mobile: 2345678901, address: 'Addr2', active: false }
  ];

  beforeEach(async () => {
    userServiceSpy = jasmine.createSpyObj('UserService', ['getUsers']);
    userServiceSpy.getUsers.and.returnValue(of(mockUsers));

    await TestBed.configureTestingModule({
      imports: [
        DashboardComponent,
        CommonModule,
        MatCardModule,
        MatGridListModule,
        ActiveUserPipe,
        InActiveUserPipe
      ],
      providers: [
        { provide: UserService, useValue: userServiceSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(DashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the dashboard component', () => {
    expect(component).toBeTruthy();
  });

  it('should load users on init', (done) => {
    component.users$.subscribe(users => {
      expect(users.length).toBe(2);
      expect(users[0].username).toBe('Alice');
      done();
    });
  });
});