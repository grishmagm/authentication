/* eslint-disable prettier/prettier */
import { HttpModule, Module } from '@nestjs/common';
import { UploadService } from './upload.service';
import { UploadController } from './upload.controller';
import { PassportModule } from '@nestjs/passport';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    HttpModule,
  ],
  providers: [UploadService],
  controllers: [UploadController]
})
export class UploadModule {}
