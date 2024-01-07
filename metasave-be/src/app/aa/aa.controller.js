import { Controller, Dependencies, Get } from '@nestjs/common';
import { AAService } from './aa.service';

@Controller('aa')
@Dependencies(AAService)
export class AAController {
    constructor(aaService) {
        this.aaService = aaService;
    }

    @Get()
    findAll() {
        return this.aaService.helloWorld();
    }
}