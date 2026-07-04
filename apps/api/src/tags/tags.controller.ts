import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
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
  create(
    @Body()
    body: {
      name?: string;
      icon?: string;
      nameEn?: string;
      parentId?: string | null;
    },
  ): Promise<Tag> {
    const name = body.name?.trim();
    const icon = body.icon?.trim();
    if (!name || !icon) {
      throw new BadRequestException('name and icon are required');
    }
    return this.tagsService.create({
      name,
      icon,
      nameEn: body.nameEn?.trim(),
      parentId: body.parentId ?? null,
    });
  }

  @Patch('reorder')
  @UseGuards(SessionGuard)
  reorder(
    @Body() body: { parentId?: string | null; order?: string[] },
  ): Promise<void> {
    if (!Array.isArray(body.order)) {
      throw new BadRequestException('order must be an array of tag ids');
    }
    return this.tagsService.reorderSiblings(body.parentId ?? null, body.order);
  }

  @Patch(':id')
  @UseGuards(SessionGuard)
  update(
    @Param('id') id: string,
    @Body() body: { nameEn?: string; parentId?: string | null },
  ): Promise<Tag> {
    return this.tagsService.update(id, {
      nameEn: body.nameEn !== undefined ? body.nameEn.trim() : undefined,
      parentId: body.parentId,
    });
  }
}
