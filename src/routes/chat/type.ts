import {Type, Static} from "@sinclair/typebox"


const getChatQueryParams = Type.Object({
    uOne : Type.String(),
    uTwo: Type.String()
})


export type GetChatQueryParams = Static<typeof getChatQueryParams>