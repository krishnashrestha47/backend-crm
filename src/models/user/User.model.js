import UserSchema from "./User.schema.js";

export const insertUser = (userObj) => {
  return UserSchema(userObj).save();
};

export const getSingUser = (_id) => {
  return UserSchema.findById(_id);
};

//update user details
export const updateUser = (_id, dataObj) => {
  return UserSchema.findByIdAndUpdate(_id, dataObj, { new: true });
};
