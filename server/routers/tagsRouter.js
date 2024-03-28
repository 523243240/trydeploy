const express = require('express');
const tagsRouter = express.Router();

let Tag = require('../models/tags');
const { deleteTags,checkTag } = require('../utils');
const invalidSession = require('../middleware/invalidSession');

tagsRouter.use("/*", (req, res, next) => {
    if (req.method !== "GET")
        return invalidSession(req, res, next);
    return next();
});

/**
 * Sends all tags.
 */
tagsRouter.get("/all", (req, res) => {
    Tag.find({}).then((tag) => res.send(tag));
});

/**
 * Adds a tag. Validation errors get forwarded to error handler.
 */
tagsRouter.post("/add", (req, res, next) => {
    createTag(req.body).then((tag) => { 
        console.log(`New Tag Added`); 
        return res.send(tag) 
    }).catch((err) => {
        return next(err);
    });
});

/**
 * Updates a tag. Path should end with /_id, obtained by answer.url.
 */
tagsRouter.put("/:id", (req, res, next) => {
    Tag.findByIdAndUpdate(req.params.id, { name: req.body.name.toLowerCase() }, { returnDocument: "after" }).then((tag) => {
        console.log(`Tag Updated`);
        return res.send(tag); 
    }).catch((err) => {
        return next(err);
    });
});

/**
 * Deletes a tag. Path should end with /_id, obtained by tag.url.
 */
tagsRouter.delete("/*", (req, res, next) => {
    let id = req.params[0];
    deleteTags([id]).then((numDeleted) => { 
        console.log(`${numDeleted} tag${(numDeleted !== 1) ? 's' : ''} deleted`);
        return res.send({ numDeleted: numDeleted }); 
    }).catch((err) => {
        return next(err);
    });
});

/**
 * Retrieves a tag with a given id. Expected to be of the form /_id.  Path should be obtained by tag.url.
 */
tagsRouter.get("/*", (req, res, next) => {
    let id = req.params[0];
    getTag(id).then((tags) => {
        return res.send(tags[0]);
    }).catch((err) => {
        return next(err);
    });
});

/**
 * check if tag is also using by other users 
 */
tagsRouter.post("/check", async (req, res, next) => {
    let user = req.body.user;
    let tag  = req.body.tag; 
    let result = await checkTag(tag,user); 
    if(result === true)
        return res.send(undefined);
    else
        return res.send(tag); 
});

/**
 * Gets a tag given an id.
 * @param id id of the tag
 * @returns the query resulting from tag.find
 */
function getTag(id) {
    return Tag.find({ _id: id });
}

/**
 * Creates a new tag.
 * @param answer.name name of the tag. (Required field)
 * @returns the save promise returned from save() function call.
 */
function createTag({ name }) {
    let tag = new Tag({ name: name.toLowerCase() });
    return tag.save();
}

module.exports = tagsRouter;