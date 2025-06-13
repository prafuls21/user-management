// src/app/features/dashboard/dashboard.component.ts
import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatGridListModule } from '@angular/material/grid-list';
import { UserService } from '../../core/services/user.service';
import { CommonModule } from '@angular/common';
import { ActiveUserPipe } from '../../core/pipes/active-user.pipe';

import { OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from '../../core/interfaces/user.interface';
import { InActiveUserPipe } from '../../core/pipes/inactive-user.pipe';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatGridListModule, ActiveUserPipe,InActiveUserPipe],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  users$!: Observable<User[]>;

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.users$ = this.userService.getUsers();
  }

}