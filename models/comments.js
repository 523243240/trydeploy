//Comment Document Schema
const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const CommentSchema = new Schema({
        text: { type: String, required: [true, "Please enter comment text."], maxLength: [140, "Comments can't exceed 140 characters."] },
        user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true},
        votes: { type: Number, default: 0 },
        dateCommented: { type: Date, default: Date.now }
    },
    {
        toJSON: { virtuals: true },
        toObject: { virtuals: true },
    }
);

CommentSchema.virtual('url').get(function() {
    return `posts/comment/${this._id}`;
})

const Comment = mongoose.model("Comment", CommentSchema);

module.exports = Comment;