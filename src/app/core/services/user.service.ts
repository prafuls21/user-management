// src/app/core/services/user.service.ts
import { Injectable, signal } from '@angular/core';
import { User } from '../interfaces/user.interface';
import { of, delay, Observable, throwError } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class UserService {
  private users = signal<User[]>(this.generateMockUsers());

  getUsers() {
    // Simulate API call with delay
    return of([...this.users()]).pipe(delay(500));
  }

  getUserById(id: string): Observable<User | undefined> {
    //alert(id);
    const user = this.users().find(u => u.userid === id);
    if (!user && id !== 'new') {
      return throwError(() => new Error('User not found'));
    }
    return of(user).pipe(delay(300));
  }

  addUser(user: User): Observable<User> {
    this.users.update(users => [...users, user]);
    return of(user).pipe(delay(300));
  }

  updateUser(updatedUser: User): Observable<User> {
    this.users.update(users => 
      users.map(user => user.userid === updatedUser.userid ? updatedUser : user)
    );
    return of(updatedUser).pipe(delay(300));
  }

  deleteUser(id: string): Observable<boolean> {
    this.users.update(users => users.filter(user => user.userid !== id));
    return of(true).pipe(delay(300));
  }

  private generateMockUsers(): User[] {
    return [
      {
        userid: '1',
        username: 'john_doe',
        email: 'john@example.com',
        mobile: 1234567890,
        address: '123 Main St, New York',
        active: true
      },
      {
        userid: '2',
        username: 'jane_smith',
        email: 'jane@example.com',
        mobile: 9876543210,
        address: '456 Oak Ave, Los Angeles',
        active: true
      },
      {
        userid: '3',
        username: 'bob_johnson',
        email: 'bob@example.com',
        mobile: 5551234567,
        address: '789 Pine Rd, Chicago',
        active: false
      }
    ];
  }
}