import { Schema, models, model } from 'mongoose'
const PromptSchema = new Schema({
    title: { type: String, required: true },
    prompt: { type: String, required: true },
    description: { type: String, required: true },
    tags: { type: Array, required: false },
    organizer: { type: Schema.Types.ObjectId, ref: 'User' },
    createdAt: { type: Date, required: true },
    likes: { type: Number, required: true },
    likedBy: { type: Array, required: true },
    dislikes: { type: Number, required: true },
    dislikedBy: { type: Array, required: true },
    comments: { type: Array, required: true },
  })

const Prompt = models.prompts || model('prompts', PromptSchema)

export default Prompt