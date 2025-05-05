// src/user/user.resolver.ts
import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { UserService } from './user.service';
import { Role, User } from './user.entity';
import { CreateUserInput } from './dto/create-user.input';
import { UpdateUserInput } from './dto/update-user.input';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { UseGuards } from '@nestjs/common';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { UserModel } from './user.model';

@Resolver(() => UserModel)
export class UserResolver {
  constructor(private readonly userService: UserService) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @Query(() => [UserModel])
  getUsers(): Promise<UserModel[]> {
    return this.userService.findAll();
  }

  @UseGuards(JwtAuthGuard)
  @Query(() => UserModel)
  getUser(@Args('id', { type: () => Int }) id: number): Promise<UserModel> {
    return this.userService.findOne(id);
  }

  @Mutation(() => UserModel)
  updateUser(@Args('data') data: UpdateUserInput): Promise<UserModel> {
    return this.userService.updateUser(data);
  }

  @UseGuards(JwtAuthGuard)
  @Mutation(() => Boolean)
  deleteUser(@Args('id', { type: () => Int }) id: number): Promise<boolean> {
    return this.userService.deleteUser(id);
  }

  @UseGuards(JwtAuthGuard)
  @Query(() => UserModel)
  me(@CurrentUser() user: UserModel) {
    return this.userService.findOne(user.id);
  }
}
