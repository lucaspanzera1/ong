import { BadRequestException, Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { SessionGuard } from '../auth/auth.guard';
import { Tag } from './schemas/tag.schema';
import { TagsService } from './tags.service';

@Controller('tags')
export class TagsController {
  constructor(private readonly tagsService: TagsService) {}

  @Get()
  findAll(): Promise<Tag[]> {
    return this.tagsService.findAll();
  }

  @Post()
  @UseGuards(SessionGuard)
  create(@Body() body: { name?: string; icon?: string }): Promise<Tag> {
    const name = body.name?.trim();
    const icon = body.icon?.trim();
    if (!name || !icon) {
      throw new BadRequestException('name and icon are required');
    }
    return this.tagsService.create(name, icon);
  }
}
