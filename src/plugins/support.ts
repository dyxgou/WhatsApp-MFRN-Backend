import fp from 'fastify-plugin'
import * as mongoose from "mongoose"
import { ChatModel, IChat } from '../models/ChatModel'
import { IMessage, MessageModel } from '../models/MessageModel'
import { IUser, UserModel } from '../models/UserModel'
import * as Pusher  from 'pusher'

export interface SupportPluginOptions {
  // Specify Support plugin options here
}

// The use of fastify-plugin is required to be able
// to export the decorators to the outer scope
export default fp<SupportPluginOptions>(async (fastify, opts) => {
  fastify.decorate('someSupport', function () {
    return 'hugs'
  })

  const uri : string = process.env.MONGO_URL || ""

  const db = await mongoose.connect(uri).then((conn) =>
    {
      fastify.decorate("store" , {
        Message : mongoose.model("messages" , MessageModel),
        Chat : mongoose.model("chats" , ChatModel),
        User : mongoose.model("users" , UserModel),
        db : conn
      })

      fastify.log.info("Mongo Connected to the DB")
      return conn
    })

  if(!db)
  {
    throw new Error("Error to connect with the DB")
  }

  
  fastify.decorate("pusher" , new Pusher({
    appId : process.env.PUSHER_APP_ID || "",
    key : process.env.PUSHER_APP_KEY || "",
    secret : process.env.PUSHER_APP_SECRET || "",
    cluster : "us2",
    useTLS : true
  }))


})

// When using .decorate you have to specify added properties for Typescript
declare module 'fastify' {
  export interface FastifyInstance {
    someSupport(): string;

    store : 
    {
      Message : mongoose.Model<IMessage>,
      Chat : mongoose.Model<IChat>,
      User : mongoose.Model<IUser>,
      db : typeof mongoose
    },

    pusher : typeof Pusher
  }
}
