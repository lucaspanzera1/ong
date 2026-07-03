import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from '../auth/auth.module';
import { PageView, PageViewSchema } from './schemas/page-view.schema';
import { ConsentLog, ConsentLogSchema } from './schemas/consent-log.schema';
import { AnalyticsController } from './analytics.controller';
import { AnalyticsService } from './analytics.service';
import { AnalyticsVisitorService } from './analytics-visitor.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: PageView.name, schema: PageViewSchema },
      { name: ConsentLog.name, schema: ConsentLogSchema },
    ]),
    AuthModule,
  ],
  controllers: [AnalyticsController],
  providers: [AnalyticsService, AnalyticsVisitorService],
})
export class AnalyticsModule {}
