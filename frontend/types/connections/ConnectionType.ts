type ConnectionUserType = {
  id: string,
  username: string,
  firstname: string,
  lastname: string,
  bio: string
  avatar: string,
  isFollowing: boolean
}

type ConnectionResponse = {
  data: ConnectionUserType[],
  nextCursor: string,
  hasNext: string
}
