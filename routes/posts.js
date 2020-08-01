const express = require("express");
const router = express();
const posts = require("../services/posts");

router.get("/", async (req, res) => {
    try {
        let result = await posts.getAllPosts();
        res.status(200).json(result);
    } catch(err) {
        console.log(err);
    }
})

router.get("/:id", async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        let result = await posts.getOnePost(id);
        res.status(200).json(result);
    } catch(err) {
        console.log(err);
    }
})

router.post("/", async (req, res) => {
    try {
        const { name, title, content, content_genre } = req.body;
        await posts.createPost(name, title, content, content_genre);
        res.status(201).json({"message": "Post successfully added"});
    } catch(err) {
        console.log(err);
    }
})

router.put("/:id", async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const { name, title, content, content_genre } = req.body;
        await posts.updatePost(id, name, title, content, content_genre);
        res.status(201).json({"message": `Post with id ${id} is successfully updated`});
    } catch(err) {
        console.log(err);
    }
})

router.delete("/:id", async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        await posts.deletePost(id);
        res.status(202).json({"message": `Post with id: ${id} is successfully deleted`});
    } catch(err) {
        console.log(err);
    }
})

module.exports = router;