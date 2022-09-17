import { verifyAccessJWT } from "../helpers/jwtHelper.js";

export const userAuthorization = async (req, res, next) => {
  //get accessJWT from header
  const { authorization } = req.headers;
  console.log(authorization);

  if (authorization) {
    //verify if jwt is valid
    const decoded = verifyAccessJWT(authorization);
    console.log(decoded);
    if (decoded === "jwt expierd") {
      return res.status(403).json({
        status: "error",
        message: "Forbidden",
      });
    }
    if (decoded?.email) {
      // check if jwt exists in db
    }
    // extract user id
    //get user profile based on the id
  }
  next();
};
