document.addEventListener("DOMContentLoaded", () => {
    const createBlog = document.querySelector(".blog-btn");
    const writePost = document.querySelector(".writePost");
    const closeBtn = document.querySelector(".writePost span");


    // Open the blog post editor
    createBlog.addEventListener("click", () => {
        writePost.style.display = "block";
    });

    // Close the blog post editor
    closeBtn.addEventListener("click", () => {
        writePost.style.display = "none";
    });

    const submitbtn = document.querySelector(".submit");
    submitbtn.addEventListener("click", async (e) => {
        e.preventDefault();
        const post = document.querySelector("#post").value;
        console.log(post);
        const userPost = post.replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
        const userPost2 = marked.parse(userPost);
        const cleanPost = DOMPurify.sanitize(userPost2, {
            FORBID_TAGS: ["script", "iframe", "style"],
            RETURN_DOM: false,
            SAFE_FOR_BLOB_URLS: true,
            SANITIZE_DOM: true
        });
        // const realPostfr = cleanPost.replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
        if (cleanPost === "") {
            document.querySelector('.err').textContent = "Please write something";
            return;
        } else {
            document.querySelector('.err').textContent = "";
            submitbtn.textContent = "Posting...";
            submitbtn.disabled = true;
            const res = await axios.post("/post", { post: cleanPost });
            console.log(res);
            submitbtn.textContent = "Post";
            submitbtn.disabled = false;
            location.reload();
        }
    })

    const fetchData = async () => {
        const res = await axios.get("/posts");
        console.log(res);
        const posts = res.data;
        let sanitizedPosts = [];
        for (let i = 0; i < posts.length; i++) {
            const userPost = marked.parse(posts[i].post);
            const cleanPost = DOMPurify.sanitize(userPost);
            sanitizedPosts.push(cleanPost);
        }
        const output = document.querySelector(".output");
        output.innerHTML = `<div>${sanitizedPosts.join("")}</div>`;
        // console.log();
    }
    fetchData();

    const delbtn = document.querySelector(".delData");
    delbtn.addEventListener("click", async (e) => {
        e.preventDefault();
        const res = await axios.delete(`/delete`);
        console.log(res);
        location.reload();
    })

});
