import { Schema, models, model } from 'mongoose'
const UserSchema = new Schema({
    clerkId: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    username: { type: String, required: true, unique: true },
    firstName: { type: String, required: true },
    lastName: {type: String, required: true },
    Image: { type: String, required: true },
  })

const User = models.user || model('user', UserSchema)

export default User