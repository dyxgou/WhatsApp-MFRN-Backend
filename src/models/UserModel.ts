import * as mongoose from "mongoose"

export interface IUser extends mongoose.Document
{
  // _id
  // __v
  name : string,
  email : string,
  password : string,
  avatar  : string,
  friendsRequest : string[],
  friendsPending : string[],
  friends : string[]
}

export const UserModel = new mongoose.Schema<IUser>(
  {
    name : 
    {
      type : String,
      required :true
    },
    email : 
    {
      type : String,
      required : true,
      unique : true
    },
    password : 
    {
      type : String,
      required : true
    },
    avatar : 
    {
      type : String,
      default : ""
    },
    friendsPending :
    [
      {
        type : mongoose.Types.ObjectId,
        ref : "users"
      }
    ],
    friendsRequest : 
    [
      {
        type : mongoose.Types.ObjectId,
        ref : "users",
      }
    ],
    friends : 
    [
      {
        type : mongoose.Types.ObjectId,
        ref : "users"
      }
    ]
  }
)