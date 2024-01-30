import { Module } from '@nestjs/common';
import { AAService } from './aa.service';
import { AAController } from './aa.controller';

@Module({
  controllers: [AAController],
  providers: [AAService],
})
export class AAModule {}