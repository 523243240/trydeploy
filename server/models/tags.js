// Tag Document Schema
const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const TagSchema = new Schema({
        name: { type: String, required: [true, "Tag must have a name"], unique: [true, "A tag with this name already exists"] }
    },
    {
        toJSON: { virtuals: true },
        toObject: { virtuals: true },
    }
);

TagSchema.virtual('url').get(function() {
    return `posts/tag/${this._id}`;
})

const Tag = mongoose.model("Tag", TagSchema);

module.exports = Tag;