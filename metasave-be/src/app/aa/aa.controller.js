import { Controller, Dependencies, Get, Post, Put, Delete, Req } from '@nestjs/common';
import { AAService } from './aa.service';

@Controller('aa')
@Dependencies(AAService)
export class AAController {
    constructor(aaService) {
        this.aaService = aaService;
    }

    @Post()
    runFunction() {
        return this.aaService.helloWorld();
    }
}