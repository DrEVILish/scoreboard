var express = require('express');
var async = require('async');
var _ = require('lodash');
var moment = require('moment')
var router = express.Router();


//GET scores for given game
router.get('/game/:game', (req,res)=>{
  console.log('GET scores for a Game:' + req.params.game);
  var sql = req.sql;
  sql.query('SELECT * FROM `GameTypes` WHERE `game_name` = ?', req.params.game, (err, rows)=>{
    async.forEachOf(rows, (game, i, cb)=>{
      sql.query('SELECT * FROM `round` WHERE `gameid` = ?', game.id, (err, subRows)=>{
        rows[i].rounds = subRows;
        async.forEachOf(rows[i].rounds, (round, ii, cb)=>{
          sql.query('SELECT * FROM `scores` WHERE `roundid` = ? ORDER BY `score` DESC', round.id, (err, subRows)=>{
            rows[i].rounds[ii].scores = subRows;
            async.forEachOf(rows[i].rounds[ii].scores, (score, iii, cb)=>{
              sql.query('SELECT * FROM `player` WHERE `id` = ?', score.playerid, (err, subRows)=>{
                rows[i].rounds[ii].scores[iii].player = subRows[0];
                cb();
              });
            }, (err)=>{ cb(); });
          });
        }, (err)=>{ cb(); });
      });
    }, (err)=>{
      res.json(rows);
    });
  });
});


//GET list of all games in the database
router.get('/game', (req,res)=>{
  var sql = req.sql;
  sql.query('SELECT * FROM `GameTypes` ORDER BY `game_name`',(err, rows)=>{
    if(err) throw err;
    else {
      res.json(rows)
    }
  })
});

//POST a new game to database
router.post('/game', (req,res)=>{
  var game = {
    name: req.body.gameName,
    typeid: req.body.gameTypeId,
    info: req.body.gameInfo
  }
  var sql = req.sql;
  sql.query('INSERT INTO `game` SET ?', game,(err, sqlRes)=>{
    if(err) throw err;
    else {
      res.json(sqlRes)
    }
  })
});

router.get('/gametype', (req,res)=>{
  var sql = req.sql;
  sql.query('SELECT * FROM `gameType`', (err, rows)=>{
    if(err) throw err;
    else{
      res.json(rows);
    }
  })
});


//POST a new game to database
router.get('/player', (req,res)=>{
  var sql = req.sql;
  sql.query('SELECT * FROM `player` ORDER BY `last_name`', (err, rows)=>{
    if(err) throw err;
    else {
      res.json(rows)
    }
  })
});


//GET scores from games played in the last 30days
router.get('/score/recent', (req,res)=>{
  var sql = req.sql;
  var today = moment().format("YYYY-MM-DD");
  var last30 = moment().subtract(30, 'days').format("YYYY-MM-DD");
  sql.query('SELECT * FROM `player`', (err, playerRows)=>{
    if(err) throw err;
    async.forEachOf(playerRows, (player, i, cb)=>{
      sql.query('SELECT * FROM `PlayerPointsTotals` WHERE `playerid` = ? AND `date` BETWEEN NOW() - INTERVAL 30 DAY AND NOW()', player.id, (err, pointRows)=>{
        playerRows[i].scores = pointRows;
        cb();
      });
    },(err)=>{
      if(err) throw err;
      res.json(playerRows);
    });
  });
});


router.post('/score', (req,res)=>{
  var gameid = req.body.gameid;
  var scores = req.body.scores;
  var date = req.body.date;
  var sql = req.sql;
  sql.query('INSERT INTO `round` SET ?', {gameid: gameid, date: date}, (err, sqlRes)=>{
    if(err) throw err;
    var roundid = sqlRes.insertId;
    async.forEachOf(_.orderBy(scores,(o)=>{return parseInt(o.score)},['desc']), (score, i, cb)=>{
      sql.query('INSERT INTO `scores` SET ?', {roundid: roundid, playerid: score.player.id, score: score.score}, (err, sqlRes)=>{
        if(err) throw err;
        cb();
      });
    },(err)=>{
      res.json(sqlRes);
    });
  });
});

//GET scores from all games
router.get('/score/all', (req,res)=>{
  var sql = req.sql;
  sql.query('SELECT * FROM `GameScores`',(err,rows)=>{
    if(err) {
      throw err; 
    }else{
      res.json(rows)
    }
  });
});


router.get('/score/leaderboard', (req,res)=>{
  var sql = req.sql;
  sql.query('SELECT * FROM `PlayerPointsAverage`',(err, playerRows)=>{
    res.json(playerRows);
  });     
});


module.exports = router;