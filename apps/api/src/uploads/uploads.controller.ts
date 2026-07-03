import {
  Controller,
  Post,
  UseInterceptors,
  UploadedFile,
  UseGuards,
  BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { SessionGuard } from '../auth/auth.guard';

@Controller('uploads')
export class UploadsController {
  @Post()
  @UseGuards(SessionGuard)
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, cb) => {
          const uniqueSuffix =
            Date.now() + '-' + Math.round(Math.random() * 1e9);
          cb(null, uniqueSuffix + extname(file.originalname));
        },
      }),
    }),
  )
  uploadFile(@UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('No file uploaded');
    }
    // API is usually served at API_URL (e.g. http://localhost:3000)
    // The frontend can prepend API_URL or just use the absolute path if served on same domain,
    // but typically it's better to return the full URL or just the path and let frontend handle it.
    // We'll return just the path.
    return {
      url: `/uploads/${file.filename}`,
    };
  }
}
