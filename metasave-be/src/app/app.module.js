import { Module } from '@nestjs/common';
import { AAModule } from './aa/aa.module';

@Module({
  imports: [AAModule]
})
export class AppModule {}