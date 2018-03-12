const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const { ensureAuthenticated } = require('../helpers/auth');

// load story and user model
require('../models/Story');
require('../models/User');
const Story = mongoose.model('stories');
const User = mongoose.model('users');

// stories route
router.get('/', (req, res) => {
  Story.find({
    status: 'public'
  }).populate('user').then((stories) => {
    res.render('stories/index', {
      header: "Stories",
      stories: stories
    });
  });
});

// show single story
router.get('/show/:id', (req, res) => {
  Story.findOne({
    _id: req.params.id
  }).populate('user').then((story) => {
    res.render('stories/show', {
      story: story
    });
  });
});

router.get('/edit/:id', ensureAuthenticated, (req, res) => {
  Story.findOne({
    _id: req.params.id
  }).then((story) => {
    res.render('stories/edit', {
      header: "Edit Story",
      story: story
    });
  });
});

// add story route
router.get('/add', ensureAuthenticated, (req, res) => {
  res.render('stories/add', {
    header: "Add Story"
  });
});

// posting stories
router.post('/', ensureAuthenticated, (req, res) => {
  let data = JSON.parse(JSON.stringify(req.body));
  let allowComments;
  if (data.hasOwnProperty('allowComments')) {
    allowComments = true;
  } else {
    allowComments = false;
  }

  let title = req.body.title;
  let body = req.body.body;

  // validation
  req.checkBody('title', 'Please enter a title for the story.').notEmpty();
  req.checkBody('body', 'You need to write something for sharing your story.').notEmpty();

  let errors = req.validationErrors();
  if (errors) {
    req.flash('error_msg', errors[0].msg);
    res.redirect('stories/add');
  } else {
    const newStory = {
      title: req.body.title,
      body: req.body.body,
      status: req.body.status,
      allowComments: allowComments,
      user: req.user.id
    };

    // save story
    new Story(newStory).save().then((story) => {
      res.redirect(`/stories/show/${story.id}`);
    });
  }
});

// Edit form process
router.put('/edit/:id', ensureAuthenticated, (req, res) => {
  let title = req.body.title;
  let body = req.body.body;

  // check validation
  req.checkBody('title', "Please enter the title of the story.").notEmpty();
  req.checkBody('body', "Don't leave your story empty.").notEmpty();

  let errors = req.validationErrors();
  if (errors) {
    req.flash('error_msg', errors[0].msg);
    res.redirect(`/stories/edit/${req.params.id}`);
  } else {
    Story.findOne({
      _id: req.params.id
    }).then((story) => {
      let allowComments;
      if (req.body.allowComments) {
        allowComments = true;
      } else {
        allowComments = false;
      }

      story.title = req.body.title;
      story.body = req.body.body;
      story.status = req.body.status;
      story.allowComments = allowComments;

      story.save().then((story) => {
        req.flash('success_msg', 'Your story has been updated.');
        res.redirect('/dashboard');
      });
    });
  }
});

// delete story
router.delete('/:id', ensureAuthenticated, (req, res) => {
  Story.remove({
    _id: req.params.id
  }).then(() => {
    req.flash('success_msg', "Your story has been successfully deleted.");
    res.redirect('/dashboard');
  });
});

// post comment
router.post('/comment/:id', ensureAuthenticated, (req, res) => {
  const newComment = {
    commentBody: req.body.comment,
    commentUser: req.user.id
  };
  Story.findOne({
    _id: req.params.id
  }).then((story) => {
    story.comments.unshift(newComment);
    story.save().then((story) => {
      req.flash('success_msg', "Comment Added Successfully.");
      res.redirect(`/stories/show/${story.id}`);
    });
  });
});

module.exports = router;