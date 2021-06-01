const express = require('express');

const mongoose = require('mongoose');
const Blog = require('./models/blog');

const port=process.env.PORT || 3000

// express app
const app = express();

// connect to mongodb & listen for requests


mongoose.connect('mongodb://localhost:27017/blog_ninja', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(result => app.listen(port))
  .catch(err => console.log(err));

// register view engine
app.set('view engine', 'ejs');

// middleware & static files
app.use(express.static('./public'));
app.use(express.urlencoded({ extended: true }));



// routes
app.get('/', (req, res) => {
  res.render('media');
});


app.get('/about', (req, res) => {
  res.render('about', { title: 'About' });
});

// blog routes
app.get('/blogs/createbymuk', (req, res) => {
  res.render('create', { title: 'Create a new blog' });
});

app.get('/blogs', (req, res) => {
  Blog.find().sort({ createdAt: -1 })
    .then(result => {
      res.render('index', { blogs: result, title: 'All blogs' });
    })
    .catch(err => {
      console.log(err);
    });
});

app.post('/blogs', (req, res) => {
  // console.log(req.body);
  const blog = new Blog(req.body);

  blog.save()
    .then(result => {
      res.redirect('/blogs');
    })
    .catch(err => {
      console.log(err);
    });
});

app.get('/blogs/:id', (req, res) => {
  const id = req.params.id;
  Blog.findById(id)
    .then(result => {
      res.render('details', { blog: result, title: 'Blog Details' });
    })
    .catch(err => {
      console.log(err);
    });
});



// 404 page
app.use((req, res) => {
  res.status(404).render('404', { title: '404' });
});