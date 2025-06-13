// src/app/core/pipes/active-user.pipe.ts
import { Pipe, PipeTransform } from '@angular/core';
import { User } from '../interfaces/user.interface';

@Pipe({
  name: 'activeUser',
  standalone: true
})
export class ActiveUserPipe implements PipeTransform {
  transform(users: User[] | null, active: boolean = true): User[] {
    if (!users) return [];
    return users.filter(user => user.active === active);
  }
}