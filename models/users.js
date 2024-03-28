//User Document Schema
const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const UserSchema = new Schema({
        username: { type: String, required: true },
        password: { type: String, required: true }, //Hash
        salt: { type: String, required: true }, //The salt used for the bcrypt hash
        email: { type: String, unique: true, required: true },
        reputation: { type: Number, default: 0 },
        registerDate: { type: Date, default: Date.now },
        questions: { type: [mongoose.Schema.Types.ObjectId], ref: 'Question', default: [] },
        answers: { type: [mongoose.Schema.Types.ObjectId], ref: 'Answer', default: [] },
        tags: { type: [mongoose.Schema.Types.ObjectId], ref: 'Tag', default: [] },
        isAdmin: { type: Boolean, default: false }
    },
    {
        toJSON: { virtuals: true },
        toObject: { virtuals: true },
    }
);

UserSchema.virtual('url').get(function() {
    return `user/${this._id}`;
});

const User = mongoose.model("User", UserSchema);

module.exports = User;