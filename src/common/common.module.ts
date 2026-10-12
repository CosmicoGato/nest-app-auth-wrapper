import { Module } from '@nestjs/common';
import { DatabaseHelpers } from './providers/database-helpers.js';

@Module({
  providers: [DatabaseHelpers],
  exports: [DatabaseHelpers]
})
export class CommonModule { }
