// src/app/features/user-list/user-list.component.spec.ts
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UserListComponent } from './user-list.component';
import { UserService } from '../../core/services/user.service';
import { LoadingService } from '../../core/services/loading.service';
import { Router } from '@angular/router';
import { of } from 'rxjs';
import { User } from '../../core/interfaces/user.interface';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { FormsModule } from '@angular/forms';
import { HighlightDirective } from '../../core/directives/highlight.directive';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { ActiveUserPipe } from '../../core/pipes/active-user.pipe';

describe('UserListComponent', () => {
  let component: UserListComponent;
  let fixture: ComponentFixture<UserListComponent>;
  let userService: jasmine.SpyObj<UserService>;
  let loadingService: jasmine.SpyObj<LoadingService>;
  let router: jasmine.SpyObj<Router>;

  const mockUsers: User[] = [
    { userid: '1', username: 'user1', email: 'user1@test.com', mobile: 123, address: 'addr1', active: true },
    { userid: '2', username: 'user2', email: 'user2@test.com', mobile: 456, address: 'addr2', active: false }
  ];

  beforeEach(async () => {
    const userServiceSpy = jasmine.createSpyObj('UserService', ['getUsers', 'deleteUser']);
    const loadingServiceSpy = jasmine.createSpyObj('LoadingService', ['show', 'hide']);
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [
        NoopAnimationsModule,
        FormsModule,
        MatTableModule,
        MatPaginatorModule,
        MatSortModule,
        MatInputModule,
        MatFormFieldModule,
        MatButtonModule,
        MatIconModule,
        MatTooltipModule,
        MatSlideToggleModule,
        UserListComponent,
        HighlightDirective,
        ActiveUserPipe
      ],
      providers: [
        { provide: UserService, useValue: userServiceSpy },
        { provide: LoadingService, useValue: loadingServiceSpy },
        { provide: Router, useValue: routerSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(UserListComponent);
    component = fixture.componentInstance;
    userService = TestBed.inject(UserService) as jasmine.SpyObj<UserService>;
    loadingService = TestBed.inject(LoadingService) as jasmine.SpyObj<LoadingService>;
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;

    userService.getUsers.and.returnValue(of(mockUsers));
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load users on init', () => {
    expect(userService.getUsers).toHaveBeenCalled();
    expect(loadingService.show).toHaveBeenCalled();
    expect(loadingService.hide).toHaveBeenCalled();
    expect(component.dataSource).toEqual(mockUsers);
  });

  it('should filter active users', () => {
    component.showActiveOnly = true;
    component.applyFilters();
    expect(component.filteredData.length).toBe(1);
    expect(component.filteredData[0].active).toBeTrue();
  });

  it('should search users', () => {
    component.searchTerm = 'user1';
    component.applyFilters();
    expect(component.filteredData.length).toBe(1);
    expect(component.filteredData[0].username).toBe('user1');
  });

  it('should navigate to user detail on view', () => {
    component.viewUser('1');
    expect(router.navigate).toHaveBeenCalledWith(['/users', '1']);
  });

  it('should delete user', () => {
    userService.deleteUser.and.returnValue(of(true));
    spyOn(window, 'confirm').and.returnValue(true);
    component.deleteUser('1');
    expect(userService.deleteUser).toHaveBeenCalledWith('1');
  });
});