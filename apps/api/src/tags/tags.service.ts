import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Tag, TagDocument } from './schemas/tag.schema';

export interface CreateTagInput {
  name: string;
  icon: string;
  nameEn?: string;
  parentId?: string | null;
}

export interface UpdateTagInput {
  nameEn?: string;
  parentId?: string | null;
}

@Injectable()
export class TagsService {
  constructor(
    @InjectModel(Tag.name) private readonly tagModel: Model<TagDocument>,
  ) {}

  findAll(): Promise<Tag[]> {
    return this.tagModel.find().sort({ order: 1, name: 1 }).exec();
  }

  async create(input: CreateTagInput): Promise<Tag> {
    const parentId = await this.resolveParentId(input.parentId);
    const order = await this.tagModel
      .countDocuments({ parentId })
      .exec();

    try {
      return await this.tagModel.create({
        name: input.name,
        icon: input.icon,
        nameEn: input.nameEn || undefined,
        parentId,
        order,
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

  async update(id: string, input: UpdateTagInput): Promise<Tag> {
    const tag = await this.tagModel.findById(id).exec();
    if (!tag) {
      throw new NotFoundException('Tag not found');
    }

    if (input.nameEn !== undefined) {
      tag.nameEn = input.nameEn || undefined;
    }

    if (input.parentId !== undefined) {
      const parentId = await this.resolveParentId(input.parentId);
      if (parentId && parentId.equals(tag._id as Types.ObjectId)) {
        throw new BadRequestException('A tag cannot be its own parent');
      }
      if (parentId && (await this.wouldCreateCycle(String(tag._id), String(parentId)))) {
        throw new BadRequestException(
          'Cannot set a descendant tag as parent',
        );
      }
      if (String(tag.parentId ?? '') !== String(parentId ?? '')) {
        tag.parentId = parentId;
        tag.order = await this.tagModel.countDocuments({ parentId }).exec();
      }
    }

    return tag.save();
  }

  async reorderSiblings(
    parentId: string | null,
    orderedIds: string[],
  ): Promise<void> {
    const resolvedParentId = await this.resolveParentId(parentId);
    await this.tagModel.bulkWrite(
      orderedIds.map((id, index) => ({
        updateOne: {
          filter: { _id: id, parentId: resolvedParentId },
          update: { $set: { order: index } },
        },
      })),
    );
  }

  private async resolveParentId(
    parentId: string | null | undefined,
  ): Promise<Types.ObjectId | null> {
    if (!parentId) return null;
    const parent = await this.tagModel.findById(parentId).exec();
    if (!parent) {
      throw new NotFoundException('Parent tag not found');
    }
    return parent._id as Types.ObjectId;
  }

  private async wouldCreateCycle(
    tagId: string,
    newParentId: string,
  ): Promise<boolean> {
    let currentId: string | null = newParentId;
    while (currentId) {
      if (currentId === tagId) return true;
      const parent = await this.tagModel
        .findById(currentId)
        .select('parentId')
        .exec();
      currentId = parent?.parentId ? String(parent.parentId) : null;
    }
    return false;
  }
}
