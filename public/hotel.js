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
function Booking(Place, Country, Price, Avaliable, Description, Location)
{
	this.place = Place;
	this.country = Country;
	this.price = Price;
	this.avliability = Avaliable;
	this.description = Description;
	this.location = Location;
}

var Sydney = new Booking("Sydney", "Australia", 350, 10, "It's in Sydney", {lat: -33.8435473, lng: 151.2413418});
var NewYork = new Booking("New York", "America", 430, 3, "It's in New York", {lat: 40.767778, lng: -73.9718335});
var Melbourne = new Booking("Melbourne", "Australia", 400, 5, "It's in Melbourne", {lat: 28.2249886, lng: -80.71385559999999});
var Madrid = new Booking("Madrid", "Spain", 380, 7, "It's in Madrid", {lat: 40.4089785, lng: -3.761460599999964});
var LosAngeles = new Booking("Los Angeles", "America", 400, 7, "It's in LA", {lat: 34.1483926, lng: -118.284088});
var Barcelona = new Booking("Barcelona", "Spain", 320, 20, "It's in Barcelona", {lat: 41.386333, lng: 2.189857599999982});
var Adelaide = new Booking("Adelaide", "Australia", 200, 30, "It's in Adelaide", {lat: -34.9129458, lng: 138.6069437});
var Vegas = new Booking("Las Vegas", "America", 420, 15, "It's in Las Vegas", {lat: 36.2620095, lng: -115.25776680000001});

var bookings = [];
bookings.push(Sydney);
bookings.push(NewYork);
bookings.push(Melbourne);
bookings.push(Madrid);
bookings.push(LosAngeles);
bookings.push(Barcelona);
bookings.push(Adelaide);
bookings.push(Vegas);


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
	if(signed == true)
	{
		$('#log').hide();
		$('#sign').hide();
		$('#account').hide();
		$('#info').show();
		$('#infoArea').append('<p>Name: '+currentUser.name+'</p><p>Email: '+currentUser.email+'</p>');
		for(var i = 0; i < currentUser.bookings.length; i++)
		{
			$('#bookingArea').append('<p>'+currentUser.bookings[i].place+'</p><p>$'+currentUser.bookings[i].price+'</p>');
		}
	}

	//Creating the hotel info on the destinations page
	for(var i = 0; i < bookings.length;i++)
	{
		$('#places').append('<div onclick="extend('+i+')"><h3>'+bookings[i].place+'</h3><p>'+bookings[i].country+'</p><p>'+bookings[i].description+'</p><p>'+bookings[i].avliability+' rooms at $'+bookings[i].price+' a night</p><hr>');
	}

	//search feature
	$('div div button').click(function()
	{
		console.log($('#start').val());
		$('#places div').remove();
		newBookings = [];
		if($('#country').val())
		{
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
				if((Math.abs(newBookings[k].price - check)>300)&&(check != "")&&(check != null))
				{
					newBookings.splice(k,1);
				}
			}
			for(var l = 0; l < newBookings.length; l++)
			{
				check = $('#rooms').val();
				console.log(check);
				if((check != "")&&(check != null)&&(check > newBookings[l].avliability))
				{
					newBookings.splice(l,1);
				}
			}
		}
		if(newBookings.length > 0)
		{
			console.log(newBookings.length);
			for(var m = 0; m < newBookings.length;m++)
			{
				$('#places').append('<div onclick="extend('+m+')"><h3>'+newBookings[m].place+'</h3><p>'+newBookings[m].country+'</p><p>'+newBookings[m].description+'</p><p>'+newBookings[m].avliability+' rooms at $'+newBookings[m].price+' a night</p><hr>');
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

function extend(x)
{
	$('#searchBar').hide();
	$('#places').hide();
	$('#content').hide();
	if(newBookings.length > 0)
	{
		console.log(x);
		currentBooking = newBookings[x];
		$('#extendInfo').append('<div id="map"><p>'+currentBooking.location+'</p></div><h1>'+currentBooking.place+'</h1><p>'+currentBooking.country+'</p><p>$'+currentBooking.price+' a night</p><p>'+currentBooking.description+'</p><button onclick="book()">Book Now</button><button onclick="back()">back</button>');
	}
	else
	{
		currentBooking = bookings[x];
		$('#extendInfo').append('<div id="map"><p>'+currentBooking.location+'</p></div><h1>'+currentBooking.place+'</h1><p>'+currentBooking.country+'</p><p>$'+currentBooking.price+' a night</p><p>'+currentBooking.description+'</p><button onclick="book()">Book Now</button><button onclick="back()">back</button>');
	}
	$('#extendInfo').show();
	initMap(x);
}

function back()
{
	$('#extendInfo').hide();
	$('#extendInfo').empty();
	$('#booking').hide();
	$('#booking').empty();
	$('#content').show();
	$('#searchBar').show();
	$('#places').show();
}

function book()
{
	$('#extendInfo').hide();
	$('#confirmation').show();
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
	$('#booking').hide();
	$('#confirmation').empty()
	$('#confirmation').append('<h1>Booking for</h1>');
	$('#confirmation').append('<h3>'+currentBooking.place+'</h3>');
	$('#confirmation').append('<p>From: </p>');
	$('#confirmation').append('<br><button onclick="book()">edit</button>');
	$('#confirmation').append('<button onclick="back()">cancel</button>');
	$('#confirmation').show();
}
function initMap(x) {
	var location = bookings[x].location;
	//var uni = {lat: -34.920603, lng: 138.60622769999998}
	map = new google.maps.Map(document.getElementById('map'), {
    	zoom: 15,
    	center: location
    });
    var contentString = '<img src= "Pictures/Web-logo-blue.jpg" style="width:50px;height:50px;float:left;">'+
    					'<h3>Supreme Hotel '+bookings[x].place+'</h3><hr>'+
    					'<p>'+bookings[x].description+'</p>';
    var infowindow = new google.maps.InfoWindow({
    	maxWidth: 200,
    	maxHeight: 100,
    	content: contentString
    });
    var marker = new google.maps.Marker({
   		position: location,
    	map: map,
    	title: 'Supreme Hotel '+bookings[x].place+''
   	});
    infowindow.open(map,marker);
}
