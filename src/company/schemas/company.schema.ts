/* eslint-disable prettier/prettier */
import * as mongoose from 'mongoose';
import { Prop, Schema } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { BeforeInsert } from 'typeorm';

export type CompanyDocument = Company & Document;

@Schema()
export class Company {
  
  @Prop()
  companyname: string;

  @Prop()
  email: string;


  @Prop()
  user: string;

 
 
  

 

 

 

 

 

  
  }
  
 
 
 


export const CompanySchema = new mongoose.Schema({
  
  name: String,
  email: String,
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
},
 
} , { timestamps: true },);
