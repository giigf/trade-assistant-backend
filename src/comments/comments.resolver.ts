import { UseGuards } from '@nestjs/common';
import { Args, Int, Mutation, Query, Resolver } from '@nestjs/graphql';
import { CommentModel } from './comments.model';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { User } from 'src/user/user.entity';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { CreateCommentInput } from './dto/create-trade.input';
import { CommentsService } from './comments.service';

@Resolver()
export class CommentsResolver {
  constructor(private readonly commentsService: CommentsService) {}

  @UseGuards(JwtAuthGuard)
  @Mutation(() => CommentModel)
  async createComment(
    @CurrentUser() user: User,
    @Args('data') data: CreateCommentInput,
  ): Promise<CommentModel> {
    return await this.commentsService.createComment(user, data);
  }

  @UseGuards(JwtAuthGuard)
  @Query(() => [CommentModel]) // Изменено на массив!
  async getCommentsTrade(
    @Args('tradeId', { type: () => Int }) tradeId: number, // Добавлен декоратор @Args
  ): Promise<CommentModel[]> {
    return await this.commentsService.getCommentsTrade(tradeId);
  }
}
