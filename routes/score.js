var express = require('express');
var router = express.Router();

router.get('/game/:game/', (req,res)=>{
  res.render('template', { jsxfile: 'game', data: req.params.game })
});

router.get('/game', (req,res)=>{
  res.render('template', { jsxfile: 'games', data: null})
});

router.get('/add', (req,res)=>{
  res.render('template',{ jsxfile: 'addscore', data: null});
});

router.get('/', (req,res)=>{
  res.render('template', { jsxfile: 'score', data:null });
});


module.exports = router;