/* eslint-disable prettier/prettier */
import * as mongoose from 'mongoose';
import { Prop, Schema } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { BeforeInsert } from 'typeorm';

export type UserDocument = User & Document;

@Schema()
export class User {
   
  @Prop()
  name: string;

 
 
  

  @Prop()
  _id: string;
 

  @Prop()
  email: string;
 
  @Prop()
  
  password: string;

  @Prop()
  
  registrationDate:Date;

  @Prop()
  
  salt: string;

  @Prop()
  
  emailVerified: boolean;

  @Prop()
  
  verificationId: string;

  @Prop()
  token: string;
  response_code: number;

  @Prop()

  verificationDate: Date;
  @Prop()
  verified:boolean;
  @Prop()
  playerId: string;
 
 
  
 

 

 

  @BeforeInsert()
  emailTOLowerCase() {
    this.email = this.email.toLowerCase();
  }
  
 
 
 
}

export const UserSchema = new mongoose.Schema({
   
  name: String,
  email: {
      type:String,
      unique: true,
      required:true,
    },
  password: String,
  registrationDate: Date,
  verificationDate: Date,
  salt: {
    type: String,
  },
  emailVerified: {
    type: Boolean,
  },
  verificationId: {
    type: String,
  },
  token: String,
  verified:Boolean,
  
  confirmpass: String,
  playerId: String,
  firstName: String,
  lastName: String,
  mobileNumber: String,
  otp: Number,
  profilePic: String,
  profilePicId: String,
  filePath:String,
  mobileNumberverified: Boolean,
  status:Boolean,
  
 
} , { timestamps: true },);
