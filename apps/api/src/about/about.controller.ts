import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Patch,
  UseGuards,
} from '@nestjs/common';
import { SessionGuard } from '../auth/auth.guard';
import { About } from './schemas/about.schema';
import { AboutService } from './about.service';

@Controller('about')
export class AboutController {
  constructor(private readonly aboutService: AboutService) {}

  @Get()
  get(): Promise<About> {
    return this.aboutService.get();
  }

  @Patch()
  @UseGuards(SessionGuard)
  update(
    @Body() body: { content?: string; contentEn?: string },
  ): Promise<About> {
    const updates: { content?: string; contentEn?: string } = {};

    if (body.content !== undefined) {
      const content = body.content.trim();
      if (!content) throw new BadRequestException('content cannot be empty');
      updates.content = content;
    }
    if (body.contentEn !== undefined) {
      updates.contentEn = body.contentEn.trim();
    }

    return this.aboutService.update(updates);
  }
}
