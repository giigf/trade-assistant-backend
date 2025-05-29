// src/database/seeds/comment.seed.ts
import { DataSource } from 'typeorm';
import { Comment } from '../../comments/comments.entity';
import { User } from '../../user/user.entity';
import { Trade } from '../../trade/trade.entity';
import { CommentFactory } from '../factories/comment.factory';
import { BaseSeed } from './interfaces/seed.interface';

export class CommentSeed extends BaseSeed {
  getName(): string {
    return 'CommentSeed';
  }

  async run(dataSource: DataSource): Promise<void> {
    const commentRepository = dataSource.getRepository(Comment);
    const userRepository = dataSource.getRepository(User);
    const tradeRepository = dataSource.getRepository(Trade);
    
    console.log('🌱 Создаем комментарии...');
    
    // Проверяем, есть ли уже комментарии
    const existingCommentsCount = await commentRepository.count();
    if (existingCommentsCount > 0) {
      console.log('⚠️  Комментарии уже существуют, пропускаем...');
      return;
    }

    // Получаем всех пользователей и трейды
    const users = await userRepository.find();
    const trades = await tradeRepository.find({ relations: ['user'] });
    
    if (users.length === 0) {
      console.log('❌ Пользователи не найдены. Сначала запустите UserSeed.');
      return;
    }
    
    if (trades.length === 0) {
      console.log('❌ Трейды не найдены. Сначала запустите TradeSeed.');
      return;
    }

    console.log(`📊 Найдено ${users.length} пользователей и ${trades.length} трейдов`);

    let totalCommentsCreated = 0;

    // Создаем комментарии для каждого трейда
    for (const trade of trades) {
      // Определяем количество комментариев для трейда (0-5)
      const commentsCount = Math.floor(Math.random() * 6);
      
      if (commentsCount === 0) {
        continue; // Некоторые трейды могут остаться без комментариев
      }

      // Выбираем случайных пользователей для комментариев
      const shuffledUsers = [...users].sort(() => 0.5 - Math.random());
      const commentingUsers = shuffledUsers.slice(0, Math.min(commentsCount, users.length));

      // Создаем комментарии от разных пользователей
      const commentsData: Partial<Comment>[] = [];
      
      for (let i = 0; i < commentingUsers.length; i++) {
        const user = commentingUsers[i];
        
        // Создаем временную метку между началом и концом трейда
        const timeBetween = trade.date_end.getTime() - trade.date_start.getTime();
        const randomOffset = Math.random() * timeBetween;
        const commentDate = new Date(trade.date_start.getTime() + randomOffset);
        
        const commentData = CommentFactory.create(user, trade, {
          date: commentDate,
        });
        
        commentsData.push(commentData);
      }

      // Сортируем комментарии по дате
      commentsData.sort((a, b) => a.date!.getTime() - b.date!.getTime());

      // Сохраняем комментарии
      const comments = commentRepository.create(commentsData);
      const savedComments = await commentRepository.save(comments);
      
      totalCommentsCreated += savedComments.length;
      
      if (savedComments.length > 0) {
        console.log(`✅ Создано ${savedComments.length} комментариев для трейда #${trade.id} (${trade.note.substring(0, 30)}...)`);
      }
    }

    // Создаем дополнительные комментарии для активных обсуждений
    console.log('📝 Создаем активные обсуждения...');
    
    // Выбираем 20% трейдов для активного обсуждения
    const activeDiscussionTrades = trades
      .sort(() => 0.5 - Math.random())
      .slice(0, Math.ceil(trades.length * 0.2));

    for (const trade of activeDiscussionTrades) {
      // Создаем много комментариев для активного обсуждения (3-8 комментариев)
      const discussionCommentsCount = Math.floor(Math.random() * 6) + 3;
      const discussionUsers = [...users].sort(() => 0.5 - Math.random()).slice(0, Math.min(discussionCommentsCount, users.length));
      
      const discussionComments = CommentFactory.createMultipleUsers(discussionUsers, trade);
      
      // Распределяем комментарии по времени более равномерно
      discussionComments.forEach((comment, index) => {
        const timeBetween = trade.date_end.getTime() - trade.date_start.getTime();
        const timeStep = timeBetween / (discussionComments.length + 1);
        comment.date = new Date(trade.date_start.getTime() + (index + 1) * timeStep);
      });

      const comments = commentRepository.create(discussionComments);
      const savedComments = await commentRepository.save(comments);
      
      totalCommentsCreated += savedComments.length;
      console.log(`🔥 Создано активное обсуждение: ${savedComments.length} комментариев для трейда #${trade.id}`);
    }

    // Создаем несколько комментариев от владельцев трейдов (самокомментарии)
    console.log('💭 Создаем комментарии от владельцев трейдов...');
    
    const selfCommentTrades = trades
      .sort(() => 0.5 - Math.random())
      .slice(0, Math.ceil(trades.length * 0.3));

    for (const trade of selfCommentTrades) {
      const selfComments = [
        'Обновление: позиция развивается согласно плану',
        'Пересматриваю стратегию после новых данных',
        'Важное обновление по этой сделке',
        'Анализирую результаты, делаю выводы',
        'Корректирую подход на основе опыта',
      ];
      
      const randomSelfComment = selfComments[Math.floor(Math.random() * selfComments.length)];
      
      const selfCommentData = CommentFactory.create(trade.user, trade, {
        text: randomSelfComment,
        date: new Date(trade.date_start.getTime() + (trade.date_end.getTime() - trade.date_start.getTime()) * 0.7),
      });

      const comment = commentRepository.create(selfCommentData);
      await commentRepository.save(comment);
      totalCommentsCreated++;
    }

    const finalCommentsCount = await commentRepository.count();
    console.log(`🎉 CommentSeed завершен! Всего создано комментариев: ${finalCommentsCount}`);
    console.log(`📈 Статистика: ${totalCommentsCreated} новых комментариев добавлено`);
    
    // Показываем статистику по пользователям
    const commentStats = await commentRepository
      .createQueryBuilder('comment')
      .leftJoin('comment.user', 'user')
      .select('user.name', 'userName')
      .addSelect('COUNT(comment.id)', 'commentCount')
      .groupBy('user.id, user.name')
      .orderBy('commentCount', 'DESC')
      .getRawMany();

    console.log('👥 Статистика комментариев по пользователям:');
    commentStats.forEach(stat => {
      console.log(`   ${stat.userName}: ${stat.commentCount} комментариев`);
    });
  }
}