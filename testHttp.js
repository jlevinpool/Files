var express = require('express');

var app = express();
var handlebars = require('express-handlebars').create({defaultLayout:'main'});
var credentials = require('./credentials.js');
var request = require('request');
var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;

app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');
app.set('port', 3000);
app.use(express.static('public'));

app.get('/',function(req,res,next){
	var context = {};
	request({"url":"https://api.worldoftanks.com/wot/encyclopedia/vehicles/",
					"method":"POST",
					"headers":{"Content-Type":"application/x-www-form-urlencoded"},
			"body":"application_id="+credentials.WG_Key
			+"&tank_id=1105"},
					handleRender);	
				
	function handleAccountList(err, response, body){
		if(!err && response.statusCode < 400){
			var playerID = JSON.parse(body).data[0].account_id;
					

			
/*			request({"url":"https://api.worldoftanks.com/wot/account/info/",
					"method":"POST",
					"headers":{"Content-Type":"application/x-www-form-urlencoded"},
					"body":"application_id="+credentials.WG_Key
						+"&account_id="+playerID
						+"&fields=nickname,private"
						+"&extra=private.garage"}, 
					handleRender);		*/	
		}else{
			console.log(err);
			if(response){
				console.log(response.statusCode);		
			}
			next(err);
		}
	}
	
	function handleRender(err, response, body){
		console.log(response.statusCode);
		if(!err && response.statusCode < 400){
			context.WG_response = body;
			console.log(JSON.parse(body));
			res.render('WG_response',context);
		}else{
			console.log(err);
			if(response){
				console.log(response.statusCode);		
			}
			next(err);
		}
		
	}
});

app.use(function(req,res){
  res.status(404);
  res.render('404');
});

app.use(function(err, req, res, next){
  console.error(err.stack);
  res.status(500);
  res.render('500');
});

app.listen(app.get('port'), function(){
  console.log('Express started on http://localhost:' + app.get('port') + '; press Ctrl-C to terminate.');
});
