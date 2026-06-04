import { Module } from '@nestjs/common';
import { DatabaseModule } from 'src/infrastructure/database/database.module';
import { ConfigModule } from '@nestjs/config';
import configuration from 'src/infrastructure/config/app.config';
import { InterviewerModule } from 'src/interviewer/interviewer.module';

@Module({
  imports: [
    DatabaseModule,
    InterviewerModule,
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
    }),
  ],
})
export class AppModule {}
