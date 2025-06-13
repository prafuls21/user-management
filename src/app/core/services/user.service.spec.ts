// src/app/core/services/user.service.spec.ts
import { TestBed } from '@angular/core/testing';
import { UserService } from './user.service';
import { User } from '../interfaces/user.interface';

describe('UserService', () => {
  let service: UserService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UserService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return users', (done) => {
    service.getUsers().subscribe(users => {
      expect(users.length).toBeGreaterThan(0);
      done();
    });
  });

  it('should add a user', (done) => {
    const newUser: User = {
      userid: 'test123',
      username: 'testuser',
      email: 'test@example.com',
      mobile: 1234567890,
      address: 'Test Address',
      active: true
    };

    service.addUser(newUser).subscribe(user => {
      expect(user).toEqual(newUser);
      service.getUsers().subscribe(users => {
        expect(users).toContain(newUser);
        done();
      });
    });
  });

  it('should delete a user', (done) => {
    const userId = '1'; // From mock data
    service.deleteUser(userId).subscribe(success => {
      expect(success).toBeTrue();
      service.getUsers().subscribe(users => {
        expect(users.find(u => u.userid === userId)).toBeUndefined();
        done();
      });
    });
  });
});