/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserService } from './user/user.service';
import { UserController } from './user/user.controller';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { MongooseModule } from '@nestjs/mongoose';
import { JwtService } from './jwt/jwt.service';
import config from './config/keys';
import { UserSchema } from './user/schemas/user.schema';
import { UploadModule } from './upload/upload.module';
import { UploadService } from './upload/upload.service';
import { CompanyModule } from './company/company.module';

@Module({
  imports: [UserModule, AuthModule, MongooseModule.forRoot(config.mongoURI),MongooseModule.forFeature([{ name: 'User', schema: UserSchema }]), UploadModule, CompanyModule,],
  controllers: [AppController, UserController],
  providers: [AppService, UserService, JwtService,UploadService],
})
export class AppModule {}
