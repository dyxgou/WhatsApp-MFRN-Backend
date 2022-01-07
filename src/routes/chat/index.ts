import { FastifyPluginAsync } from "fastify"
import { GetChatQueryParams } from "./type"

const chat : FastifyPluginAsync = async(fastify , options) => 
{
  fastify.get<{Querystring: GetChatQueryParams}>("/getc", async (request, reply) => {
    const {uOne, uTwo} = request.query;

    if (!uOne || !uTwo) {
      throw fastify.httpErrors.unauthorized("unauthorized")
    }

    return await fastify.store.Chat.findOne({
      $or : [
        { users : [ uOne , uTwo ] },
        { users : [ uTwo , uOne ] }
      ]
    }).then(chatData => {
      return reply.status(200).send(chatData)
    }).catch(err => {
      throw fastify.httpErrors.badRequest(err)
    })
  })

  
}

export default chat


