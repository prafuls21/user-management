// src/app/features/user-edit/user-edit.component.spec.ts
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UserEditComponent } from './user-edit.component';
import { UserService } from '../../core/services/user.service';
import { LoadingService } from '../../core/services/loading.service';
import { ActivatedRoute, Router } from '@angular/router';
import { of } from 'rxjs';
import { User } from '../../core/interfaces/user.interface';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { ReactiveFormsModule } from '@angular/forms';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

describe('UserEditComponent', () => {
  let component: UserEditComponent;
  let fixture: ComponentFixture<UserEditComponent>;
  let userService: jasmine.SpyObj<UserService>;
  let loadingService: jasmine.SpyObj<LoadingService>;
  let router: jasmine.SpyObj<Router>;
  let route: ActivatedRoute;

  const mockUser: User = {
    userid: '1',
    username: 'testuser',
    email: 'test@example.com',
    mobile: 1234567890,
    address: 'Test Address',
    active: true
  };

  beforeEach(async () => {
    const userServiceSpy = jasmine.createSpyObj('UserService', ['getUserById', 'addUser', 'updateUser']);
    const loadingServiceSpy = jasmine.createSpyObj('LoadingService', ['show', 'hide']);
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [
        NoopAnimationsModule,
        ReactiveFormsModule,
        MatCardModule,
        MatButtonModule,
        MatIconModule,
        MatInputModule,
        MatFormFieldModule,
        MatSlideToggleModule,
        UserEditComponent
      ],
      providers: [
        { provide: UserService, useValue: userServiceSpy },
        { provide: LoadingService, useValue: loadingServiceSpy },
        { provide: Router, useValue: routerSpy },
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              paramMap: {
                get: (key: string) => '1'
              },
              url: [{ path: 'edit' }]
            }
          }
        }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(UserEditComponent);
    component = fixture.componentInstance;
    userService = TestBed.inject(UserService) as jasmine.SpyObj<UserService>;
    loadingService = TestBed.inject(LoadingService) as jasmine.SpyObj<LoadingService>;
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    route = TestBed.inject(ActivatedRoute);

    userService.getUserById.and.returnValue(of(mockUser));
    userService.addUser.and.returnValue(of(mockUser));
    userService.updateUser.and.returnValue(of(mockUser));
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize form for existing user', () => {
    expect(component.isNewUser).toBeFalse();
    expect(component.userId).toBe('1');
    expect(component.userForm.value).toEqual({
      username: mockUser.username,
      email: mockUser.email,
      mobile: mockUser.mobile.toString(),
      address: mockUser.address,
      active: mockUser.active
    });
  });

  it('should initialize form for new user', () => {
    const routeNewUser = {
      snapshot: {
        paramMap: {
          get: (key: string) => 'new'
        },
        url: [{ path: 'new' }, { path: 'edit' }]
      }
    };
    TestBed.resetTestingModule();
    TestBed.configureTestingModule({
      imports: [
        NoopAnimationsModule,
        ReactiveFormsModule,
        MatCardModule,
        MatButtonModule,
        MatIconModule,
        MatInputModule,
        MatFormFieldModule,
        MatSlideToggleModule,
        UserEditComponent
      ],
      providers: [
        { provide: UserService, useValue: userService },
        { provide: LoadingService, useValue: loadingService },
        { provide: Router, useValue: router },
        { provide: ActivatedRoute, useValue: routeNewUser }
      ]
    }).compileComponents();

    const newUserFixture = TestBed.createComponent(UserEditComponent);
    const newUserComponent = newUserFixture.componentInstance;
    newUserFixture.detectChanges();

    expect(newUserComponent.isNewUser).toBeTrue();
    expect(newUserComponent.userId).toBeNull();
    expect(newUserComponent.userForm.value).toEqual({
      username: '',
      email: '',
      mobile: '',
      address: '',
      active: true
    });
  });

  it('should validate form', () => {
    const form = component.userForm;
    expect(form.valid).toBeTrue();

    form.get('username')?.setValue('');
    expect(form.get('username')?.hasError('required')).toBeTrue();
    expect(form.valid).toBeFalse();

    form.get('email')?.setValue('invalid');
    expect(form.get('email')?.hasError('email')).toBeTrue();
  });

  it('should update existing user', () => {
    component.onSubmit();
    expect(userService.updateUser).toHaveBeenCalled();
    expect(router.navigate).toHaveBeenCalledWith(['/users', '1']);
  });

  it('should add new user', () => {
    component.isNewUser = true;
    component.userForm.setValue({
      username: 'newuser',
      email: 'new@example.com',
      mobile: '9876543210',
      address: 'New Address',
      active: true
    });
    component.onSubmit();
    expect(userService.addUser).toHaveBeenCalled();
  });

  it('should cancel and navigate back', () => {
    component.onCancel();
    expect(router.navigate).toHaveBeenCalledWith(['/users', '1']);
  });
});