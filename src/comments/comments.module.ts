import { Module } from '@nestjs/common';
import { CommentsResolver } from './comments.resolver';
import { CommentsService } from './comments.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Comment } from './comments.entity';
import { Trade } from 'src/trade/trade.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Comment, Trade])],
  providers: [CommentsResolver, CommentsService],
})
export class CommentsModule {}
