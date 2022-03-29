const express = require('express');
const app = express()
const port = 3080
const handlebars = require('express-handlebars');
var axios = require('axios');

// Serving static files 
app.use(express.static('public'));

//Middleware for handling forms
app.use(express.json()); // used to parse JSON bodies
app.use(express.urlencoded()); //Parse URL-encoded bodies


// setup template engine | handlebars {{}} | a config object
app.set('view engine', 'hbs')
app.engine('hbs', handlebars.engine({
  layoutsDir: __dirname + '/views/layouts',
  partialsDir: __dirname + '/views/partials',
  extname: 'hbs',
  defaultLayout: 'main'
}))
// app.engine('handlebars', handlebars.engine);



app.get("/", (req, res) => {
  //res.send("Hello Express Cat Shelter!")
  res.render('home', {
    name: "Bean", 
    score:[12, 15, 20], 
    favoriteNumber: 20,
    breeds: ['pug', 'maine coon', 'white tail', 'bass']
  });
})

app.get("/cats/add-breed", (req, res) => {
  res.render('addBreed', {});
})

app.post("/cats/add-breed", (req, res) => {
  console.log("POST /cats/add-breed");
  console.log("req.body", req.body);
  var axios = require('axios');
var data = '{\n    "Breed": "Bengal"\n}';

var config = {
  method: 'post',
  url: 'https://cat-shelter-52e19-default-rtdb.firebaseio.com/breeds.json',
  headers: { 
    'Content-Type': 'text/plain'
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

  
})

app.get("/cats/add-cat", async (req, res) => {
  let breeds = [];
  var config = {
    method: 'get',
    url: 'https://cat-shelter-52e19-default-rtdb.firebaseio.com/breeds.json',
    headers: { }
  };
  
  await axios(config)
  .then(function (response) {
    breeds = Object.values(response.data);
  })
  .catch(function (error) {
    console.log(error);
  });
  console.log('breeds obj is', breeds);
  res.render('addCat', {})
})

app.post("/cats/add-cat", (req, res) => {
  console.log("req.body", req.body);
})

app.get("/cats/edit-cat", (req, res) => {
  res.render('editCat', {});
})

app.get("/cats/cat-shelter", (req, res) => {
  res.render('catShelter', {});
})

// app.get("/user/:id", (req, res) => {
//   console.log(req.params);
//   res.status(200).send("the id in the url is " + req.params.id)
// })


app.listen(port, () => {
  console.log(`Example app listening on port ${port}, http://localhost:${port}`)
})