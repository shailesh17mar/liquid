import { OAuth2Client } from "google-auth-library";
import jwt, { JwtPayload } from "jsonwebtoken";
import AuthToken from "./types/AuthToken";
const CLIENT_ID =
  "1077167489512-so5ln69eqbbjqpckatnmt9hf8kbues2b.apps.googleusercontent.com";
const client = new OAuth2Client({
  clientId: CLIENT_ID,
  clientSecret: "I6q9bDLUG5AkDyMB9UAFfu7f",
});
//
// type Auth = {
//   isAuthenticated: boolean;
//   id?: string;
//   name?: string;
// };
const authHandler = async (token: any): Promise<any | null> => {
  try {
    // const ticket = await client.verifyIdToken({
    //   idToken: token,
    //   audience: CLIENT_ID,
    // });
    const user = jwt.decode(token) as JwtPayload;
    return {
      sub: user.sub,
      iat: user.iat,
      iss: user.iss,
      exp: user.exp,
      aud: user.aud,
      picture: user.picture,
      name: user.name || undefined,
    };
  } catch (error) {
    console.error(error);
    return null;
  }
};

export default authHandler;
