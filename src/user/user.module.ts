/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PassportModule } from '@nestjs/passport';
import { MulterModule } from '@nestjs/platform-express';
import{UserSchema}  from './schemas/user.schema';
@Module({
    imports: [
        MongooseModule.forFeature([{ name: 'Users', schema: UserSchema }, 
       
         
         ]),
         MulterModule.register({
           dest:'./uploads'
         }),
        // JwtModule.register({
        //   secret: globalConfig.secret,
        //   signOptions: {
        //     expiresIn: '3h',
        //   },
        // }),
        PassportModule.register({ defaultStrategy: 'jwt' }),
      ],
})
export class UserModule {

}
