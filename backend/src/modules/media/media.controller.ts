import { Controller, Post, UseInterceptors, UploadedFile, ParseFilePipe, MaxFileSizeValidator, FileTypeValidator, Body, DefaultValuePipe } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { MediaService } from './media.service';


@Controller('media')
export class MediaController {
    constructor(private readonly mediaService: MediaService) {}

    @Post('upload')
    @UseInterceptors(FileInterceptor('file')) // field name: "file"
    async upload(
        @UploadedFile(new ParseFilePipe({
        validators: [
            new MaxFileSizeValidator({ maxSize: 8 * 1024 * 1024 }), // 8MB
            new FileTypeValidator({ fileType: /(png|jpg|jpeg|gif|webp|mp4|quicktime)$/ }),
        ],
        })) file: Express.Multer.File,
    ) {
        const result = await this.mediaService.upload(file);
        // shape respons yang rapi untuk FE
        return {
        provider: 'cloudinary',
        publicId: result.public_id,
        url: result.secure_url,
        format: result.format,
        width: result.width,
        height: result.height,
        bytes: result.bytes,
        resourceType: result.resource_type,
        };
    }
}
