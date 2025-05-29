import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Comment } from './comments.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/user/user.entity';
import { CreateCommentInput } from './dto/create-trade.input';
import { CommentModel } from './comments.model';
import { plainToInstance } from 'class-transformer';
import { Trade } from 'src/trade/trade.entity';

@Injectable()
export class CommentsService {
  constructor(
    @InjectRepository(Comment)
    private commentRepo: Repository<Comment>,
    @InjectRepository(Trade)
    private tradeRepo: Repository<Trade>,
  ) {}

  async createComment(
    user: User,
    data: CreateCommentInput,
  ): Promise<CommentModel> {
    const trade = await this.tradeRepo.findOne({ where: { id: data.tradeId } });
    if (!trade) throw new NotFoundException('Trade не найден');
    const comment = this.commentRepo.create({
      text: data.text,
      trade,
      user,
    });
    const savedComment = await this.commentRepo.save(comment);
    return plainToInstance(CommentModel, savedComment, {
      excludeExtraneousValues: true,
    });
  }

  async getCommentsTrade(tradeId: number): Promise<CommentModel[]> {
    const trade = await this.tradeRepo.findOne({ where: { id: tradeId } });
    if (!trade) throw new NotFoundException('Trade не найден');

    const comments = await this.commentRepo.find({
      where: { trade: { id: tradeId } },
      relations: ['user', 'trade'], // Загружаем связанные данные
      order: { date: 'DESC' }, // Сортируем по дате (новые сначала)
    });

    return comments.map((comment) =>
      plainToInstance(CommentModel, comment, {
        excludeExtraneousValues: true,
      }),
    );
  }
}
