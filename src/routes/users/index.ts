import { FastifyPluginAsync } from "fastify";
import { RejectRequestBody, RejectRequestParams, SendRequestBody , SendRequestParams } from "./types"
import { isAdded } from "../../utils/userMethods";

const user : FastifyPluginAsync = async(fastify , opts ) =>
{
  // Send friend request
  fastify.put<{
    Body : SendRequestBody,
    Params : SendRequestParams
  }>("/send/:userid" , async(request , reply) =>
  {
    const { userEmailToAdd } = request.body
    const { userid } =  request.params

    if(!userEmailToAdd || !userid)
    {
      throw fastify.httpErrors.unauthorized("We lack information")
    }

    const userSending = await fastify.store.User.findById(userid , {
      friends : true , friendsPending : true ,  friendsRequest : true
    }).catch(err => {
      throw fastify.httpErrors.badRequest(err)
    })

    const userToAdd = await fastify.store.User.findOne({ email : userEmailToAdd } , {
      friends : true , friendsPending : true , friendsRequest : true
    }).catch(err => {
      throw fastify.httpErrors.badRequest(err)
    })

    if(userSending?.id === userToAdd?.id)
    {
      throw fastify.httpErrors.badRequest("You can't add yourself")
    }

    if(isAdded(userSending , userToAdd))
    {
      throw fastify.httpErrors.badRequest("The users has been added")
    }

    await userSending?.updateOne({
      $push : 
      {
        friendsPending : userToAdd?._id
      }
    }).catch(err => {
      throw fastify.httpErrors.badRequest(err)
    })

    await userToAdd?.updateOne({
      $push : 
      {
        friendsRequest : userSending?._id
      }
    }).catch(err => {
      throw fastify.httpErrors.badRequest(err)
    })

    return reply.status(200).send("The friends request has been sent")    
  })


  // Recject friends request 

  fastify.put<{
    Body : RejectRequestBody,
    Params : RejectRequestParams
  }>("/reject/:userid" , async(request ,  reply) =>
  {
    const { userIdToReject } = request.body
    const { userid } = request.params

    if(!userIdToReject || !userid)
    {
      throw fastify.httpErrors.unauthorized("unauthorized")
    }

    const userRejecting = await fastify.store.User.findById(userid , {
      friendsRequest : true
    }).catch(err => {
      throw fastify.httpErrors.badRequest(err)
    })

    const userToReject = await fastify.store.User.findById(userIdToReject , {
      friendsPending : true
    }).catch(err => {
      throw fastify.httpErrors.badRequest(err)
    })

    const isPending : boolean | undefined = userRejecting?.friendsRequest.includes(userToReject?._id) || userToReject?.friendsPending.includes(userRejecting?._id)

    if(!isPending)
    {
      throw fastify.httpErrors.badRequest("Friend request not found") 
    }

    await userRejecting?.updateOne({
      $pull : 
      {
        friendsRequest : userToReject?._id
      },
      
    }).catch(err => {
      throw fastify.httpErrors.badRequest(err)
    })


    await userToReject?.updateOne({
      $pull : 
      {
        friendsPending : userRejecting?._id
      },
    }).catch(err => {
      throw fastify.httpErrors.badRequest(err)
    })

    return reply.status(200).send("The user has been rejected")
  })
}


export default user

