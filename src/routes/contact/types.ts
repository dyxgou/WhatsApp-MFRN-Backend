import { Type , Static } from "@sinclair/typebox";


const getContactsRequest = Type.Object(
  {
    userId : Type.String()
  }
)

export type GetContactParams = Static<typeof getContactsRequest>

const getChatRequest = Type.Object(
  {
    uOne : Type.String(),
    uTwo : Type.String()
  }
)

export type GetChatRequest = Static<typeof getChatRequest>


const acceptRequestParams = Type.Object(
  {
    userid : Type.String()
  }
)

export type AcceptRequestParams = Static<typeof acceptRequestParams>

const acceptRequestBody = Type.Object(
  {
    userIdToAccept : Type.String()
  }
)

export type AcceptRequestBody = Static<typeof acceptRequestBody>


const getFriendsParams = Type.Object(
  {
    userId : Type.String()
  }
)

export type GetFriendParams = Static<typeof getFriendsParams>