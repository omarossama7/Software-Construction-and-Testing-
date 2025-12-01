import {Prop,Schema, SchemaFactory} from '@nestjs/mongoose';
import {Document} from 'mongoose';
import * as mongoose from 'mongoose';

export type UserDocument = User & Document;

export interface Bill {
  id: string
  title: string
  amountNeeded: number
  amountDeposited: number
  dueDate: string
}

export interface Investment {
  id: string
  title: string
  amountNeeded: number
  amountDeposited: number
}

export interface Spending {
  id: string
  title: string
  amountDeposited: number
}

export interface InvestmentCategory {
  id: string
  name: string
  percentage: number
  description: string
}

@Schema()
export class User{

    @Prop({
        required: true,
        unique: true,
        default: () => new mongoose.Types.ObjectId().toString()
    })
    id: string;

    @Prop()
    firstName: string;

    @Prop()
    lastName: string;

    @Prop({
        required: true,
        unique: true,
        validate:{
        validator: function(email:string){
            return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
        },
        message: "Please Enter A Valid Email"
}})
    email: string;

@Prop({ 
    required: true,
    validate: {
        validator: function(pass: string) {
            return pass.length >= 8;
        },
        message: 'Password must be at least 8 characters'
    }
})
password: string;

    @Prop({validate: {
        validator: function(url: string){
        if(!url) return true;
          try {
          new URL(url);
          return /\.(jpg|jpeg|png|gif|webp|svg)$/i.test(url);
        } catch {
          return false;
        }
      },
      message: 'Profile picture must be a valid image URL (jpg, jpeg, png, gif, webp, svg)'
        }
})
    prof_pic: string;

    @Prop({default: 'USD'})
    currency: string;

    @Prop({default: 0, min: 0})
    salary: number;

    @Prop({type: [Object], default: []})
    bill: Bill[];

    @Prop({type: [Object], default: []})
    investment: Investment[];

    @Prop({type: [Object], default: []})
    spending: Spending[];

}

export const UserSchema = SchemaFactory.createForClass(User);