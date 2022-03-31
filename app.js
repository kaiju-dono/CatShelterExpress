const express = require("express");
const app = express();
const port = 3080;
const handlebars = require("express-handlebars");
var axios = require("axios");
const fileUpload = require('express-fileupload');

// Serving static files
app.use(express.static("public"));

//Middleware for handling forms
app.use(express.json()); // used to parse JSON bodies
app.use(express.urlencoded({extended: true})); //Parse URL-encoded bodies, must have extended:true or will get a warning of body-parser deprecated

//middleware for uploading files
app.use(fileUpload())

// setup template engine | handlebars {{}} | a config object
app.set("view engine", "hbs");
app.engine(
  "hbs",
  handlebars.engine({
    layoutsDir: __dirname + "/views/layouts",
    partialsDir: __dirname + "/views/partials",
    extname: "hbs",
    defaultLayout: "main",
  })
);
// app.engine('handlebars', handlebars.engine);

app.get("/", async (req, res, next) => {
  //res.send("Hello Express Cat Shelter!")
let cats = [];
var config = {
  method: "get",
  url: "https://cat-shelter-52e19-default-rtdb.firebaseio.com/cats.json",
  headers: {},
};

await axios(config).then(function (response) {
  console.log(Object.values(response.data))
  cats = Object.values(response.data);
}).catch(function (error) {
  console.log(error)
});
console.log('cats from firebase are', cats)
res.render('home', {
  name:'Yoda',
  cats,
})

});

app.get("/cats/add-breed", (req, res) => {
  res.render("addBreed", {});
});

app.post("/cats/add-breed", async (req, res) => {
  console.log("POST /cats/add-breed");
  console.log("req.body", req.body);

  var data = req.body;

  var config = {
    method: "post",
    url: "https://cat-shelter-52e19-default-rtdb.firebaseio.com/breeds.json",
    headers: {
      "Content-Type": "application/json",
    },
    data: data,
  };

  await axios(config)
    .then(function (response) {
      console.log(JSON.stringify(response.data));
    })
    .catch(function (error) {
      console.log(error);
    });
  res.redirect("/");
});

app.get("/cats/add-cat", async (req, res) => {
  let breeds = [];

  var config = {
    method: "get",
    url: "https://cat-shelter-52e19-default-rtdb.firebaseio.com/breeds.json",
    headers: {},
  };

  await axios(config)
    .then(function (response) {
      breeds = Object.values(response.data).map((x) => x.Breed);
      return;
    })
    .catch(function (error) {
      console.log(error);
    });
  console.log("breeds array is", breeds);
  res.render("addCat", { breeds });
});

app.post("/cats/add-cat", (req, res) => {
  console.log("add cat form is", req.body);
  const { name, description, Breed } = req.body;

  //save img file

  let sampleFile;
  let uploadPath;

  if (!req.files || Object.keys(req.files).length === 0) {
    return res.status(400).send('No files were uploaded.')
  }
  console.log('req.files is', req.files);

  sampleFile = req.files.upload;
  uploadPath = __dirname + "/public/images/" + sampleFile.name;

  sampleFile.mv(uploadPath, function (err) {
    if (err) return res.status(500).send(err);
    console.log("file was uploaded");
  });

  const data = {name, description, Breed, upload: sampleFile.name};


  var config = {
    method: 'post',
    url: "https://cat-shelter-52e19-default-rtdb.firebaseio.com/cats.json",
    headers: { 
      'Content-Type': 'application/json'
    },
    data : data
  };
  
  axios(config)
  .then(function (response) {
    console.log(JSON.stringify(response.data));
  })
  .catch(function (error) {
    console.log(error);
  });
  res.redirect("/");
});

app.get("/cats/edit-cat", (req, res) => {
  res.render("editCat", {});
});

app.get("/cats/cat-shelter", (req, res) => {
  res.render("catShelter", {});
});

// app.get("/user/:id", (req, res) => {
//   console.log(req.params);
//   res.status(200).send("the id in the url is " + req.params.id)
// })

app.listen(port, () => {
  console.log(
    `Example app listening on port ${port}, http://localhost:${port}`
  );
});
