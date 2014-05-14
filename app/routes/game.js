'use strict';

var Mongo=require('mongodb');
var _ = require('lodash');

var users = global.nss.db.collection('users');
var trees = global.nss.db.collection('trees');

var treeHelper = require('../lib/tree-helper.js');


exports.index = (req, res)=>{
  res.render('game/index', {title: 'Game: Home'});
};


exports.login = (req, res)=>{
  var newuser = {username: req.body.username,
                 wood: 0,
                 cash: 0};
  users.findOne({username: newuser.username}, (e,user)=>{
    if(user===null) {
      users.save(newuser, (e,obj)=>res.send({user:obj, duplicate: false}));
    }
    else {
      res.send({user:user, duplicate: true});
    }
  });
};


exports.seed = (req, res)=>{
  var _id = Mongo.ObjectID(req.body.userId);

  var tree = { height:0,
               userId:_id,
               isHealthy: true,
               isChopped: false };
  trees.save(tree, (e,obj)=> {
    res.render('game/tree',{tree:obj, treeHelper:treeHelper}, (e,html)=>{
      res.send(html);
    });
  });
};


exports.forest = (req, res)=>{
  var userId = Mongo.ObjectID(req.params.userId);

  trees.find({userId:userId}).toArray((e,usertrees)=>{
    users.findOne({_id:userId}, (err,user)=>{
      res.render('game/forest', {user:user, trees:usertrees, treeHelper:treeHelper}, (err,html)=>{
        res.send(html);
      });
    });
  });
};


exports.grow = (req, res)=>{
  var treeId = Mongo.ObjectID(req.params.treeId);
  trees.findOne({_id:treeId},(e,tree)=>{
    users.findOne(tree.userId,(err,user)=>{
      tree.height += _.random(1,3);
      tree.isHealthy = _.random(0,100) !== 69;
      trees.save(tree, (e, count)=>{
        res.render('game/tree',{user:user, tree:tree, treeHelper:treeHelper}, (e,html)=>{
          res.send(html);
        });
      });
    });
  });
};


exports.chop = (req, res)=>{
console.log('here');
  var treeId = Mongo.ObjectID(req.params.treeId);
  trees.findOne({_id:treeId},(e,tree)=>{
    users.findOne(tree.userId,(err,user)=>{

      if(tree.isHealthy && tree.height>=48) {
        user.wood += Math.round(0.5*tree.height);
        tree.height = 0;
        tree.isChopped = true;
        users.save(user, (e,count)=>{
          trees.findAndRemove({_id:treeId}, ()=>{
            res.redirect(`game/forest/${tree.userId}`);
          });
        });
      }
      else {
        res.redirect(`game/forest/${tree.userId}`);
      }

    });
  });
};
