var express = require('express');
var router = express.Router();

var CLIENT_ID = '1086925492608-39j9n30jeu9enbdu4ogql0r6pgaiou4q.apps.googleusercontent.com';
const {OAuth2Client} = require('google-auth-library');
const client = new OAuth2Client(CLIENT_ID);

var fs = require('fs');

var bookings = [];

var users = [];

var sessions = [];

var signed = false;

fs.readFile('data/hotdata.json','utf8',function(err,data)
{
	bookings = JSON.parse(data);
});

fs.readFile('data/usedata.json','utf8',function(err,data)
{
	users = JSON.parse(data);
});

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

// router.get('/test.html/:direction', function(req,res)
// {
// 	res.send(req.params.direction)
// });

router.post('newdata.json',function(req,res)
{
	console.log(req.body);
	users.push(req.body);
	res.send();
});

router.post('/usedata.json',function(req,res)
{
	var user = null;

	if(req.body.email !== undefined && req.body.password !== undefined)
	{
		for(var a = 0; a < users.length; a++)
		{
			if(users[a].email == req.body.email)
			{
				user = users[a];
			}
		}
		if(user === null)
		{
			res.staus(403);
		}
		else
		{
			if(user.password == req.body.password)
			{
				sessions[req.session.id] = req.body;
				signed = true;
				res.send(JSON.stringify(user));
			}
			else
			{
				console.log('Get off my website, dirty hacker');
				res.status(403);
			}
		}
	}
	else if(req.body.idtoken !== undefined)
	{
		console.log("goggle verifed");

		async function verify()
		{
			const ticket = await client.verifyIdToken
			({
				indexToken: req.body.idtoken,
				audience: CLIENT_ID
			});

			const payload = ticket.getPayload();

			const userId = payload['sub'];

			for(var b = 0; b < users.length; b++)
			{
				if(users[b].google = userId)
				{
					sessions[req.session.id] = req.body;
					signed = true;
					res.send(JSON.stringify(user));
				}
			}
		}
		
	}
	else
	{
		res.status(403);
	}
});

router.get('/sessions.json',function(req,res)
{
	if(sessions[req.session.id] !== undefined)
	{
		console.log("Now that's what we call a valid session");
		signed = true;
		res.send(sessions[req.session.id]);

	}
	else
	{
		res.status(403);
	}
});

router.get('/usedata.json', function(req,res)
{
	res.send(JSON.stringify(users));
});

router.get('/hotdata.json', function(req,res)
{
	res.send(JSON.stringify(bookings));
});

router.get('/hotel.json',function(req,res)
{
	res.send(JSON.stringify(signed));
});

router.get('/signout.json',function(req,res)
{
	signed = false;
	res.send();
})

router.post('/reviews.json',function(req,res)
{
	console.log(req.body);
	for(var b = 0; b < bookings.length; b++)
	{
		if(bookings[b].place == req.body.booking)
		{
			bookings[b].comments.push({time:req.body.time,comment:req.body.comment});
			console.log(bookings[b].comments);
		}
	}
	res.send();
});

module.exports = router;
