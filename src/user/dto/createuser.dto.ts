/* eslint-disable prettier/prettier */

export class CreateUserDto {
    
  _id: string;
     name: string;
     
   
     email: string;
     password: string;
    registrationDate: Date;
    verificationDate: Date;
    salt: string;
    emailVerified: boolean;
    verificationId: string;
    
    static email: any;
    static emailVerified: any;
    token: string;
    verified:boolean;
    playerId: string;
  
    
    
  }
  export class PushNotificationDTO{
    title:string;
    mssg:string;
    couponecode:string
  }
  export class UsersUpdateDTO {
   
    _id: string;
  
   
   
    firstName: string;
  
   
   
    lastName: string;
  
   
   
   
    mobileNumber: string;
  
  
   
    otp: number;
  
   
    profilePic: string;
  
    
    profilePicId: string;
  
   
    filePath:string;
  
   
    registrationDate: Date;
  
   
    emailVerified: boolean;
  
   
    mobileNumberverified: boolean;
  
   
    verificationId: string;
  
   
  
   
    
  
   
    
  
   
   
  
    
    
   
   
    playerId:string
    status:boolean
   
  }
  export class ChangePasswordDTO {
   
    currentPassword: string;
  
   
    newPassword: string;
  
   
    confirmPassword: string;
  }