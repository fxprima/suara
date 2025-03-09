import { Controller, Get } from '@nestjs/common';
import { GemaService } from './gema.service';

@Controller('gemas')
export class GemaController {
    constructor(private readonly gemasService: GemaService) {}

    @Get('hello')
    async sayHello() {
        return await this.gemasService.sayHello();
    }
    
    @Get('all')
    async getAllGemas() {
        return await this.gemasService.getAllGemas();
    }
}
