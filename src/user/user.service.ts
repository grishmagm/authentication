/* eslint-disable prefer-const */
/* eslint-disable @typescript-eslint/no-inferrable-types */
/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable no-var */
/* eslint-disable prettier/prettier */

import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { Connection, Model } from 'mongoose';
import { AuthService } from 'src/auth/auth.service';
import { JwtService } from 'src/jwt/jwt.service';
import { ChangePasswordDTO, CreateUserDto, PushNotificationDTO, UsersUpdateDTO } from './dto/createuser.dto';
import { User, UserDocument } from './schemas/user.schema';
import * as uuid from 'uuid/v1';
import {CommonResponseModel,globalConfig} from '../auth/app-service-data';
import config from '../config/keys';
import { UploadService } from 'src/upload/upload.service';
//import multer from 'multer';
const GeneralService = require('../auth/general-service');
const jwt = require('jsonwebtoken');
const fs=require('fs');
var multer  = require('multer');
const resizeImg = require('resize-img');
let s3;
var generator = require('generate-password');
const mailgun = require("mailgun-js");
const DOMAIN = 'sandbox6574f7eb76df42bfbf6ece8ba884582f.mailgun.org';
const mg = mailgun({apiKey: config.MAILGUN_APIKEY, domain: DOMAIN});

@Injectable()
export class UserService {
    constructor(@InjectModel('User') private readonly userModel:Model<UserDocument>,private utilService: UploadService, private jwtService: JwtService,
    private authService: AuthService,@InjectConnection() private connection: Connection){}

    private months: Array<string> = [
        'January',
        'February',
        'March',
        'April',
        'May',
        'June',
        'July',
        'August',
        'September',
        'October',
        'November',
        'December',
    ];

    async create(createUserDto: CreateUserDto): Promise<CommonResponseModel> {

        console.log("user created");
        
        const createdUser = new this.userModel(createUserDto);
        const email= createUserDto.email
        const  exist = await this.userModel.findOne({email: createUserDto.email});
        if(exist){
            console.log("already user")
            throw new HttpException('user already exist', HttpStatus.UNAUTHORIZED);
        }
        var password = generator.generate({
            length: 4,
            numbers: true,
            symbols:false,
            lowercase:false,
            uppercase:false,
        });
        if(password){
            console.log(password);
           
        }
        const token = jwt.sign(createUserDto,config.JWT_ACC_ACTIVATE,{expiresIn: '20m'});
        console.log(token);
        // const data = {
        //     from: 'grishma@kibtechnologies.com',
        //     to: email,
        //     subject: 'Account Activation Link',
        //    html:`
        //    <h2> please click on given link to activate you account</h2>
        //    <p>${config.CLIENT_URL}/authentication/activate/${token}</p>
        //    `
        // };
        // if(password){
            console.log(password)
            console.log(password);
            const {salt, hashedPassword} = await this.authService.hashPassword(createUserDto.password);
            console.log("Getting created")
            
            createUserDto.salt = salt;
            createUserDto.password = hashedPassword;
            console.log(createUserDto.password)
            createUserDto.registrationDate = new Date();
            const verificationId = uuid();
            console.log(verificationId,"verification")
           
            createUserDto.verificationId = verificationId;
            const playerId = uuid();
            console.log(playerId,"playerId")
            createUserDto.playerId = playerId;
            createUserDto.emailVerified = false;
            createUserDto.verified = false;
            console.log(Date.now());
    
            const response = await this.userModel.create(createUserDto);
         
            //  const data = {
            //     from: 'grishma@kibtechnologies.com',
            //     to: email,
            //     subject: 'Account Activation OTP',
            //    html:`
            //    <h2> OTP</h2>
            //    <p>${config.CLIENT_URL}/authentication/activate/${token}</p>`
               
            // };
           

        // }
        // console.log(`${config.CLIENT_URL}/authentication/activate/${token}`);
        // mg.messages().send(data, function (error, body) {
        //     console.log(body)
        //     if(error){
        //         return error
        //     }
        //     console.log(body);
        //     return body
            
        // });
        if (response._id) {
            const {body, subject, htmlData} = this.getEmailVerificationFields(verificationId);
            const emailRes = await this.utilService.sendEmail(response.email, subject, body, htmlData);
        //    console.log(await this.utilService.sendEmail(response.email, subject, body, htmlData))
        //     console.log(emailRes.length);
           
            if (emailRes) {
                return  {
                    response_code: HttpStatus.CREATED,
                    data:'  verification link is sent your email',

                  };
            } else {
                 return {
                    response_code: HttpStatus.CREATED,
                    data: {message: 'Account created successfully'},
                 };
            }
        }
        
      }
      public async Login(CreateUserDto: CreateUserDto): Promise<CommonResponseModel> {
      
        // CreateUserDto=CreateUserDto.email.toLowerCase();
        console.log("login running")
        const userData: CreateUserDto = await this.userModel.findOne({email: CreateUserDto.email});
         console.log(userData)
        if (!userData) {

            return {
                response_code: HttpStatus.UNAUTHORIZED,
                data: `User  ${CreateUserDto.email} is not registered`,
            };
        }
        console.log(CreateUserDto.password)
        const passwordMatch = await this.authService.verifyPassword(CreateUserDto.password, userData.password);
       console.log(passwordMatch)
        const body = {
            token: null,
            _id: null,
        };
        if (passwordMatch) {
            if (passwordMatch && userData.email) {
                body._id = CreateUserDto._id;
                body.token = await this.authService.generateAccessToken(userData._id);
                return {response_code: HttpStatus.OK, data: body};
            } else {
                return {
                    response_code: HttpStatus.UNAUTHORIZED,
                    data: 'Enter a valid password',
                };
            }
        }
    }
    public async verifyEmail(
        verificationId: string,
    ): Promise<CommonResponseModel> {
        const userInfo = (await this.userModel.findOne({verificationId})) as CreateUserDto;
        if (userInfo) {
            userInfo.emailVerified = true;
            const res = await this.userModel.findByIdAndUpdate(
                userInfo._id,
                userInfo,
            );
            return {
                response_code: HttpStatus.OK,
                data: 'Email verified successfully',
            };
        } else {
            return {
                response_code: HttpStatus.UNAUTHORIZED,
                data: 'Could not verify user. Invalid token',
            };
        }
    }
    public async verify(
        token: string,
    ): Promise<CommonResponseModel> {
    // const{tokenn} = token;
    if(token){
        jwt.verify(token, config.JWT_ACC_ACTIVATE, async function(err,decodedToken){
            if(err){
                return err;
            }
            const {name,email,password} = decodedToken;
            const  exist = await this.userModel.findOne({email: CreateUserDto.email});
            if(exist){
                return {name,email,password}
            }
            else{
                return {name,email,password}
            }
        // const newUser = new this.userModel({name,email,password});
            // newUser.save((err,success)=>{
            //     if(err){
            //         console.log("error in signup", err);
            //         return err;
            //     }
            //     else{
            //         return success;
            //     }
            // })
      

        });

    }else{
        return 
    }

    }
    googleLogin(req) {
        if (!req.user) {
          return 'No user from google'
        }
    
        return {
          message: 'User information from google',
          user: req.user
        }
      }
      private getEmailVerificationFields(verificationId: string) {
       
        const body: string =
            'Registration has been successful. Please follow the link to verify your email';
        const subject: string = 'Account verification';
        let htmlData: string = '';
        let url: string = '';
        
        // if (process.env.NODE_ENV === 'production') {
            url=config.CLIENT_URL+`email/${verificationId}`
            console.log(url)
            htmlData = `    <p>${body}</p><br>
                            <a href="${url}" target="_blank">VERIFY ACCOUNT</a>
                        `;
      
      
        return {body, subject, htmlData};
    }
    async signup(createuserDto: CreateUserDto): Promise<CommonResponseModel>{
        console.log(createuserDto);
      
        
        const verificationId = uuid();
        console.log(verificationId,"verification")
        createuserDto.verificationId = verificationId;
        createuserDto.verified = false;
        console.log(createuserDto.verified)
        const{_id,email,password,verified} = createuserDto;


        const  exist = await this.userModel.findOne({email: createuserDto.email});
        console.log(exist)
            if( exist){
                console.log("already user")
                throw new HttpException('user already exist', HttpStatus.UNAUTHORIZED);
            }
            const token = jwt.sign({_id,email,password,verificationId,verified},config.JWT_ACC_ACTIVATE);
            // const response = await this.userModel.create(createuserDto);
            const data = {
                from: 'grishma@kibtechnologies.com',
                to: email,
                subject: 'Account Activation Link',
               html:`
               <h2> please click on given link to activate you account</h2>
               <p>${config.CLIENT_URL}/authentication/activate/${token}</p>
               `
            };
            const success= "email sent successfully  "
            mg.messages().send(data, function (error, body) {
                
                if(error){
                    return error
                }
                createuserDto.verified = true;
                return body;
               
            });
            const verification = this.verifyacc(token,createuserDto);
            console.log(verification,"verification")

        if(verification) 
         {
          
            createuserDto.verificationDate= new Date();
            console.log(new Date())
            createuserDto.emailVerified= true;
              const response = await this.userModel.create( createuserDto);
              return {response_code: HttpStatus.OK, data: response};
        }

            return token;
    }
    async verifyacc(tokenn: CreateUserDto["token"],CreateUserDto:CreateUserDto):Promise<CommonResponseModel>{
        console.log(CreateUserDto);
        
      
        // const{token} = tokenn;
        if(tokenn){
            console.log(tokenn)
           
            jwt.verify(tokenn, config.JWT_ACC_ACTIVATE, async function(err,decodedToken){
                if(err){
                    console.log(err)
                    return err;
                }
                console.log(decodedToken)
                const {_id,email,password,verificationId,verified} = decodedToken;
                console.log(_id);
                console.log(email);
                console.log(password);
                console.log(verificationId)
                console.log(verified,"verified");
               
              
              
            // if(exist){
            //     console.log("already user")
            //     throw new HttpException('user already exist', HttpStatus.UNAUTHORIZED);
            // }
        
          
            if (verificationId&&verified!=false) {
                console.log(verified)
                console.log("working");
                CreateUserDto.emailVerified = true;
                console.log(CreateUserDto.emailVerified);
              
                return {response_code: HttpStatus.OK, data: true};
            }
            else{
                CreateUserDto.emailVerified = false;
                console.log(verified,"verified else")
                return {response_code: HttpStatus.UNAUTHORIZED, data: false};
            }
               
               
            }
        );
            // const response = await this.userModel.findByIdAndUpdate(CreateUserDto._id,CreateUserDto.verificationId);
            // console.log(response)
            // return response
                // let newUser = new User({name,email,password});
                // newUser.save((err,success)=>{
                //     if(err){
                //         console.log("error in signup", err);
                //         return res.status(400), json({error:'error  activating account'})
                //     }
                //     res.json({
                //         message: "signup successfull"
                //     })
                // })
            
    
          
    
        }else{
            CreateUserDto.emailVerified = false;
            console.log(CreateUserDto.emailVerified,"verified else")
            return {response_code: HttpStatus.UNAUTHORIZED, data: false};
        }
      
    }
    async findAll(): Promise<User[]> {
        return this.userModel.find().exec();
      }
      async read(_id: string) {
        console.log(_id);
        return await this.userModel.find({ _id });
      }
      public async pushNotificatioalToAllusers(data:PushNotificationDTO): Promise<CommonResponseModel> {
        try{
           
        const userData=await this.userModel.find({},'playerId')
        console.log("USER DATA : "+userData+" DATA : "+data);
        let deviceArr:any=[]
         deviceArr= userData.map(element => element.playerId),
         console.log("Device DATA : "+deviceArr);
        deviceArr.forEach(function (value) {
                 GeneralService.orderPushNotification([value], data.mssg, data.title);
        });

        return {
            response_code: HttpStatus.OK,
            data:"successfully sended to all Users"
        };
    }
    catch(e){
        return{
            response_code:HttpStatus.BAD_REQUEST,

           data:e.message
        }
    }
    }
    public async updateUserInfo(
        userId: string,
        userData: UsersUpdateDTO,
    ): Promise<CommonResponseModel> {
        const res = await this.userModel.findByIdAndUpdate(userId, userData);
        console.log(userId)
        return {
            response_code: HttpStatus.OK,
            data: 'Profile updated successfully',
        };
    }
    async update(
        _id: string,
        CreateUserDto: Partial<CreateUserDto>,
      ): Promise<User> {
        await this.userModel.updateOne({ _id }, CreateUserDto);
        console.log(CreateUserDto);
        return await this.userModel.findOne({ _id });
      }
      public async changePassword(user: CreateUserDto, passwordData: ChangePasswordDTO,): Promise<CommonResponseModel> {
        const passwordMatch = await this.authService.verifyPassword(passwordData.currentPassword, user.password);
        if (!passwordMatch) {
            return {
                response_code: HttpStatus.UNAUTHORIZED,
                data: 'You have entered an incorrect current password',
            };
        } else {
            const {salt, hashedPassword} = await this.authService.hashPassword(
                passwordData.newPassword,
            );
            user.salt = salt;
            user.password = hashedPassword;
            const response = await this.userModel.findByIdAndUpdate(user._id, user);
           
            console.log(response);
            return {
                response_code: HttpStatus.OK,
               
                data: 'You have successfully changed your password',
            };
        }
    }
    private getFolderName(file, type: string, picType: string) {
        const month = this.months[new Date().getMonth()];
        const currentYear = new Date().getFullYear();
        const uniqueId = uuid();
        const fileName = `${picType}${file.originalname}`;
        return `${type}/${month}-${currentYear}/${uniqueId}${fileName}`;
    }
    public async resizeFunction(buffer, width, height) {
        const image = await resizeImg(buffer, {
            width: width,
            height: height,
        });
        return image;
    }
    public async resizeUploadFunction(file, buf, type, picType) {
        const params = {
            Bucket: "process.env.BUCKET_NAME",
            Body: buf,
            Key: this.getFolderName(file, type, picType),
            ACL: 'public-read',
        };
        const response = await s3.upload(params).promise();
        if (response.Location) {
            return {url: response.Location, key: response.Key};
        } else {
            return false;
        }
    }
    public async reSizeProfilePic(file, type: string) {
        console.log(file)
        let profile_resize_Buf = await this.resizeFunction(file.buffer, 200, 200);
        
        let profileImage = await this.resizeUploadFunction(
            file,
            profile_resize_Buf,
            type,
            '_profile_',
        );
        if (profileImage) {
            return {response_code: HttpStatus.OK, data: profileImage};
        } else {
            return {
                response_code: 400,
                data: {message: 'Something went wrong'},
            };
        }
    }
    // resizeUploadFunction(file: any, profile_resize_Buf: void, type: string, arg3: string) {
    //     throw new Error('Method not implemented.');
    // }
    // resizeFunction(buffer: any, arg1: number, arg2: number) {
    //     throw new Error('Method not implemented.');
    // }
     storage = multer.diskStorage({
       
        destination: (req, file, cb) => {
            console.log("running");
          cb(null, './public/images');
        },
        filename: (req, file, cb) => {
          console.log(file);
          var filetype = '';
          if(file.mimetype === 'image/gif') {
            filetype = 'gif';
          }
          if(file.mimetype === 'image/png') {
            filetype = 'png';
          }
          if(file.mimetype === 'image/jpeg') {
            filetype = 'jpg';
          }
          cb(null, 'image-' + Date.now() + '.' + filetype);
        }
    });
    
     upload = multer({storage: this.storage});


     
}
