// Question Document Schema
const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const QuestionSchema = new Schema({
        title: { type: String, required: [true, "Please enter a title."] , maxlength: [50, "Title can be at most 50 characters."] },
        summary: { type: String, required: [true, "Please enter summary."], maxlength: [140, "Summary can be at most 140 characters."]},
        text: { type: String, required: [true, "Please enter question text."] },
        tags: { type: [mongoose.Schema.Types.ObjectId] , ref: 'Tag', required: [true, "Input at least 1 tag."], minlength: [1, "Input at least 1 tag"], maxlength: [5, "Can't have more than 5 tags."] },
        asked_by: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
        answers: { type: [mongoose.Schema.Types.ObjectId], ref: 'Answer', default: [] },
        ask_date_time: { type: Date, default: Date.now },
        views: { type: Number, default: 0 },
        votes: { type: Number, default: 0},
        comments: { type: [mongoose.Schema.Types.ObjectId], ref: 'Comment', default: [] }
    },
    {
        toJSON: { virtuals: true },
        toObject: { virtuals: true },
    }
);

QuestionSchema.virtual('url').get(function() {
    return `posts/question/${this._id}`;
})

const Question = mongoose.model("Question", QuestionSchema);

module.exports = Question;