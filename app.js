const express = require("express");
const bcrypt = require("bcrypt");

const connectToDb = require("./database/databaseConnection");
const Blog = require("./model/blogModel");
const { multer, storage } = require("./middleware/multerConfig");
const UserBlog = require("./model/userModel");
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

app.get("/register", async (req, res) => {
  res.render("register");
});

app.post("/register", async (req, res) => {
  const { username, email, password } = req.body;

  await UserBlog.create({
    username,
    email,
    password: bcrypt.hashSync(password, 12),
  });

  res.redirect("/login");
});

app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const user = await UserBlog.findOne({ email: email });
  if (!user) {
    res.send("Invalid Email");
  } else {
    //check password
    if (!bcrypt.compareSync(password, user.password)) res.send("Invalid Password");
    else res.send("Login Successful");
  }
});

app.get("/login", (req, res) => {
  res.render("login");
});

app.post("/editblog/:id", upload.single("image"), async (req, res) => {
  const id = req.params.id;
  const { title, subtitle, description } = req.body;
  const imageFile = req.file.filename;
  await Blog.findByIdAndUpdate(id, {
    title,
    subtitle,
    description,
    image: imageFile,
  });
  res.redirect(`/blog/${id}`);
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

  res.redirect("/");
});

app.listen(3000, () => {
  console.log("Connection Successful");
});
