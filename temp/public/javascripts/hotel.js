var map;
var smap;

xht = new XMLHttpRequest();



xht.open("GET","hotel.json",true);
xht.send()

//This could probably be jquery
function log()
{
	document.getElementById("sign").style.display = "none";
	document.getElementById("log").style.display = "block";
	document.getElementById("account").style.display = "none";
}
//so could this
function sign()
{
	document.getElementById("sign").style.display = "block";
	document.getElementById("log").style.display = "none";
	document.getElementById("account").style.display = "none";
}

//Creates a booking object
// function Booking(Place, Country, Price, Avaliable, Image, Description, Position)
// {
// 	this.place = Place;
// 	this.country = Country;
// 	this.price = Price;
// 	this.avaliability = Avaliable;
// 	this.description = Description;
// 	this.image = Image;
// 	this.position = Position;
// }

// var Sydney = new Booking("Sydney", "Australia", 350, 10, "sydney.jpg","Sydney is pretty great, it's in New South Wales which is definitely south of wales so they got the name right. That being said, it is the complete opposite of wales, there's beaches and also the sun is present",{lat: -33.8688,lng: 151.2093});
// var NewYork = new Booking("New York", "America", 430, 3, "newyork.jpg","New York, specifically Manhattan Island, is really famous. There's a good reason why no one talks about the other areas though.",{lat: 40.7128,lng: -74.0060});
// var Melbourne = new Booking("Melbourne", "Australia", 400, 5,"melbourne.jpg", "Melbourne is the number 1 most liveable city in the world. However anyone who lives in Melbourne would probably tell you the standards at which that award is measured holds no weight.",{lat: -37.8136,lng: 144.9631});
// var Madrid = new Booking("Madrid", "Spain", 380, 7, "madrid.jpg","Madrid, Spain. It's Madrid, really cool place, never actually been there but I hear it's good.",{lat: 40.4168,lng: -3.7038});
// var LosAngeles = new Booking("Los Angeles", "America", 400, 7,"LA.jpg", "They say if you can make it in LA you can make it anywhere, which is another way of saying it is really difficult to make it in LA. It's much easier just to travel there and see the sights, like for instance you were to stay at a hotel. Like the ones we sell",{lat: 34.0522,lng: 118.2437});
// var Barcelona = new Booking("Barcelona", "Spain", 320, 20, "barcelona.jpg","Barcelona has some amazing sites, including the Sagrada Familia, which hasn't even been completed yet. I mean, it's a building that's super famous and it's not even built fully, step up your game, other buildings.",{lat: 41.3851,lng: 2.1734});
// var Adelaide = new Booking("Adelaide", "Australia", 200, 30, "adelaide.jpg","Adelaide is the home to a number of interesting sites such as the University of Adelaide, which I hear has some totally cool lectuers and markers, specifically the ones who mark WDC assignments.",{lat: -34.9285,lng: 138.6007});
// var Vegas = new Booking("Las Vegas", "America", 420, 15, "vegas.jpg","Las Vegas, the home of bright lights, gambling, and also more gambling. It's also surrounded by a pretty neat desert rated 'Number one place to die of dehyrdration' by Time Magazine.",{lat: 36.1699,lng: -115.1398});

var bookings = [];

// bookings.push(Sydney);
// bookings.push(NewYork);
// bookings.push(Melbourne);
// bookings.push(Madrid);
// bookings.push(LosAngeles);
// bookings.push(Barcelona);
// bookings.push(Adelaide);
// bookings.push(Vegas);


var newBookings = [];
var currentBooking;

function Account(Name, Phone, Address, Email, Password)
{
	this.name = Name;
	this.phone = Phone;
	this.address = Address;
	this.email = Email;
	this.password = Password;
	var bookings = [];
}

var currentUser;
var users = [];
var signed = false;

$(function()
{
	//Shows user information if the user is signed in
	if(signed === true)
	{
		$('#log').hide();
		$('#sign').hide();
		$('#account').hide();
		$('#info').show();
		$('#infoArea').append('<p>Name: '+currentUser.name+'</p><p>Email: '+currentUser.email+'</p>');
		for(var h = 0; h < currentUser.bookings.length; h++)
		{
			$('#bookingArea').append('<p>'+currentUser.bookings[h].place+'</p><p>$'+currentUser.bookings[h].price+'</p>');
		}
	}

	//Creating the hotel info on the destinations page
	for(var i = 0; i < bookings.length;i++)
	{
		$('#places').append('<div class="item" onclick="extend('+i+')"><img class="itemimg" src="Pictures/'+bookings[i].image+'"><h3>'+bookings[i].place+'</h3><p>'+bookings[i].country+'</p><span class="info"><p>'+bookings[i].description+'</p></span><p>'+bookings[i].avaliability+' rooms at $'+bookings[i].price+' a night</p></div><hr>');
	}

	//search feature
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
				$('#places').append('<div class="item" onclick="extend('+p+')"><img class="itemimg" src="Pictures/'+bookings[p].image+'"><h3>'+newBookings[p].place+'</h3><p>'+newBookings[p].country+'</p><span class="info"><p>'+newBookings[p].description+'</p></span><p>'+newBookings[p].avaliability+' rooms at $'+newBookings[p].price+' a night</p></div><hr>');
			}
		}
		else
		{
			$('#places span').show();
			for(var q = 0; q < bookings.length;q++)
			{
				$('#places').append('<div class="item" onclick="extend('+i+')"><img class="itemimg" src="Pictures/'+bookings[q].image+'"><h3>'+bookings[q].place+'</h3><p>'+bookings[q].country+'</p><span class="info"><p>'+bookings[q].description+'</p></span><p>'+bookings[q].avaliability+' rooms at $'+bookings[q].price+' a night</p></div><hr>');
			}
		}
	});

	//creating an account
	$('#sign button').click(function()
	{
		var name = $('#firstname').val() + ' ' + $('#lastname').val();
		var email = $('#email').val();
		var address = $('#address').val();
		var password = $('#password').val();
		var phone = $('#number').val();
		users.push(new Account(name,phone,address,email,password));
		currentUser = users[users.length-1];
		signed = true;
	});

	//logging into an account
	$('#log button').click(function()
	{
		for(var i = 0; i < users.length; i++)
		{
			if(($('#uemail').val() == users[i].email)&&(('#upassword').val() == users[i].password))
			{
				currentUser = users[i];
				signed = true;
			}
		}
	});
});

function search(bookings)
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
				$('#places').append('<div class="item" onclick="extend('+p+')"><img class="itemimg" src="Pictures/'+bookings[p].image+'"><h3>'+newBookings[p].place+'</h3><p>'+newBookings[p].country+'</p><span class="info"><p>'+newBookings[p].description+'</p></span><p>'+newBookings[p].avaliability+' rooms at $'+newBookings[p].price+' a night</p></div><hr>');
			}
		}
		else
		{
			$('#places span').show();
			for(var q = 0; q < bookings.length;q++)
			{
				$('#places').append('<div class="item" onclick="extend('+i+')"><img class="itemimg" src="Pictures/'+bookings[q].image+'"><h3>'+bookings[q].place+'</h3><p>'+bookings[q].country+'</p><span class="info"><p>'+bookings[q].description+'</p></span><p>'+bookings[q].avaliability+' rooms at $'+bookings[q].price+' a night</p></div><hr>');
			}
		}
}

function extend(booking)
{
	$('#searchBar').hide();
	$('#places').hide();
	$('#content').hide();
	if(newBookings.length > 0)
	{
		currentBooking = newBookings[x];
		$('#extendInfo').append('<h1>'+currentBooking.place+'</h1><p>'+currentBooking.country+'</p><p>$'+currentBooking.price+' a night</p><p>'+currentBooking.description+'</p><button onclick="book()">Book Now</button><button onclick="back()">back</button>');
	}
	else
	{
		currentBooking = booking;
		$('#extendInfo').append('<h1>'+currentBooking.place+'</h1><p>'+currentBooking.country+'</p><p>$'+currentBooking.price+' a night</p><p>'+currentBooking.description+'</p><button onclick="book()">Book Now</button><button onclick="back()">back</button>');
	}
	changeView(currentBooking);
	$('#extendInfo').append('<br><img class="extendImg" src="Pictures/'+currentBooking.image+'"</img>');
	$('#extendInfo').show();
}

function back()
{
	$('#extendInfo').hide();
	$('#extendInfo').empty();
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
    	})
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

function homeSearch()
{
	xhttp = new XMLHttpRequest();

	var place = document.getElementById("homeplace");
	var start = document.getElementById("homestart");
	var end = document.getElementById("homeend");

	var item = {place:place,start:start,end:end};

	xhttp.open("POST", "destinations.html", true);

	xhttp.setRequestHeader("content-type","application/json");
	xhttp.send(JSON.stringify(item));
}

function offerSelect(aBooking)
{
	xhttp = new XMLHttpRequest();

	var booking;

	xhttp.onreadystatechange = function()
	{
		if(this.readyState == 4 && this.status == 200)
		{
			var hotels = JSON.parse(this.responseText);
			for(var a = 0; a < hotels.length; a++)
			{
				console.log(hotels[a].place);
				if(hotels[a].place == aBooking)
				{
					booking = hotels[a];
					extend(booking);
				}
			}
		}
	};
	xhttp.open("GET","/hotdata.json",true);
	xhttp.setRequestHeader("content-type","application/json");
	xhttp.send(JSON.stringify(booking));

	//window.location.pathname = ' '

	xhttpz = new XMLHttpRequest();

	xhttpz.open("POST","/search.json",true);
	xhttpz.send();
}