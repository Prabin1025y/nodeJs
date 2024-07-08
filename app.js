const express = require("express");
const connectToDb = require("./database/databaseConnection");
const Blog = require("./model/blogModel");
const app = express();

connectToDb();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.set("view engine", "ejs");

app.get("/createblog", (req, res) => {
  res.render("index");
});

app.post("/createblog", async (req, res) => {
  console.log(req.body);
  const { title, subtitle, description } = req.body;

  await Blog.create({
    title,
    subtitle,
    description,
  });

  res.send("Blog created and data inserted successfully");
});

app.listen(3000, () => {
  console.log("Connection Successful");
});
