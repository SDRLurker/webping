var express 	= require('express'),
    app		= express();
var ping	= require('net-ping');
var path	= require('path');
var async	= require('async');
require('date-utils');

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(express.urlencoded());
//app.use(express.bodyParser());

app.get('/:address', function(req, res) {
	var host = req.params.address;
  var session = ping.createSession ();
	session.pingHost(host, function(error, target) {
    var isAlive = true;
    if(error)
      isAlive = false;
		var obj = { host : host, alive : isAlive };
		res.send(200, obj);
	});
});

function ping_all(address_array, fn){
	var ping_func = function(item, doneCallback) {
      var session = ping.createSession ();
		  session.pingHost(item, function(error, target) {
      var isAlive = true;
      if(error)
        isAlive = false;
			var element = { host : item, alive : isAlive };
			return doneCallback(null, element);
		});
	};
	async.map(address_array,
		ping_func,
		function(err, results){
			fn(results);
		}
	);
}

app.post('/:address', function(req, res) {
	var address_array = req.body.address;
	ping_all(address_array, function(obj) {
		//console.log(obj);
		res.send(200, obj);
	});
});

app.listen(process.env.PORT || 4000);
