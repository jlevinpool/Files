/* *************************************************************************
** Author: James Pool
** ONID: 932664412
** OSU Email: poolj@oregonstate.edu
** Date: 9 March 2016
**
** Program Filename: howTo.js
** Description: How to Guide for Wargaming.net APIs
************************************************************************** */

"use strict";

/* Global Variables */
var lastPage = 6;

/* Express and Middleware */
var express = require('express');
var app = express();
var handlebars = require('express-handlebars').create({defaultLayout:'bootstrapTemplate'});
var bodyParser = require('body-parser');

/* Handlebars Setup */
app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');

/* Body Parser Setup */
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

/* Static File Setup */
app.use(express.static(__dirname + '/public'));

/* Application Port */
app.set('port', 3101);

/* Query Request Handing Function */
function pageRequest(query){
	for (var p in query){  /* Loop through request query */
		if (p == 'page') {
			return query[p];  /* Return page */
		}
	}
	return 1;  /* Return start page */
}

app.get('/',function(req,res) {
	var context = {};
	context.page = Number(pageRequest(req.query));  /* Get page number as a number */
	if (context.page <= 0 || context.page > lastPage) {  /* Range check page */
		context.page = 1;  /* Set to start page */
	}
	if (context.page > 1) { /* Has a previous page */
		context.prevPage = context.page - 1;
	}
	else {
		context.prevPage = [];
	}
	if (context.page < lastPage) {  /* Has a next page */
		context.nextPage = context.page + 1;
	}
	else {
		context.nextPage = [];
	}
	res.render('howTo-page-'+context.page,context);
});

app.post('/',function(req,res) {
	//Post is not legal, go to first page
	var context = {};
	context.page = 1;
	context.prevPage = [];
	context.nexPage = 2;
	res.render('howTo-page-'+context.page,context);
});

/* ERROR Handler */
app.use(function(req,res){
	res.status(404);
	res.render('404_-_Not_Found');
});

app.use(function(err, req, res, next){
  console.error(err.stack);
  res.status(500);
  res.render('500_-_Internal_Server_Error');
});

/* Start Application */
app.listen(app.get('port'), function(){
	console.log('Express started on http://localhost:' + app.get('port') + '; press ctrl-c to terminate.');
});