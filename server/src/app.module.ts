import {
  Module,
} from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TradeDataModule } from './trade-data/trade-data.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: 'sqlite.db',
      entities: ['dist/**/*.entity.js'],
      synchronize: false
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'web'),
      exclude: ['/api*'],
    }),
    TradeDataModule,
  ],
  controllers: [AppController],
  providers: [ AppService],
})
export class AppModule {}
