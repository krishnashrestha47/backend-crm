import UserSchema from "./User.schema.js";

export const insertUser = (userObj) => {
  return UserSchema(userObj).save();
};

export const getSingleUser = (_id) => {
  return UserSchema.findById(_id);
};

export const getUser = (filter) => {
  return UserSchema.findOne(filter);
};

//update user details
export const updateUser = (_id, dataObj) => {
  return UserSchema.findByIdAndUpdate(_id, dataObj, { new: true });
};
