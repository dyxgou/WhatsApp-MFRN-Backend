type User = 
{
  _id : string,
  friendsRequest : string[],
  friendsPending : string[],
  friends : string[]
}

const isIncludes = (user : User , userId : string) : boolean => 
{
  const {
    friendsPending,
    friends,
    friendsRequest
  } = user

  return friends.includes(userId) || friendsPending.includes(userId) || friendsRequest.includes(userId)
}

export const isAdded = (userOne : User | null , userTwo : User | null) =>
{
  if(!userOne || !userTwo)
  {
    throw new Error("We lack an user")
  }

  const isAdd = isIncludes(userOne , userTwo._id) && isIncludes(userTwo , userOne._id)

  return isAdd
}


export const isPending = (userAccepting : User | null  , userToAccept : User | null ) : boolean =>
{
  if(!userAccepting || !userToAccept)
  {
    throw new Error("We lack information")
  }
  
  const { _id : userOne , friendsRequest } = userAccepting
  const { _id : userTwo  , friendsPending } = userToAccept
  console.log({ userAccepting , userToAccept });
  
  const isAdd : boolean = friendsRequest.includes(userTwo) && friendsPending.includes(userOne)

  return isAdd

}