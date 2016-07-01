var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('template', { jsxfile: 'home' });
});

router.get('/tutorial', function(req, res, next) {
  res.render('template', {data: null, jsxfile: 'tutorial'});
});

module.exports = router;
