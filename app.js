const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const port = 5000;
const users = require("./routes/users");
const posts = require("./routes/posts");

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }))

app.get("/", (req, res) => {
    res.status(200).send("Server is alive\n");
});

app.use("/api/users", users);
app.use("/api/posts", posts);

app.listen(port, () => {
    console.log(`Server running at port ${port}`);
})