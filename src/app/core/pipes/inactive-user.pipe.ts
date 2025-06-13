// src/app/core/pipes/active-user.pipe.ts
import { Pipe, PipeTransform } from '@angular/core';
import { User } from '../interfaces/user.interface';

@Pipe({
  name: 'inActiveUser',
  standalone: true
})
export class InActiveUserPipe implements PipeTransform {
  transform(users: User[] | null, active: boolean = false): User[] {
    if (!users) return [];
    return users.filter(user => user.active === active);
  }
}