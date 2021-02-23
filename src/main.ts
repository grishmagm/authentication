/* eslint-disable prettier/prettier */
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { UserModule } from './user/user.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  await app.listen(4000);

  // let Options;
  // if(process.env.Noce_ENV ==='production'){
  //   Options = new DocumentBuilder().setTitle("captain api").addServer('/').setVersion('v1').addCookieAuth().build()
  // }
//   else{
// Options = new  DocumentBuilder().setTitle("captain ").addServer('/').setVersion('v1').addBearerAuth().build()
//   }
//  const document = SwaggerModule.createDocument(app,Options,{ignoreGlobalPrefix:true,include:[AppModule,UserModule]});
//  SwaggerModule.setup('/explorer',app,document);

 
 
 
  await app.listen(process.env.PORT || 4000);
  console.log('http://localhost:4000/explorer/#/')
}
bootstrap();
