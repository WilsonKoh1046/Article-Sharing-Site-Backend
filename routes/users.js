const express = require("express");
const router = express.Router();
const users = require("../services/users");
const authorizer = require("../middlewares/authorizer");

router.post('/signUp', async (req, res) => {
    const { name, password, email } = req.body;
    try {
        let result = await users.createUser(name, password, email);
        if (result.Status === 401) {
            res.status(result.Status).json({"Message": result.Message});
        }
        res.status(result.Status).json({"Message": `User with id ${result.Message.id} is successfully created`});
    } catch(err) {
        res.status(500).json({"Message": "Server error"});
    }
})

router.post('/signIn', async (req, res) => {
    const { password, email } = req.body;
    try {
        let result = await users.signInUser(password, email);
        if (result.Status === 401) {
            res.status(result.Status).json({"Message": result.Message});
        }
        res.status(result.Status).json({"Token": result.Token});
    } catch(err) {
        res.status(500).json({"Message": "Server error"});
    }
})

router.get('/my-info', authorizer, async (req, res) => {
    const email = req.email;
    try {
        let info = await users.retrieveOneUser(email);
        res.status(200).json(info);
    } catch(err) {
        res.status(500).json({"Message": "Server error"});
    }
})

router.put('/update-my-info', authorizer, async (req, res) => {
    const { id, name, password, email } = req.body;
    try {
        let updatedInfo = await users.updateUser(id, name, password, email);
        res.status(201).json(updatedInfo);
    } catch(err) {
        res.status(500).json({"Message": "Server error"});
    }
})

router.delete('/delete-my-account', authorizer, async(req, res) => {
    const email = req.email;
    const { id } = req.body;
    try {
        let deletedAccount = await users.deleteUser(id, email);
        res.status(404).json(deletedAccount);
    } catch(err) {
        res.status(500).json({"Message": "Server error"});
    }
})

module.exports = router;