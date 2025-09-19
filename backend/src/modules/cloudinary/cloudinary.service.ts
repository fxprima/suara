import { Injectable, Inject, BadRequestException } from '@nestjs/common';
import { v2 as Cloudinary, UploadApiResponse, UploadApiOptions } from 'cloudinary';
import { Readable } from 'stream';

@Injectable()
export class CloudinaryService {
    constructor(@Inject('CLOUDINARY') private cloudinary: typeof Cloudinary) {}

    uploadBuffer(
        buffer: Buffer,
        filename?: string,
        opts: UploadApiOptions = {},
    ): Promise<UploadApiResponse> {
        return new Promise((resolve, reject) => {
        const upload = this.cloudinary.uploader.upload_stream(
            {
            folder: process.env.CLOUDINARY_FOLDER ?? 'suara',
            resource_type: 'auto', 
            filename_override: filename,
            use_filename: true,
            unique_filename: true,
            ...opts,
            },
            (err, result) => {
        if (err) return reject(new BadRequestException(err.message));
            resolve(result!);
            },
        );
        Readable.from(buffer).pipe(upload);
        });
    }

    deleteByPublicId(publicId: string) {
        return this.cloudinary.uploader.destroy(publicId, { resource_type: 'image' });
    }
}
