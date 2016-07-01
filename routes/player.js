var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.render('template', { jsxfile: 'players', data: null})
});

module.exports = router;
