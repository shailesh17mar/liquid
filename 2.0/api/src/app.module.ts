import { Module } from '@nestjs/common';
import { RedisModule } from 'nestjs-redis';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SessionModule } from './session/session.module';
import { ActivityModule } from './activity/activity.module';

const options = {
  url: 'redis://127.0.0.1:6379',
};

@Module({
  imports: [RedisModule.register(options), SessionModule, ActivityModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
