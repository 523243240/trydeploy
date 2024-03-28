// Answer Document Schema

const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const AnswerSchema = new Schema({
        text: { type: String, required: [true, "Please enter answer text."]  },
        ans_by: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: [true, "Please enter username."] },
        ans_date_time: { type: Date, default: Date.now },
        votes: { type: Number, default: 0},
        comments: { type: [mongoose.Schema.Types.ObjectId], ref: 'Comment', default: [] }
    },
    {
        toJSON: { virtuals: true },
        toObject: { virtuals: true },
    }
);

AnswerSchema.virtual('url').get(function() {
    return `posts/answer/${this._id}`;
})

const Answer = mongoose.model("Answer", AnswerSchema);

module.exports = Answer;