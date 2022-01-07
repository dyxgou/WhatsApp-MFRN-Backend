import { Schema , Document } from "mongoose";

export interface IMessage extends Document
{
  userId : string,
  content : string,
  timestamp : Date,
}


export const MessageModel = new Schema<IMessage>(
  {
    content: {
      type : String,
      required : true
    },
    timestamp : 
    {
      type: Date,
      required : true
    },
    userId : 
    {
      type : String,
      required : true
    }
  }
)

