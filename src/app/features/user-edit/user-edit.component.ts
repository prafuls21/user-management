// src/app/features/user-edit/user-edit.component.ts
import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from '../../core/services/user.service';
import { LoadingService } from '../../core/services/loading.service';
import { User } from '../../core/interfaces/user.interface';

@Component({
  selector: 'app-user-edit',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatInputModule,
    MatFormFieldModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatSlideToggleModule
  ],
  templateUrl: './user-edit.component.html',
  styleUrl: './user-edit.component.scss'
})
export class UserEditComponent implements OnInit {
  private fb = inject(FormBuilder);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private userService = inject(UserService);
  private loadingService = inject(LoadingService);

  isNewUser = false;
  userId: string | null = null;

  userForm = this.fb.group({
    username: ['', [Validators.required, Validators.minLength(3)]],
    email: ['', [Validators.required, Validators.email]],
    mobile: ['', [Validators.required, Validators.pattern(/^[0-9]{10,15}$/)]],
    address: ['', Validators.required],
    active: [true]
  });

  ngOnInit() {
    this.userId = this.route.snapshot.paramMap.get('id');
    this.isNewUser = this.route.snapshot.url.some(segment => segment.path === 'new');

    if (!this.isNewUser && this.userId) {
      this.loadUser(this.userId);
    }
  }

  loadUser(id: string) {
    this.loadingService.show();
    this.userService.getUserById(id).subscribe({
      next: (user) => {
        if (user) {
    this.userForm.patchValue({
      username: user.username,
      email: user.email,
      mobile: user.mobile?.toString(),
      address: user.address,
      active: user.active
    });
  } else {
    console.error('User not found');
    this.router.navigate(['/users']);
  }
        this.loadingService.hide();
      },
      error: (err) => {
        console.error('Error loading user', err);
        this.loadingService.hide();
        this.router.navigate(['/users']);
      }
    });
  }

  onSubmit() {
    if (this.userForm.invalid) return;

    const userData = this.userForm.value as unknown as Omit<User, 'userid'>;
    this.loadingService.show();

    if (this.isNewUser) {
      const newUser = {
        ...userData,
        userid: Math.random().toString(36).substring(2, 9)
      } as User;

      this.userService.addUser(newUser).subscribe({
        next: () => {
          this.loadingService.hide();
          //this.router.navigate(['/users', newUser.userid]);
          this.router.navigate(['/users']);
        },
        error: (err) => {
          console.error('Error adding user', err);
          this.loadingService.hide();
        }
      });
    } else if (this.userId) {
      const updatedUser = {
        ...userData,
        userid: this.userId
      } as User;

      this.userService.updateUser(updatedUser).subscribe({
        next: () => {
          this.loadingService.hide();
          this.router.navigate(['/users']);
          //this.router.navigate(['/users', this.userId]);
        },
        error: (err) => {
          console.error('Error updating user', err);
          this.loadingService.hide();
        }
      });
    }
  }

  onCancel() {
   /* if (this.userId) {
      this.router.navigate(['/users', this.userId]);
    } else {
      this.router.navigate(['/users']);
    }*/
    this.router.navigate(['/users']);
  }
}