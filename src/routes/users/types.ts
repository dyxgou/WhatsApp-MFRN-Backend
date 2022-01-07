import { Static , Type } from "@sinclair/typebox"

const sendRequestParams = Type.Object(
  {
    userid : Type.String()// { "type" : string }
  }
)

export type SendRequestParams = Static<typeof sendRequestParams>

const sendRequestBody = Type.Object(
  {
    userEmailToAdd : Type.String({ format : "email" })
  }
)

export type SendRequestBody = Static<typeof sendRequestBody>

const rejectRequestParams = Type.Object(
  {
    userid : Type.String()
  }
)

const rejectRequestBody = Type.Object(
  {
    userIdToReject : Type.String()
  }
)

export type RejectRequestBody = Static<typeof rejectRequestBody>
export type RejectRequestParams = Static<typeof rejectRequestParams>