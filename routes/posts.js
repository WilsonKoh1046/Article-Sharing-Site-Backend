const express = require("express");
const router = express.Router();
const posts = require("../services/posts");
const authorizer = require("../middlewares/authorizer");

router.get("/", async (req, res) => {
    try {
        let result = await posts.getAllPosts();
        res.status(result.Status).json(result.Data);
    } catch(err) {
        res.status(500).json({"Message": "Server error"});
    }
})

router.get("/:id", authorizer, async (req, res) => {
    const email = req.email;
    const id = parseInt(req.params.id);
    try {
        let result = await posts.getPostById(id, email);
        if (result.Status === 401) {
            res.status(result.Status).json({"Message": result.Message});
        }
        res.status(result.Status).json({"Data": result.Data});
    } catch(err) {
        res.status(500).json({"Message": "Server error"});
    }
})

router.get("/my-posts/:id", authorizer, async (req, res) => {
    const id = parseInt(req.params.id);
    try {
        let result = await posts.getAllMyPosts(id);
        res.status(result.Status).json({"Data": result.Data});
    } catch(err) {
        res.status(500).json({"Message": "Server error"});
    }
})

router.post("/:id", authorizer, async (req, res) => {
    const user_id = parseInt(req.params.id);
    const email = req.email;
    const { title, content, content_genre } = req.body;
    try {
        let result = await posts.createPost(title, content, content_genre, user_id, email);
        res.status(result.Status).json({"Message": `Post with id ${result.Message.id} successfully added`});
    } catch(err) {
        res.status(500).json({"Message": "Server error"});
    }
})

router.put("/:id", async (req, res) => {
    const email = req.email;
    const id = parseInt(req.params.id);
    const { title, content, content_genre } = req.body;
    try {
        let result = await posts.updatePost(id, title, content, content_genre, email);
        if (result.Status === 401) {
            res.status(result.Status).json({"Message": result.Message});
        }
        res.status(result.Status).json({"Message": `Post with id ${result.Data.id} is successfully updated`});
    } catch(err) {
        res.status(500).json({"Message": "Server error"});
    }
})

router.delete("/:id", authorizer, async (req, res) => {
    const email = req.email;
    const id = parseInt(req.params.id);
    try {
        let result = await posts.deletePost(id, email);
        if (result.Status === 401) {
            res.status(result.Status).json({"Message": result.Message});
        }
        res.status(result.Status).json({"Message": `Post with id: ${result.Data.id} is successfully deleted`});
    } catch(err) {
        res.status(500).json({"Message": "Server error"});
    }
})

router.put("/vote/:id", authorizer, async (req, res) => {
    const { personal_id, action } = req.body;
    const targeted_id = req.params.id;
    try {
        let result = await posts.vote(personal_id, targeted_id, action);
        res.status(result.Status).json({"Message": result.Message});
    } catch(err) {
        res.status(500).json({"Message": "Server error"});
    }
})

module.exports = router;