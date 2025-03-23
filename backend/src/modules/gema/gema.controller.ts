import { Controller, Get, UseGuards } from '@nestjs/common';
import { GemaService } from './gema.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('gemas')
export class GemaController {
    constructor(private readonly gemasService: GemaService) {}

    @UseGuards(AuthGuard('jwt'))
    @Get('hello')
    async sayHello() {
        return await this.gemasService.sayHello();
    }
    
    @Get('all')
    async getAllGemas() {
        return await this.gemasService.getAllGemas();
    }
}
