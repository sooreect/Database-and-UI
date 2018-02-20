/* sources: 
 * https://piazza.com/class/imb3pkt1msem5?cid=307
 */

//create an express application
var express = require('express');
var app = express(); 

//connect to database through connection pool
var mysql = require('mysql');
var pool = mysql.createPool({
	host: 'localhost',
	user: 'student',
	password: 'default',
	database: 'student',
});
module.exports.pool = pool;

//load and set up handlebars template
var handlebars = require('express-handlebars').create({defaultLayout:'main'});
app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');

//set up public directory for static files
app.use(express.static('public'));

//set up listening port
app.set('port', 3000);


//main page
app.get('/', function(req, res, next){
	var context = {};
	res.render('home', context);
});

//accessing database
app.get('/select', function(req, res, next){
	pool.query("SELECT * FROM workouts", function(err, rows, fields){
		if(err){
			next(err);
			return;
		}
		res.status(200).send(rows);
	});
});

//inserting into database
app.get('/insert', function(req, res, next) {
	pool.query("INSERT INTO workouts (`name`, `reps`, `weight`, `lbs`, `date`) VALUES (?, ?, ?, ?, ?)", [req.query.name, req.query.reps, req.query.weight, req.query.lbs, req.query.date], function(err, result){
		if(err){
			next(err);
			return;
		}
		res.status(200).send(null);
	});
});

//deleting from database
app.get('/delete', function(req, res, next){
	pool.query("DELETE FROM workouts WHERE id=?", [req.query.id], function(err, result){
		if(err){
			next(err);
			return;
		}
		res.status(200).send(null);
	})
})

//editing database
app.get('/edit', function(req, res, next){
	var context = {};
	pool.query("SELECT * FROM workouts WHERE id=?", [req.query.id], function(err, rows, result){
		if(err){
			next(err);
			return;
		}
		console.log(rows.length);
		//copy current values into context object 
		if(rows.length == 1){
			context.id = rows[0].id;
			context.name = rows[0].name;
			context.reps = rows[0].reps;
			context.weight = rows[0].weight;
			context.lbs = rows[0].lbs;
			context.date = rows[0].date;
		}
		res.render('edit', context);
	})
})

//updating database


//resetting database
app.get('/reset',function(req, res, next){
	var context = {};
	pool.query("DROP TABLE IF EXISTS workouts", function(err){
    	var createString = "CREATE TABLE workouts(" +
    	"id INT PRIMARY KEY AUTO_INCREMENT," +
    	"name VARCHAR(255) NOT NULL," +
    	"reps INT," +
    	"weight INT," +
    	"lbs BOOLEAN," +
    	"date DATE)";
    	pool.query(createString, function(err){
    		context.results = "Table has been reset.";
    		res.render('home',context);
    	})
	});
});


//handle 404 error
app.use(function(req, res){
  res.status(404);
  res.render('404');
});

//handle server error
app.use(function(err, req, res, next){
  console.error(err.stack);
  res.type('plain/text');
  res.status(500);
  res.render('500');
});

app.listen(app.get('port'), function(){
  console.log('Express started on http://localhost:' + app.get('port') + '; press Ctrl-C to terminate.');
});
