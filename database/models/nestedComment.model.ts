import { Schema, models, model } from 'mongoose'
const CommentSchema = new Schema({
    comment: { type: String, required: true },
    prompt: { type: Schema.Types.ObjectId, ref: 'Prompt' },
    Creator: { type: Schema.Types.ObjectId, ref: 'User' },
    Date: { type: Date, default: Date.now },
    parentComment: { type: Schema.Types.ObjectId, ref: 'Parent' },
    mainComment: { type: Schema.Types.ObjectId, ref: 'Main' },
    likes: { type: Number, default: 0 },
    dislikes: { type: Number, default: 0 },
    likedBy: { type: [Schema.Types.ObjectId], ref: 'User' },
    dislikedBy: { type: [Schema.Types.ObjectId], ref: 'User' },
  })

const Nested = models.Nested || model('Nested', CommentSchema)

export default Nested