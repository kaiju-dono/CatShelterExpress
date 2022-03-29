const express = require('express');
const app = express()
const port = 3080
const handlebars = require('express-handlebars');


// Serving static files 
app.use(express.static('public'));

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

app.get("/cats/add-cat", (req, res) => {
  res.render('addCat', {});
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