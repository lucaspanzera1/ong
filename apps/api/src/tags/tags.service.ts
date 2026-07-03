import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Tag, TagDocument } from './schemas/tag.schema';

@Injectable()
export class TagsService {
  constructor(
    @InjectModel(Tag.name) private readonly tagModel: Model<TagDocument>,
  ) {}

  findAll(): Promise<Tag[]> {
    return this.tagModel.find().sort({ name: 1 }).exec();
  }

  async create(name: string, icon: string, nameEn?: string): Promise<Tag> {
    try {
      return await this.tagModel.create({
        name,
        icon,
        nameEn: nameEn || undefined,
      });
    } catch (err: unknown) {
      if (
        err &&
        typeof err === 'object' &&
        'code' in err &&
        err.code === 11000
      ) {
        throw new ConflictException('Tag already exists');
      }
      throw err;
    }
  }

  async update(id: string, nameEn?: string): Promise<Tag> {
    const tag = await this.tagModel.findById(id).exec();
    if (!tag) {
      throw new NotFoundException('Tag not found');
    }
    tag.nameEn = nameEn || undefined;
    return tag.save();
  }
}
