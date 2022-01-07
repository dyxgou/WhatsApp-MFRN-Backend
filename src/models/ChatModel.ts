import { Schema , Document } from "mongoose";


export interface IChat extends Document
{
  users : string[],
  messages : string[]
}


export const ChatModel = new Schema<IChat>(
  {
    users : 
    [
      {
        type : Schema.Types.ObjectId,
        required : true,
        ref : "users",
      }
    ],
    messages : 
    [
      {
        type : Schema.Types.ObjectId,
        ref : "messages" , 
      }
    ]
  }
)


