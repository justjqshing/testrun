import { Schema, models, model } from 'mongoose'
const PromptSchema = new Schema({
    title: { type: String, required: true },
    prompt: { type: String, required: true },
    description: { type: String, required: true },
    tags: { type: Array, required: false },
    organizer: { type: Schema.Types.ObjectId, ref: 'User' },
  })

const Prompt = models.prompts || model('prompts', PromptSchema)

export default Prompt