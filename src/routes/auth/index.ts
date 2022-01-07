import { FastifyPluginAsync } from "fastify"
import { comparePassword, hashPassword } from "../../utils/password"
import { LoginQuery, RegisterBody } from "./types"

const auth : FastifyPluginAsync = async(fastify , options) : Promise<void> =>
{
  // Register Route
  fastify.post<{ Body : RegisterBody }>("/register" , async(request , reply) =>
  {
    const { body : userInfo } = request
    const { email , name , password } = userInfo

    if(!email || !name || !password)
    {
      throw fastify.httpErrors.unauthorized("We lack the user info")
    }

    const hashedPassword = await hashPassword(password)
    userInfo.password = hashedPassword
    
    await fastify.store.User.create(userInfo , (err , data) =>
    {
      if(err || !data)
      {
        return reply.status(400).send({
          msg : "Error to create user" , error : err
        })
      }

      return reply.status(201).send(data)
    })
  })

  // Login Route
  fastify.get<{
    Querystring : LoginQuery
  }>("/login" , async(request , reply) : Promise<void> => 
  {
    const { email , pass } = request.query

    if(!email || !pass)
    {
      throw fastify.httpErrors.unauthorized("We lack the user info")
    }

    const user = await fastify.store.User.findOne({ email : email } , {
      email : true , avatar : true , name : true , password : true
    }).catch(err => {
      throw fastify.httpErrors.badRequest(err)
    })

    const isAuth = await comparePassword(pass , user?.password)
    
    if(!isAuth || !user)
    {
      throw fastify.httpErrors.notFound("Invalid credentials")
    }

    return reply.status(200).send(user)
  })
}


export default auth