import { verifyAccessJWT } from "../helpers/jwtHelper.js";
import { getSession } from "../models/session/SessionModel.js";
import { getUser } from "../models/user/User.model.js";

export const userAuthorization = async (req, res, next) => {
  try {
    //get accessJWT from header
    const { authorization } = req.headers;

    if (authorization) {
      //verify if jwt is valid
      const decoded = await verifyAccessJWT(authorization);
      console.log(decoded);
      if (decoded === "jwt expired") {
        return res.status(403).json({
          status: "error",
          message: "jwt is expired!",
        });
      }
      if (decoded?.payload) {
        // check if jwt exists in db
        const existInDb = await getSession({
          type: "jwt",
          token: authorization,
        });

        if (existInDb?._id) {
          // extract user id
          const user = await getUser({ email: decoded.payload });
          if (user?._id) {
            //get user profile based on the id
            req.userInfo = user;
            return next();
          }
        }
      }
    }
    // unauthorized
    res.status(401).json({
      status: "error",
      message: "Unauthorized!",
    });
  } catch (error) {
    next(error);
  }
};
