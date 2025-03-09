import { Controller, Get } from '@nestjs/common';
import { GemaService } from './gema.service';

@Controller('gemas')
export class GemaController {
    constructor(private readonly gemasService: GemaService) {}

    @Get()
    async getAllGemas() {
        return this.gemasService.getAllGemas();
    }
}
