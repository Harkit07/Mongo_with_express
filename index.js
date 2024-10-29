const express = require("express");
const app = express();
const path = require("path");
const mongoose = require("mongoose");
const methodOverride = require("method-override");
const Chat = require("./models/chat.js");

const port = 8080;

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));

main()
  .then(() => {
    console.log("connection successful");
  })
  .catch((err) => console.log(err));

async function main() {
  await mongoose.connect("mongodb://127.0.0.1:27017/whattsapp");
}

app.listen(port, () => {
  console.log(`listening on the port ${port}`);
});

//Home Route
app.get("/chats", async (req, res) => {
  let chats = await Chat.find();
  res.render("index.ejs", { chats });
});

//Add New Chat Route
app.get("/chats/new", (req, res) => {
  res.render("new.ejs");
});

//Save New Chat
app.post("/chats", (req, res) => {
  let { from, msg, to } = req.body;
  let newChat = new Chat({
    from: from,
    to: to,
    msg: msg,
    created_at: new Date(),
  });
  newChat
    .save()
    .then((res) => {
      console.log("chat was save");
    })
    .catch((err) => {
      console.log(err);
    });
  res.redirect("/chats");
});

//Edit Chat Route
app.get("/chats/:id/edit", async (req, res) => {
  let {id} = req.params;
  let chat = await Chat.findById(id);
  res.render("edit.ejs", {chat});
});

app.put("/chats/:id", async (req, res) => {
  let {id} = req.params;
  let {msg} = req.body;
  let chat = await Chat.findByIdAndUpdate(id, {msg: msg}, {runValidators: true}, {new: true});
  res.redirect("/chats");
});

app.delete("/chats/:id", async (req, res) => {
  let {id} = req.params;
  let chat = await Chat.findByIdAndDelete(id, {new: true});
  res.redirect("/chats");
});