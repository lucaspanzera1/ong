import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { join } from 'path';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { TagsModule } from './tags/tags.module';
import { ArticlesModule } from './articles/articles.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { UploadsModule } from './uploads/uploads.module';
import { TranslateModule } from './translate/translate.module';
import { AnalyticsModule } from './analytics/analytics.module';
import { AboutModule } from './about/about.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath:
        process.env.NODE_ENV === 'production'
          ? [
              join(__dirname, '../../../.env.prod'),
              join(__dirname, '../../../.env'),
            ]
          : join(__dirname, '../../../.env'),
    }),
    MongooseModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        uri: config.getOrThrow<string>('MONGODB_URI'),
      }),
    }),
    AuthModule,
    TagsModule,
    ArticlesModule,
    UploadsModule,
    TranslateModule,
    AnalyticsModule,
    AboutModule,
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'uploads'),
      serveRoot: '/s/uploads',
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
