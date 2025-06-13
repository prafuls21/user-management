// src/app/features/user-list/user-list.component.ts
import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatSortModule, Sort } from '@angular/material/sort';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';
import { UserService } from '../../core/services/user.service';
import { LoadingService } from '../../core/services/loading.service';
import { User } from '../../core/interfaces/user.interface';
import { HighlightDirective } from '../../core/directives/highlight.directive';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTooltipModule } from '@angular/material/tooltip';
import { FormsModule } from '@angular/forms';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';

@Component({
  selector: 'app-user-list',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatInputModule,
    MatFormFieldModule,
    MatButtonModule,
    MatIconModule,
    HighlightDirective,
    MatProgressSpinnerModule,
    MatTooltipModule,
    FormsModule,
    MatSlideToggleModule
  ],
  templateUrl: './user-list.component.html',
  styleUrl: './user-list.component.scss'
})
export class UserListComponent {
  private userService = inject(UserService);
  private loadingService = inject(LoadingService);
  private router = inject(Router);

  displayedColumns: string[] = ['username', 'email', 'mobile', 'address', 'active', 'actions'];
  dataSource: User[] = [];
  filteredData: User[] = [];
  searchTerm = '';
  showActiveOnly = false;

  // Pagination
  pageSize = 5;
  pageIndex = 0;
  pageSizeOptions = [5, 10, 25];

  // Sort
  sortActive = '';
  sortDirection: 'asc' | 'desc' = 'asc';

  ngOnInit() {
    this.loadUsers();
  }

  loadUsers() {
    this.loadingService.show();
    this.userService.getUsers().subscribe({
      next: (users) => {
        this.dataSource = users;
        this.applyFilters();
        this.loadingService.hide();
      },
      error: (err) => {
        console.error('Error loading users', err);
        this.loadingService.hide();
      }
    });
  }

  applyFilters() {
    let result = [...this.dataSource];

    // Apply search filter
    if (this.searchTerm) {
      const term = this.searchTerm.toLowerCase();
      result = result.filter(user =>
        user.username.toLowerCase().includes(term) ||
        user.email.toLowerCase().includes(term) ||
        user.address.toLowerCase().includes(term) ||
        user.mobile.toString().includes(term)
      );
    }

    // Apply active filter
    if (this.showActiveOnly) {
      result = result.filter(user => user.active);
    }

    // Apply sorting
    if (this.sortActive) {
      result.sort((a, b) => {
        const valueA = a[this.sortActive as keyof User];
        const valueB = b[this.sortActive as keyof User];
        
        if (typeof valueA === 'string' && typeof valueB === 'string') {
          return this.sortDirection === 'asc' 
            ? valueA.localeCompare(valueB)
            : valueB.localeCompare(valueA);
        } else {
          return this.sortDirection === 'asc' 
            ? (valueA as number) - (valueB as number)
            : (valueB as number) - (valueA as number);
        }
      });
    }

    this.filteredData = result;
  }

  onSearchChange() {
    this.pageIndex = 0;
    this.applyFilters();
  }

  onToggleChange() {
    this.pageIndex = 0;
    this.applyFilters();
  }

  onSortChange(sort: Sort) {
    this.sortActive = sort.active;
    this.sortDirection = sort.direction as 'asc' | 'desc';
    this.applyFilters();
  }

  onPageChange(event: PageEvent) {
    this.pageSize = event.pageSize;
    this.pageIndex = event.pageIndex;
  }

  getPaginatedData() {
    const startIndex = this.pageIndex * this.pageSize;
    return this.filteredData.slice(startIndex, startIndex + this.pageSize);
  }

  viewUser(id: string) {
    this.router.navigate(['/users', id]);
  }

  editUser(id: string) {
    this.router.navigate(['/users', id, 'edit']);
  }

  deleteUser(id: string) {
    if (confirm('Are you sure you want to delete this user?')) {
      this.loadingService.show();
      this.userService.deleteUser(id).subscribe({
        next: () => {
          this.loadUsers();
        },
        error: (err) => {
          console.error('Error deleting user', err);
          this.loadingService.hide();
        }
      });
    }
  }

  addUser() {
    this.router.navigate(['/users', 'new', 'edit']);
  }
}