const express = require("express");
const connectToDb = require("./database/databaseConnection");
const Blog = require("./model/blogModel");
const { multer, storage } = require("./middleware/multerConfig");
const app = express();

const upload = multer({ storage });

connectToDb();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("./storage"));

app.set("view engine", "ejs");

app.get("/", async (req, res) => {
  const blogs = await Blog.find();
  if (blogs.length === 0) res.send("No Datas Found");
  res.render("index", { blogs: blogs });
});

app.get("/createblog", (req, res) => {
  res.render("blog");
});

app.get("/blog/:id", async (req, res) => {
  const id = req.params.id;
  const blog = await Blog.findById(id);
  res.render("singleBlog", { blog });
});

app.get("/deleteblog/:id", async (req, res) => {
  const id = req.params.id;
  await Blog.findByIdAndDelete(id);
  res.redirect("/");
});

app.get("/editblog/:id", async (req, res) => {
  const id = req.params.id;
  const blog = await Blog.findById(id);
  res.render("editblog", { blog });
});

app.post("/createblog", upload.single("image"), async (req, res) => {
  //image is the name of input image in index.ejs
  console.log(req.body);
  const { title, subtitle, description } = req.body;
  const fileName = req.file.filename;

  await Blog.create({
    title,
    subtitle,
    description,
    image: fileName,
  });

  res.send("Blog created and data inserted successfully");
});

app.listen(3000, () => {
  console.log("Connection Successful");
});
