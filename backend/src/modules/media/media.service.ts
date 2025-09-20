import { Injectable } from '@nestjs/common';
import { CloudinaryService } from '../cloudinary/cloudinary.service';

@Injectable()
export class MediaService {
    constructor(private cloudinary: CloudinaryService) {}

    async upload(file: Express.Multer.File) {
        // optional: transform video/image
        const isImage = file.mimetype.startsWith('image/');
        const opts = isImage
        ? { transformation: [{ fetch_format: 'auto', quality: 'auto' }] }
        : {};
        return this.cloudinary.uploadBuffer(file.buffer, file.originalname, opts);
    }
}

