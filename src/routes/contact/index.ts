import { FastifyPluginAsync } from "fastify";
import { GetContactParams , GetChatRequest, AcceptRequestParams, AcceptRequestBody } from "./types";
import { isPending } from "../../utils/userMethods";



const contact : FastifyPluginAsync = async(fastify , options) =>
{
  // Get Contacts
  fastify.get<{Params : GetContactParams}>("/getc/:userId" , async(request , reply) => 
  {
    const { userId } = request.params

    if(!userId)
    {
      throw fastify.httpErrors.unauthorized("The user id must be defined") 
    }

    await fastify.store.User.findById(userId , {
      friends : true , _id : false
    }).populate("friends" , {
      avatar : 1 , name : 1
    }).then(friendsData => {
      return reply.status(200).send(friendsData)
    }).catch(err => {
      throw fastify.httpErrors.badRequest(err) 
    })
  })

  // Get Chat Contact
  fastify.get<{ Querystring : GetChatRequest }>("/getchat" , async(request , reply) =>
  {
    const { uOne , uTwo } = request.query

    if(!uOne || !uTwo)
    {
      return reply.status(400).send("Invalid query strings params")
    }

    await fastify.store.Chat.findOne({
      $or : 
      [
        { users : [ uOne , uTwo ] },
        { users : [ uTwo , uOne ] }
      ]
    }).populate("messages" , {
      
    }).then(chatData =>
      {
        return reply.status(200).send(chatData)
      }
    ).catch(err =>
      {
        throw fastify.httpErrors.badRequest(err)
      }
    )
  })
  // Accept friends request
  fastify.put<{
    Params : AcceptRequestParams,
    Body : AcceptRequestBody
  }>("/accept/:userid" , async(request , reply) =>
  {
    const { userIdToAccept } = request.body
    const { userid } = request.params

    if(!userid || !userIdToAccept)
    {
      throw fastify.httpErrors.unauthorized("unauthorized")
    }

    const userAccepting = await fastify.store.User.findById(userid , {
      friends : true , friendsRequest : true
    }).catch(err => {
      throw fastify.httpErrors.badRequest(err)
    })


    const userToAccept = await fastify.store.User.findById(userIdToAccept , {
      friends : true , friendsPending : true
    }).catch(err => {
      throw fastify.httpErrors.badRequest(err)
    })
 
    if(!isPending(userAccepting , userToAccept))
    {
      throw fastify.httpErrors.badRequest("The users must've sent a friends request")
    }

    await userAccepting?.updateOne({
      $push : {
        friends : userToAccept?._id
      },
      $pull : {
        friendsRequest : userToAccept?._id
      }
    }).catch(err => {
      throw fastify.httpErrors.badRequest(err)
    })

    await userToAccept?.updateOne({
      $push : {
        friends : userAccepting?._id
      },
      $pull : {
        friendsPending : userAccepting?._id
      }
    }).catch(err => {
      throw fastify.httpErrors.badRequest(err)
    })

    await fastify.store.Chat.create({
      users : [ userAccepting?._id , userToAccept?._id ]
    }).catch(err => {
      throw fastify.httpErrors.badRequest(err)
    })

    return reply.status(200).send("The users are friends now and the has been created")
  })


  fastify.get<{ Params : GetContactParams }>("/getf/:userId" , async(request , reply) => 
  {
    const { userId } = request.params

    if(!userId){
      throw fastify.httpErrors.unauthorized("unauthorized")
    }
    
   return  await fastify.store.User.findById(userId , {
      friends : true , _id : false
    }).populate("friends" , {
      avatar : 1, name : 1 
    }).then(friendsData => 
      {
      return reply.status(200).send(friendsData)
    }).catch(err =>{
      throw fastify.httpErrors.badRequest(err)
    })

  })  

}


export default contact