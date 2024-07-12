const express = require("express");
const bcrypt = require("bcrypt"); //Used to hash the password to store in databasr "npm i bcrypt"
const cookieParser = require("cookie-parser"); //Used To parse cookie by node js as this functionality is not built in "npm i cookie-parser"

require("dotenv").config(); //npm i dotenv

const jsonwebtoken = require("jsonwebtoken"); //Used to generate and verify tokens "npm i jsonwebtoken"

const connectToDb = require("./database/databaseConnection");
const Blog = require("./model/blogModel");
const { multer, storage } = require("./middleware/multerConfig");
const UserBlog = require("./model/userModel");
const isAuthenticated = require("./middleware/isAuthencated");
const app = express();

const upload = multer({ storage });

connectToDb();

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("./storage"));
app.use(express.static("./public"));

app.set("view engine", "ejs");

app.get("/", isAuthenticated, async (req, res) => {
  const blogs = await Blog.find();
  if (blogs.length === 0) res.send("No Datas Found");
  const user = await UserBlog.findById(req.userId);
  res.render("index", { blogs: blogs, username : user.username });
  // console.log(username);
});

app.get("/createblog", isAuthenticated, (req, res) => {
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
  res.render("editBlog", { blog });
});

app.get("/register", async (req, res) => {
  res.render("register");
});

app.get("/login", (req, res) => {
  res.render("login");
});

app.get("/logout", (req, res) => {
  res.clearCookie("token");
  res.redirect("/login");
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
    else {
      const token = jsonwebtoken.sign({ userId: user._id }, process.env.SECRET, { expiresIn: "10d" });
      res.cookie("token", token);
      res.redirect("/");
    }
  }
});



app.post("/editblog/:id", upload.single("image"), async (req, res) => {
  const id = req.params.id;
  const { title, subtitle, description } = req.body;
  let imageFile;
  await Blog.findByIdAndUpdate(id, {
    title,
    subtitle,
    description,
  });

  if (req.file) {
    imageFile = req.file.filename;
    await Blog.findByIdAndUpdate(id, {
      image: imageFile,
    });
  }
  res.redirect(`/blog/${id}`);
});

app.post("/createblog", upload.single("image"),isAuthenticated, async (req, res) => {
  //image is the name of input image in index.ejs
  // console.log(req.body);
  const { title, subtitle, description } = req.body;
  const fileName = req.file.filename;
  const author = await UserBlog.findById(req.userId);
  console.log(author.username);

  await Blog.create({
    title,
    subtitle,
    description,
    author: author.username,
    image: fileName,
    // AuthorId: req.userId
  });



  res.redirect("/");
});

app.post("/", async (req, res) => {
  const searchInput = req.body.searchblog;
  const filteredBlogs = await Blog.find({ title: searchInput });
  const username = await UserBlog.findById(req.userId).username;
  // console.log(username);
  if (searchInput == "") res.redirect("/");
  else if (filteredBlogs.length === 0) res.send("No Results Found");
  res.render("index", { blogs: filteredBlogs,  username :  username });
});

app.listen(3000, () => {
  console.log("Connection Successful");
});
