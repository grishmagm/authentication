/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { CompanyService } from './company.service';
import { CompanyController } from './company.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { PassportModule } from '@nestjs/passport';
import { CompanySchema } from './schemas/company.schema';


@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Comapany', schema: CompanySchema }, 
     
     ]),
    // JwtModule.register({
    //   secret: globalConfig.secret,
    //   signOptions: {
    //     expiresIn: '3h',
    //   },
    // }),
    PassportModule.register({ defaultStrategy: 'jwt' }),
  ],
  providers: [CompanyService],
  controllers: [CompanyController],
})
export class CompanyModule {}
