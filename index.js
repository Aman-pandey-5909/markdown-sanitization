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

function extractandreplaceImages(post){
    let images = [];
    let imageIndex=0;
    let postWithoutImages = post.replace(/<img[^>]+src=["']([^"']+)["'][^>]*>/g, (match, src) => {
        imageIndex++;
        images.push(src);
        return `{{IMAGE_${imageIndex-1}}}`;
    })

    return {
        postWithoutImages,
        images
    };

}

function replacePlaceholderWithImages(post, images) {
    let postWithImages = post;

    images.forEach((imageUrl, index) => {
        const placeholder = new RegExp(`{{IMAGE_${index}}}`, "g"); // Create a global regex for replacement
        postWithImages = postWithImages.replace(placeholder, `<img src="${imageUrl}" alt="Image_${index}" />`);
    });

    return postWithImages;
}


app.post("/post", async (req, res) => {
    try {
        // connectDB();
        const { post } = req.body;
        console.log(post);
        const {postWithoutImages, images} = extractandreplaceImages(post);
        console.log(postWithoutImages, images);
        const newPost = new Post({ post: postWithoutImages, image: images });
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
        posts.forEach((post) => {
            post.post = replacePlaceholderWithImages(post.post, post.image);
        })
        return res.status(200).send(posts);
        
        // return res.status(200).send(posts);
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