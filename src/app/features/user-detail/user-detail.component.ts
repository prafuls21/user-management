// src/app/features/user-detail/user-detail.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { UserService } from '../../core/services/user.service';
import { LoadingService } from '../../core/services/loading.service';
import { HighlightDirective } from '../../core/directives/highlight.directive';

@Component({
  selector: 'app-user-detail',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatListModule,
    HighlightDirective
  ],
  templateUrl: './user-detail.component.html',
  styleUrl: './user-detail.component.scss'
})
export class UserDetailComponent implements OnInit {
  user: any;
  
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private userService: UserService,
    private loadingService: LoadingService
  ) {}

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadUser(id);
    }
  }

  loadUser(id: string) {
    this.loadingService.show();
    this.userService.getUserById(id).subscribe({
      next: (user) => {
        this.user = user;
        this.loadingService.hide();
      },
      error: (err) => {
        console.error('Error loading user', err);
        this.loadingService.hide();
        this.router.navigate(['/users']);
      }
    });
  }

  goBack() {
    this.router.navigate(['/users']);
  }

  editUser() {
    this.router.navigate(['/users', this.user.userid, 'edit']);
  }
}