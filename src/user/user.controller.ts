/* eslint-disable @typescript-eslint/no-inferrable-types */
/* eslint-disable @typescript-eslint/adjacent-overload-signatures */
/* eslint-disable prettier/prettier */

import { Body, Controller, Get, Param, Patch, Post, Put, Req, Res, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiConsumes } from '@nestjs/swagger';
//import { ApiBody } from '@nestjs/swagger';


import path from 'path';
import { CommonResponseModel } from 'src/auth/app-service-data';
import { GetUser } from 'src/auth/user.decorator';
import { UserService } from '../user/user.service';
import { ChangePasswordDTO, CreateUserDto, PushNotificationDTO, UsersUpdateDTO } from './dto/createuser.dto';
import { User } from './schemas/user.schema';
// export const ApiFile = ({name: 'file', required: true, description: 'Category/Product image'}): MethodDecorator => (
//   target: any,
//   propertyKey: string,
//   descriptor: PropertyDescriptor,
// ) => {
//   ApiBody({
//     schema: {
//       type: 'object',
//       properties: {
//         [fileName]: {
//           type: 'string',
//           format: 'binary',
//         },
//       },
//     },
//   })(target, propertyKey, descriptor);
// };

@Controller('user')
export class UserController {
    constructor(private readonly usersService: UserService) {}

    @Post()
  create(@Body() CreateUserDto: CreateUserDto): Promise<CommonResponseModel> {
    return this.usersService.create(CreateUserDto);
    console.log('post ', CreateUserDto);
  }
  @Post('signup')
  signup(@Body() CreateUserDto: CreateUserDto): Promise<CommonResponseModel> {
    return this.usersService.signup(CreateUserDto);
    console.log('post ', CreateUserDto);
  }
  @Get('/verify/:token')
  public async verifyUserAccount(@Param('token') token: string,@Body() CreateUserDto: CreateUserDto,) {
  
    return this.usersService.verifyacc(token,CreateUserDto);
   
}
  @Post('/login')
    public validateUser(@Body() CreateUserDto: CreateUserDto): Promise<CommonResponseModel> {
        return this.usersService.Login(CreateUserDto);
    }
    @Get('show')
    findAll(): Promise<User[]> {
      return this.usersService.findAll();
    }
    @Post('/send/pushnotification/all')
    public sendPushNotificationtToAlluser(@Body() data:PushNotificationDTO): Promise<CommonResponseModel> {
        return this.usersService.pushNotificatioalToAllusers(data);
    }
    @Get('/verify/email/:verificationId')
    public async verifyUser(@Param('verificationId') verificationId: string) {
      return this.usersService.verifyEmail(verificationId);
        // if (response.response_code === 200) {
        //     res.sendFile(path.resolve('src/templates/success.html'));
        // } else {
        //     res.sendFile(path.resolve('src/templates/error.html'));
        // }
    }
    @Patch('/update/profile')
    public updateProfile(@GetUser() user: CreateUserDto["_id"], @Body() userInfo: UsersUpdateDTO): Promise<CommonResponseModel> {
        return this.usersService.updateUserInfo(user, userInfo);
    }
    @Put(':id')
  update(
    @Param('id') id: string,
    @Body() CreateUserDto: Partial<CreateUserDto>,
  ) {
    return this.usersService.update(id, CreateUserDto);
  }
  @Post('/change-password')
 
  public changePassword(@GetUser() user: CreateUserDto, @Body() passwordData: ChangePasswordDTO): Promise<CommonResponseModel> {
      return this.usersService.changePassword(user, passwordData);
  }
  
  // @Post('/upload/profile')
  // @UseInterceptors(FileInterceptor('file'))
  // @ApiConsumes('multipart/form-data')
  // @ApiImplicitFile({name: 'file', required: true, description: 'Category/Product image'})
  // public uploadFile(@UploadedFile() file): Promise<CommonResponseModel> {
  //     return this.usersService.reSizeProfilePic(file, 'User');
  // }
  // @Post('upload')
  // // @ApiConsumes('multipart/form-data')
  // // @ApiFile()
  // @UseInterceptors(FileInterceptor('image'))
  // uploadFile(@UploadedFile() file,@Res() Res) {
  //   console.log(Res);
  
  // }
  // @Get('imgpath')
  // seeUploadedFile(@Param('imgpath') image,@Res() Res){
  //   return Res.sendFile(image,{root:'uploads'})

  // }
  @Post('upload/image')
  uploadFile( @UploadedFile()file,@Res() Req): Promise<CommonResponseModel>  {
    if(!Req.file) {
        return Req.status(500).send({ message: 'Upload fail'});
    } else {
      // Res.body.imageUrl = 'http://192.168.0.7:3000/images/' + Res.file.filename;
      // .create(Res.body, function (err, gallery) {
      //       if (err) {
      //           console.log(err);
      //           return next(err);
      //       }
      //       Res.json(gallery);
      //   });
    }
};
@Get(':id')
read(@Param('id') id: string){
  return this.usersService.read(id)

}
  //   @Get()
  // @UseGuards(AuthGuard('google'))
  // async googleAuth(@Req() req) 

  // @Get('redirect')
  // @UseGuards(AuthGuard('google'))
  // googleAuthRedirect(@Req() req) {
  //   return this.usersService.googleLogin(req)
  // }
}
