import { hash , genSalt, compare } from "bcrypt"

export const hashPassword = async(password : string) : Promise<string> =>
{
  if(!password)
  {
    throw new Error("We lack the password")
  }
  const salt = await genSalt(10)
  const hashedPassword = await hash(password , salt)

  return hashedPassword
}


export const comparePassword = async(password : string , hashedPassword : string | undefined) : Promise<boolean>  =>
{
  if(!hashedPassword)
  {
    hashedPassword ?? "THISISANINVALIDPASS"
    return false 
  }

  const isValidPassword = await compare(password , hashedPassword)  
  return isValidPassword
}