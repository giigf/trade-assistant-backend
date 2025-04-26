import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { RegisterInput } from './dto/register.input';
import { LoginInput } from './dto/login.input';

@Resolver()
export class AuthResolver {
  constructor(private authService: AuthService) {}

  @Mutation(() => String)
  register(@Args('data') data: RegisterInput) {
    return this.authService.register(data);
  }

  @Mutation(() => String)
  login(@Args('data') data: LoginInput) {
    return this.authService.login(data);
  }
}
