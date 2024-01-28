var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});


router.get('/course', function(req, res, next) {
  res.json({
  	courseList:[
  		{id:1,name:'js课程'},
  		{id:2,name:'ts课程'},
  		{id:3,name:'vue课程'},
  		{id:4,name:'项目课程'},
  		{id:5,name:'react课程'},
  	]
  })
});


router.get('/id', function(req, res, next) {
  let id = req.query.id;
  if( id==1 ){
    res.json({
      content:'js课程'
    })
  }else if( id==2 ){
    res.json({
      content:'ts课程'
    })
  }else if( id==3 ){
    res.json({
      content:'vue课程'
    })
  }else if( id==4 ){
    res.json({
      content:'项目课程'
    })
  }else if( id==4 ){
    res.json({
      content:'react课程'
    })
  }
});


module.exports = router;
