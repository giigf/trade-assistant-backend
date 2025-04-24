// src/user/user.resolver.ts

import { Resolver, Query, Args, Mutation, Int } from '@nestjs/graphql';
import { User } from './user.model';

@Resolver(() => User)
export class UserResolver {
  private users: User[] = [
    { id: 1, email: 'user@example.com', name: 'Vasya' },
    { id: 2, email: 'admin@example.com', name: 'Admin' },
  ];

  @Query(() => [User])
  getUsers(): User[] {
    return this.users;
  }

  @Query(() => User)
  getUserById(@Args('id', { type: () => Int }) id: number): User | undefined {
    return this.users.find((u) => u.id === id);
  }

  @Mutation(() => User)
  createUser(@Args('email') email: string, @Args('name') name: string): User {
    const newUser = { id: Date.now(), email, name };
    this.users.push(newUser);
    return newUser;
  }
}
