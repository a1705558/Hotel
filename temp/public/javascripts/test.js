/////////////////////////////Acquiring Data//////////////////////
/////////////////////////////////////////////////////////////////


var bookings = [];

var xmlr = new XMLHttpRequest();

xmlr.onreadystatechange = function()
{
	if(this.readyState == 4 && this.status == 200)
	{
		bookings = JSON.parse(this.responseText);
		for(var i = 0; i < bookings.length;i++)
		{
			$('#places').append('<div class="item" onclick="extend('+i+')"><img class="itemimg" src="stylesheets/Pictures/'+bookings[i].image+'"><h3>'+bookings[i].place+'</h3><p>'+bookings[i].country+'</p><span class="info"><p>'+bookings[i].description+'</p></span><p>'+bookings[i].avaliability+' rooms at $'+bookings[i].price+' a night</p></div><hr>');
		}
	}
};

xmlr.open("GET", "hotdata.json",true);
xmlr.send();

var newBookings = [];
var currentBooking;

var currentUser;
var signed = false;

var xhttps = new XMLHttpRequest();

xhttps.onreadystatechange = function()
{
	if(this.readyState == 4 && this.status == 200)
	{
		successfulSign(JSON.parse(this.responseText));
	}
};

xhttps.open("GET","sessions.json",true);
xhttps.send();

var xhttpb = new XMLHttpRequest();

xhttpb.onreadystatechange = function()
{
	if(this.readyState == 4 && this.status == 200)
	{
		signed = JSON.parse(this.responseText);
	}
};

xhttpb.open("GET","sessions.json",true);
xhttpb.send();



////////////////////////////Home Page Movement//////////////////////
////////////////////////////////////////////////////////////////////

function openHome()
{
	$('#home').show();
	$('#offers').hide();
	$('#destinations').hide();
	back();
}

function openOffers()
{
	$('#home').hide();
	$('#offers').show();
	$('#destinations').hide();
	back();
}

function openDests()
{
	$('#home').hide();
	$('#offers').hide();
	$('#destinations').show();
}

function homeDest()
{
	//Maybe?
	//xhttp1 = new XMLHttpRequest();

	// xhttp1.open("GET","test.html/destinations");
	// xhttp1.send();
	// window.location.href = 'test.html/destinations';
	window.location.href = 'test.html';
	openDests();
}

function homeOffers()
{
	window.location.href = 'test.html';
	openOffers();
}

function homeHome()
{
	window.location.href = 'test.html';
	openHome();
}



///////////////////////////////Search Function////////////////////
//////////////////////////////////////////////////////////////////

$(function()
{
	$('div div button').click(function()
	{
		$('#places ').empty();
		newBookings = [];
		if($('#country').val())
		{
			geocodeAddress(geocoder,map);

			for(var j = 0; j < bookings.length; j++)
			{
				if(bookings[j].country == $('#country').val())
				{
					newBookings.push(bookings[j]);
				}
			}
			for(var k = 0; k < newBookings.length; k++)
			{
				var check = $('#price').val();
				if((Math.abs(newBookings[k].price - check)>300)&&(check !== "")&&(check !== null))
				{
					newBookings.splice(k,1);
				}
			}
			for(var l = 0; l < newBookings.length; l++)
			{
				var check1 = $('#rooms').val();
				if((check1 !== "")&&(check1 !== null)&&(check1 > newBookings[l].avaliability))
				{
					newBookings.splice(l,1);
				}
			}
		}
		else if($('#price').val())
		{
			for(var m = 0; m < bookings.length; m++)
			{
				if(Math.abs(bookings[m].price - $('#price').val())<300)
				{
					newBookings.push(bookings[m]);
				}
			}
			for(var n = 0; n < newBookings.length; n++)
			{
				check2 = $('#rooms').val();
				if((check2 !== "")&&(check2 !== null)&&(check2 > newBookings[n].avaliability))
				{
					newBookings.splice(n,1);
				}
			}
		}
		else if($('#rooms').val())
		{
			for(var o = 0; o < bookings.length; o++)
			{
				if($('#rooms').val() < bookings[o].avaliability)
				{
					newBookings.push(bookings[o]);
				}
			}
		}
		if(newBookings.length > 0)
		{
			$('#places span').hide();
			for(var p = 0; p < newBookings.length;p++)
			{
				$('#places').append('<div class="item" onclick="extend('+p+')"><img class="itemimg" src="stylesheets/Pictures/'+bookings[p].image+'"><h3>'+newBookings[p].place+'</h3><p>'+newBookings[p].country+'</p><span class="info"><p>'+newBookings[p].description+'</p></span><p>'+newBookings[p].avaliability+' rooms at $'+newBookings[p].price+' a night</p></div><hr>');
			}
		}
		else
		{
			$('#places span').show();
			for(var q = 0; q < bookings.length;q++)
			{
				$('#places').append('<div class="item" onclick="extend('+q+')"><img class="itemimg" src="stylesheets/Pictures/'+bookings[q].image+'"><h3>'+bookings[q].place+'</h3><p>'+bookings[q].country+'</p><span class="info"><p>'+bookings[q].description+'</p></span><p>'+bookings[q].avaliability+' rooms at $'+bookings[q].price+' a night</p></div><hr>');
			}
		}
	});
});



///////////////////////////Booking Select////////////////////////////
/////////////////////////////////////////////////////////////////////

function extend(x)
{
	$('#searchBar').hide();
	$('#places').hide();
	$('#content').hide();
	
	if(newBookings.length > 0)
	{
		currentBooking = newBookings[x];
		$('#extendInfo').append('<h1>'+currentBooking.place+'</h1><p>'+currentBooking.country+'</p><p>$'+currentBooking.price+' a night</p><p>'+currentBooking.description+'</p>');
	}
	else
	{
		currentBooking = bookings[x];
		$('#extendInfo').append('<h1>'+currentBooking.place+'</h1><p>'+currentBooking.country+'</p><p>$'+currentBooking.price+' a night</p><p>'+currentBooking.description+'</p>');
	}
	if(signed === true)
	{
		$('#extendInfo').append('<button onclick="book()">Book Now</button>');
	}
	else
	{
		$('#extendInfo').append('<p>Please <a href="account.html">sign in</a> to make a booking</p>');
	}
	$('#extendInfo').append('<button onclick="back()">back</button>');
	changeView(currentBooking);
	$('#extendInfo').append('<br><img class="extendImg" src="stylesheets/Pictures/'+currentBooking.image+'"</img>');
	$('#extendInfo').show();

	for(var c = 0; c < currentBooking.comments.length; c++)
	{
		$('#comments').append('<hr><p style="font-size:10px">'+currentBooking.comments[c].time+'</p><p>'+currentBooking.comments[c].comment+'</p>');
	}
	$('#commentSection').show();
}

function back()
{
	$('#extendInfo').hide();
	$('#extendInfo').empty();
	$('#commentSection').show();
	$('#comments').empty();
	$('#extendInfo').append('<div id="smap"></div>');
	initMap();
	$('#confirmation').hide();
	$('#booking').hide();
	$('#booking').empty();
	$('#content').show();
	$('#searchBar').show();
	$('#places').show();
}

function book()
{
	$('#extendInfo').hide();
	$('#confirmation').hide();
	$('#booking').empty();
	$('#booking').show();
	$('#booking').append('<h1>Confirm Details</h1>');
	$('#booking').append('<p>Start Date:</p><input type="date" id="nstart" value="'+$('#start').val()+'" required><p>End Date:</p><input type="date" id="nend" value="'+$('#end').val()+'" required>');
	$('#booking').append('<p>Number of rooms:</p><input type="number" id="nrooms" value="'+$('#rooms').val()+'" required><br>');
	$('#booking').append('<button onclick="confirm()">confirm</button>');
	$('#booking').append('<button onclick="backa()">back</button>');
	$('#booking').append('<button onclick="back()">cancel</button>');
}

function backa()
{
	$('#booking').hide();
	$('#extendInfo').show();
	$('#booking').empty();
}

function confirm()
{
	var timeDiff = Math.abs(Date.parse($('#nstart').val()) - Date.parse($('#nend').val()));
	var diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24)); 
	var cost = diffDays * $('#nrooms').val() * currentBooking.price;
	$('#booking').hide();
	$('#confirmation').empty();
	$('#confirmation').append('<h1>Booking for</h1>');
	$('#confirmation').append('<h3>'+currentBooking.place+'</h3>');
	$('#confirmation').append('<p>From: '+$('#nstart').val()+'</p>');
	$('#confirmation').append('<p>To: '+$('#nend').val()+'</p>');
	$('#confirmation').append('<p>'+$('#nrooms').val()+' rooms</p>');
	$('#confirmation').append('<p>Total Cost: $'+cost+'</p>');
	$('#confirmation').append('<br><button onclick="book()">edit</button>');
	$('#confirmation').append('<button onclick="back()">cancel</button>');
	$('#confirmation').show();
}

function addReview()
{
	var xhttpr = new XMLHttpRequest();

	var review = document.getElementById('newreview').value;
	var ntime = new Date();

	xhttpr.onreadystatechange = function()
	{
		if(this.readyState == 4 && this.status == 200)
		{
			$('#comments').append('<hr><p style="font-size:10px">'+ntime+'</p><p>'+review+'</p>');
		}
	};
	console.log(currentBooking.place);

	xhttpr.open("POST","reviews.json",true);
	xhttpr.setRequestHeader('Content-Type','application/json');
	xhttpr.send(JSON.stringify({booking:currentBooking.place,time:ntime,comment:review}));

}



////////////////////Map's and Such/////////////////////////
///////////////////////////////////////////////////////////

function initMap() 
{
    map = new google.maps.Map(document.getElementById('map'), {
    	zoom: 10,
    	center: new google.maps.LatLng(0,0)
    });
    geocoder = new google.maps.Geocoder();
    var markers = [];
    for(var f = 0; f < bookings.length; f++)
    {
    	markers[f] = new google.maps.Marker({
    		position: bookings[f].position,
    		map:map,
    		title: bookings[f].description
    	});
    }
    smap = new google.maps.Map(document.getElementById('smap'), {
    	zoom: 10
    });
}

function geocodeAddress(geocoder, resultsMap) {
        var address = $('#country').val();
        geocoder.geocode({'address': address}, function(results, status) {
          if (status === 'OK') {
            resultsMap.setCenter(results[0].geometry.location);
          } else {
            alert('Geocode was not successful for the following reason: ' + status);
          }
        });
    }

function changeView(aBooking)
{
	smap.setCenter(aBooking.position);
}




///////////////////Account Side/////////////////////
////////////////////////////////////////////////////

function log()
{
	$('#sign').hide();
	$('#log').show();
	$('#account').hide();
	$('#info').hide();
	$('#infoArea').empty();
	$('#bookingArea').empty();
}

function sign()
{
	$('#sign').show();
	$('#log').hide();
	$('#account').hide();
	$('#info').hide();
	$('#infoArea').empty();
	$('#bookingArea').empty();
	signed = false;

	var xhttpo = new XMLHttpRequest();

	xhttpo.open("GET","signout.json",true);
	xhttpo.send();
}


function successfulSign(user)
{
	currentUser = user;
	signed = true;

	console.log(currentUser);

	$('#log').hide();
	$('#sign').hide();
	$('#account').hide();
	$('#info').show();
	$('#infoArea').append('<p>Name: '+currentUser.firstname+' '+currentUser.lastname+'</p><p>Email: '+currentUser.email+'</p><p>Address: '+currentUser.address+'</p><p>Phone Number: '+currentUser.phone+'</p>');

}

function newAccount()
{
	var users = [];

	var firstn = document.getElementById('firstname').value;
	var lastn = document.getElementById('lastname').value;
	var emai = document.getElementById('email').value;
	var pass = document.getElementById('password').value;
	var phone = document.getElementById('number').value;
	var add = document.getElementById('address').value;
	var nBooks = [];

	var newUser = {firstname:firstn,lastname:lastn,address:'none',email:emai,password:pass,bookings:nBooks,phone:'none'};
	
	if(phone !== undefined)
	{
		newUser.phone = phone;
	}
	if(add !== undefined)
	{
		newUser.address = add;
	}

	var xhttpu = new XMLHttpRequest();

	xhttpu.open("POST", "newdata.json",true);
	xhttpa.setRequestHeader('Content-type','application/JSON');
	xhttpu.send(JSON.stringify(newUser));

	log();
}

function checkAccount()
{
	var usern = document.getElementById('uemail').value;
	var userp = document.getElementById('upassword').value;

	var xhttpa = new XMLHttpRequest();

	xhttpa.onreadystatechange = function()
	{
		if(this.readyState == 4 && this.status == 200)
		{
			successfulSign(JSON.parse(this.responseText));
		}
		else if(this.status == 403)
		{
			$('#log').append('<p>Incorrect username or password');
		}
	};

	xhttpa.open("POST","usedata.json",true);
	xhttpa.setRequestHeader('Content-type','application/JSON');
	xhttpa.send(JSON.stringify({email:usern,password:userp}));
}

function onSignIn(user)
{
	var token = user.getAuthRespone().id_token;

	var xhttpg = new XMLHttpRequest();

	xhttpg.onreadystatechange = function()
	{
		if(this.readyState == 4 && this.status == 200)
		{
			successfulSign(JSON.parse(this.responseText));
		}
	};
	xhttpg.open("POST","usedata.json",true);
	xhttpg.setRequestHeader('Content-Type','application/json');
	xhttpg.send(JSON.stringify({idtoken:token}));
}