import { Type , Static } from "@sinclair/typebox";

const registerRequest = Type.Object(
  {
    name : Type.String(),
    password : Type.String(),
    email : Type.String()
  }
)


export type RegisterBody = Static<typeof registerRequest>

const loginRequest = Type.Object(
  {
    email : Type.String(),
    pass : Type.String()
  }
)

export type LoginQuery = Static<typeof loginRequest>


