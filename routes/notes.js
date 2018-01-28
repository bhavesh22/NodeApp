const express = require('express');
const router = express.Router();

// Article Model
let Note = require('../models/note');
// User Model
let User = require('../models/user');

// Add Route
router.get('/add', ensureAuthenticated, function(req, res){
  res.render('add_note', {
    title:'Add Notes'
  });
});

// Add Submit POST Route
router.post('/add', function(req, res){
  req.checkBody('title','Title is required').notEmpty();
  //req.checkBody('author','Author is required').notEmpty();
  req.checkBody('body','Body is required').notEmpty();

  // Get Errors
  let errors = req.validationErrors();

  if(errors){
    res.render('add_note', {
      title:'Add Notes',
      errors:errors
    });
  } else {
    let note = new Note();
    note.title = req.body.title;
    note.author = req.user._id;
    note.body = req.body.body;

    note.save(function(err){
      if(err){
        console.log(err);
        return;
      } else {
        req.flash('success','Note Added');
        res.redirect('/');
      }
    });
  }
});

// Load Edit Form
router.get('/edit/:id', ensureAuthenticated, function(req, res){
  Note.findById(req.params.id, function(err, note){
    if(note.author != req.user._id){
      req.flash('danger', 'Not Authorized');
      res.redirect('/');
    }
    res.render('edit_note', {
      title:'Edit Note',
      note:note
    });
  });
});

// Update Submit POST Route
router.post('/edit/:id', function(req, res){

  req.checkBody('title','Title is required').notEmpty();
  req.checkBody('author','Author is required').notEmpty();
  req.checkBody('body','Body is required').notEmpty();
  console.log(req.params.id);
  
  let errors = req.validationErrors();
  if(errors){
    note = Note.findById(req.params.id, function(err, note){
      console.log(note.title);
      // req.flash('danger',errors)
      // res.redirect('/notes/edit/'+ req.params.id);
      res.render('edit_note', {
       errors: errors,
        note: note
      });
    });
  } else {
    let note = {};
    note.title = req.body.title;
    note.author = req.body.author;
    note.body = req.body.body;

    let query = {_id:req.params.id}

    Note.update(query, note, function(err){
      if(err){
        console.log(err);
        return;
      } else {
        req.flash('success', 'Note Updated');
        res.redirect('/');
      }
    });
  }
});

// Delete Article
router.delete('/:id', function(req, res){
  if(!req.user._id){
    res.status(500).send();
  }

  let query = {_id:req.params.id}

  Note.findById(req.params.id, function(err, note){
    if(note.author != req.user._id){
      res.status(500).send();
    } else {
      Note.remove(query, function(err){
        if(err){
          console.log(err);
        }
        res.send('Success');
      });
    }
  });
});

// Get Single Article
router.get('/:id', function(req, res){
  Note.findById(req.params.id, function(err, note){
    User.findById(note.author, function(err, user){
      res.render('note', {
        note:note,
        author: user.name
      });
    });
  });
});

// Access Control
function ensureAuthenticated(req, res, next){
  if(req.isAuthenticated()){
    return next();
  } else {
    req.flash('danger', 'Please login');
    res.redirect('/users/login');
  }
}

module.exports = router;
