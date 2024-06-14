import { Schema, models, model } from 'mongoose'
const PromptSchema = new Schema({
    email: { type: String, required: true, unique: true },
    username: { type: String, required: true, unique: true },
  })

const Prompt = models.user || model('user', PromptSchema)

export default Prompt