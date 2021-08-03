export interface AuthToken {
  sub: string
  iat: number
  iss: string
  exp: number
  aud: string
  name?: string
  picture?: string
}

export default AuthToken

