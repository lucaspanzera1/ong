import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from '../auth/auth.module';
import { About, AboutSchema } from './schemas/about.schema';
import { AboutController } from './about.controller';
import { AboutService } from './about.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: About.name, schema: AboutSchema }]),
    AuthModule,
  ],
  controllers: [AboutController],
  providers: [AboutService],
})
export class AboutModule {}
