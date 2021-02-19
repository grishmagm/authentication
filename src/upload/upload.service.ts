/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import config from '../config/keys';
const jwt = require('jsonwebtoken');
import * as uuid from 'uuid/v1';

const mailgun = require("mailgun-js");
const DOMAIN = 'sandbox6574f7eb76df42bfbf6ece8ba884582f.mailgun.org';
const mg = mailgun({apiKey: config.MAILGUN_APIKEY, domain: DOMAIN});

const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(config.SENDGRID_KEY);

@Injectable()
export class UploadService {
    constructor(){}

    public async sendEmail(email: string, subject: string, body: string, html?: string): Promise<any> {
      
        const msg = {
            to: email,
            from: 'suryawanshigrishma32@gmail.com',
            subject: subject,
            text: body,
            html: html,
        };
       
     
        const response = await sgMail.send(msg);
        console.log("response",response)
        return response;
        // mg.messages().send(msg, function (error, body) {
        //     console.log(body)
        //     if(error){
        //         return error
        //     }
        //     console.log(body);
        //     return body
            
        // });
    }
}
