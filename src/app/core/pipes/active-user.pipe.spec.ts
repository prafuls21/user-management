// src/app/core/pipes/active-user.pipe.spec.ts
import { ActiveUserPipe } from './active-user.pipe';
import { User } from '../interfaces/user.interface';

describe('ActiveUserPipe', () => {
  const pipe = new ActiveUserPipe();
  const mockUsers: User[] = [
    { userid: '1', username: 'user1', email: 'user1@test.com', mobile: 123, address: 'addr1', active: true },
    { userid: '2', username: 'user2', email: 'user2@test.com', mobile: 456, address: 'addr2', active: false },
    { userid: '3', username: 'user3', email: 'user3@test.com', mobile: 789, address: 'addr3', active: true }
  ];

  it('create an instance', () => {
    expect(pipe).toBeTruthy();
  });

  it('should filter active users by default', () => {
    const result = pipe.transform(mockUsers);
    expect(result.length).toBe(2);
    expect(result.every(user => user.active)).toBeTrue();
  });

  it('should filter inactive users when specified', () => {
    const result = pipe.transform(mockUsers, false);
    expect(result.length).toBe(1);
    expect(result.every(user => !user.active)).toBeTrue();
  });

  it('should return empty array for null input', () => {
    expect(pipe.transform(null)).toEqual([]);
  });
});