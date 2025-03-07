const express = require("express");
const dotenv = require("dotenv");
dotenv.config();
const connectDB = require("./utils/dbConn");
const Post = require("./models/Post_temp");
const cors = require("cors");

const app = express();

connectDB();
app.use(cors(
    {
        origin: "http://localhost:3000",
        credentials: true
    }
));
app.use(express.static("public"));
app.set("view engine", "ejs");
// app.set("views", "views");
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get("/", (req, res) => {
    res.render("index");
});

app.post("/post", async (req, res) => {
    try {
        // connectDB();
        const { post } = req.body;
        console.log(post);
        const newPost = new Post({ post });
        await newPost.save();
        return res.status(200).send("Post added successfully");

    } catch (error) {
        console.error("error in index.js", error);
        return res.status(500).send("Internal Server Error");
    }

})

app.get("/posts", async (req, res) => {
    try {
        // connectDB();
        const posts = await Post.find({});
        return res.status(200).send(posts);
    } catch (error) {
        console.error("error in index.js/posts", error);
        return res.status(500).send("Internal Server Error");
    }
})

app.delete("/delete", async (req, res) => {
    try {
        // connectDB();
        await Post.deleteMany({});
        return res.status(200).send("Posts deleted successfully");
    } catch (error) {
        console.error("error in index.js/delete", error);
        return res.status(500).send("Internal Server Error");
    }
})


app.listen(process.env.PORT, () => {
    console.log(`Server started on port ${process.env.PORT}`);
}) 