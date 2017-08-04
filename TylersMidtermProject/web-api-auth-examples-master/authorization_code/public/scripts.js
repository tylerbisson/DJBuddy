var app = {

	playlistTracks : [],
	playlistBPMS : [],
	recommendedTracks : [],
	sortedrecommendedTracks : [],
	recommendationBPMS : [],
	sortedrecommendationBPMS : [],
	sortedplaylist: [],
	sortedBPMS: [],

	/////////////////////////////////////////////////////////////INITIALIZATION/////////////////////////////////////////////////////////////POOOPO

	initialize: function() {
		app.getPlaylist();
	},

	getPlaylist: function() {
		var key = localStorage.getItem("jammer");
		console.log("getPlaylist: initialize");
		var spotifyURL = 'https://api.spotify.com/v1/users/';
		var userID = "122514310";
		var playlistID = "77fAYvRZgDXuBoTFxfMPbK";
		var mySpotifyKey = key;
		var mySpotifyReqURL = spotifyURL + userID + "/playlists/" + playlistID;
		$.ajax({
			url: mySpotifyReqURL,
			type: 'GET',
			dataType: 'json',
			headers: {
				'Authorization': 'Bearer ' + mySpotifyKey
			},
			error: function(err){
				console.log("getPlaylist: error");
				console.log(err);
			},
			success: function(data){
				//console.log(data);
				console.log("getPlaylist: success");
				app.playlistTracks = data.tracks.items;
				app.getBPMandKey();
			}
		});
	},

	getBPMandKey: function() {
		console.log("getBPMandKey: initialize");
		var key = localStorage.getItem("jammer");
		var spotifyURL = 'https://api.spotify.com/v1/audio-features/?ids=';
		for (var i = 0; i < app.playlistTracks.length; i++){
			spotifyURL += app.playlistTracks[i].track.id + ',';
		}
		var mySpotifyKey = key;
		var mySpotifyReqURL = spotifyURL;
		$.ajax({
			url: mySpotifyReqURL,
			type: 'GET',
			dataType: 'json',
			headers: {
				'Authorization': 'Bearer ' + mySpotifyKey
			},
			error: function(err){
				console.log("getBPMandKey: error");
				console.log(err);
			},
			success: function(data){
				console.log("getBPMandKey: success");
				app.playlistBPMS = data.audio_features;
				app.sortPlaylist();
			}
		});
	},

	sortPlaylist: function(){
		console.log("sortPlaylist: entered");
		app.sortedplaylist = app.playlistTracks;
		app.sortedBPMS = app.playlistBPMS;
		for (var i = 0; i < app.playlistTracks.length; i++){
			for (var k = 1 + i; k < app.playlistTracks.length; k++){
				if (app.sortedBPMS[i].tempo > app.sortedBPMS[k].tempo){
					flippy = app.sortedplaylist[k];
					floppy = app.sortedplaylist[i];
					app.sortedplaylist[k] = floppy;
					app.sortedplaylist[i] = flippy;
					flip = app.sortedBPMS[k];
					flop = app.sortedBPMS[i];
					app.sortedBPMS[k] = flop;
					app.sortedBPMS[i] = flip;
				}
			}
		}
		app.makeSortedPlaylistHTML();
	},

	makeSortedPlaylistHTML: function() {
		console.log("makeSortedPlaylistHTML: entered");
		var theHTML = "<h3> Playlist </h3>";
		theHTML += "<table class='playlistitems'>";
		theHTML += "<tr> <th> Artist </th> <th> Track </th> <th> BPM </th> </tr>";
		theHTML += "</table>" ;
		$('main').append(theHTML);
		var moreHTML = '';
		for (var i = 0; i < app.playlistTracks.length; i++){
			if (i % 2 == 0){
				moreHTML += "<tr class= even id=" + i + ">";
			}
			else{
				moreHTML += "<tr id=" + i + ">";
			}
			moreHTML += "<td>" + app.sortedplaylist[i].track.artists[0].name + "</td>";
			moreHTML += "<td>" + app.sortedplaylist[i].track.name + "</td>";
			moreHTML += "<td>" + app.sortedBPMS[i].tempo + "</td>";
			moreHTML += "</tr>";
			
		}

		$('.playlistitems').append(moreHTML);
		app.initializeSortedClick();
		app.makeDiscogsModal();
		app.deeThreeExperiment();
	},

	/////////////////////////////////////////////////////////////RECOMMENDATIONS_COLUMN/////////////////////////////////////////////////////////////


	initializeSortedClick: function() {
		console.log("initializeSortedClick: entered");
		$(function(){
			var ids = '';
			var $tracks = $('main tr');
			$tracks.on('click', function(){
				var recommendationID = app.sortedplaylist[this.id].track.id;
				var recommendationBPM = app.sortedBPMS[this.id].tempo;
				app.getSpotifyRecommendations(recommendationID);
			});
		});
	},

	getSpotifyRecommendations: function(recommendationID, recommendationBPM) {
		console.log("getSpotifyRecommendations: initialize");
		var key = localStorage.getItem("jammer");
		var spotifyURL = 'https://api.spotify.com/v1/recommendations?seed_tracks=';
		spotifyURL += recommendationID + ",";
		spotifyURL += "&tempo=";
		spotifyURL += recommendationBPM + ",";
		var mySpotifyKey = key;
		var mySpotifyReqURL = spotifyURL;
		$.ajax({
			url: spotifyURL,
			type: 'GET',
			dataType: 'json',
			headers: {
				'Authorization': 'Bearer ' + mySpotifyKey
			},
			error: function(err){
				console.log("getSpotifyRecommendations: error");
				console.log(err);
			},
			success: function(data){
				console.log("getSpotifyRecommendations: success");
				app.recommendedTracks = data.tracks;
				app.getRecommendationBPMandKey();
			}
		});
	},

	getRecommendationBPMandKey: function() {
		console.log("getRecommendationBPMandKey: initialize");
		var key = localStorage.getItem("jammer");
		var spotifyURL = 'https://api.spotify.com/v1/audio-features/?ids=';
		for (var i = 0; i < app.recommendedTracks.length; i++){
			spotifyURL += app.recommendedTracks[i].id + ',';
		}
		var mySpotifyKey = key;
		var mySpotifyReqURL = spotifyURL;
		$.ajax({
			url: mySpotifyReqURL,
			type: 'GET',
			dataType: 'json',
			headers: {
				'Authorization': 'Bearer ' + mySpotifyKey
			},
			error: function(err){
				console.log("getRecommendationBPMandKey: error");
				console.log(err);
			},
			success: function(data){
				console.log("getRecommendationBPMandKey: success");
				app.recommendationBPMS = data.audio_features;
				app.sortRecommendations();
			}
		});
	},

	sortRecommendations: function(){
		console.log("sortRecommendations: entered");
		app.sortedrecommendedTracks = app.recommendedTracks;
		app.sortedrecommendationBPMS = app.recommendationBPMS;
		for (var i = 0; i < app.recommendedTracks.length; i++){
			for (var k = 1 + i; k < app.recommendedTracks.length; k++){
				if (app.sortedrecommendationBPMS[i].tempo > app.sortedrecommendationBPMS[k].tempo){
					flippy = app.sortedrecommendedTracks[k];
					floppy = app.sortedrecommendedTracks[i];
					app.sortedrecommendedTracks[k] = floppy;
					app.sortedrecommendedTracks[i] = flippy;
					flip = app.sortedrecommendationBPMS[k];
					flop = app.sortedrecommendationBPMS[i];
					app.sortedrecommendationBPMS[k] = flop;
					app.sortedrecommendationBPMS[i] = flip;
				}
			}
		}
		app.makeRecommendationHTML();
	},

	makeRecommendationHTML: function() {
		console.log("makeRecommendationHTML: entered");
		var theHTML = "<h3> Recommendations </h3>";
		theHTML += "<table class='recommendations'>";
		theHTML += "<tr> <th> Artist </th> <th> Track </th> <th> BPM </th> </tr>";
		theHTML += "</table>" ;
		$('nav').html(theHTML);
		var moreHTML = '';
		for (var i = 0; i < app.sortedrecommendedTracks.length; i++){
			if (i % 2 != 0){
				moreHTML += "<tr class= oddrec id=" + i + ">";
			}
			else{
				moreHTML += "<tr id=" + i + ">";
			}
			moreHTML += "<td>" + app.sortedrecommendedTracks[i].artists[0].name + "</td>";
			moreHTML += "<td>" + app.sortedrecommendedTracks[i].name + "</td>";
			moreHTML += "<td>" + app.sortedrecommendationBPMS[i].tempo + "</td>";
			moreHTML += "</tr>";
		}
		$('.recommendations').append(moreHTML);
		app.makeRecommendationDiscogsModal();
	},

	/////////////////////////////////////////////////////////////PLAYLIST_MODAL/////////////////////////////////////////////////////////////

	makeDiscogsModal: function(){
		console.log("makeDiscogsModal: entered");
		$(function(){
			var ids = '';
			var $tracks = $('main tr');
			var modal = document.getElementById('myModal');
			$tracks.on("contextmenu", function(){
				app.DiscogsSearch(app.sortedplaylist[this.id].track.name, app.sortedplaylist[this.id].track.artists[0].name, this.id, 1);
				var modal = document.getElementById('myModal');
				modal.style.display = "block";
				return false;
			});
		// When the user clicks anywhere outside of the modal, close it
		window.onclick = function(event) {
			if (event.target == modal) {
				modal.style.display = "none";
				document.createElement('audio').muted = 'true';
			}
		};
	});
	},

	/////////////////////////////////////////////////////////////RECOMMENDATION_MODAL/////////////////////////////////////////////////////////////

	makeRecommendationDiscogsModal: function(){
		console.log("makeRecommendationDiscogsModal: entered");
		$(function(){
			var ids = '';
			var $tracks = $('nav tr');
			var modal = document.getElementById('myModal');
			$tracks.on("contextmenu", function(){
				app.DiscogsSearch(app.sortedrecommendedTracks[this.id].name, app.sortedrecommendedTracks[this.id].artists[0].name, this.id, 0);
				var modal = document.getElementById('myModal');
				modal.style.display = "block";
				return false;
			});
		// When the user clicks anywhere outside of the modal, close it
		window.onclick = function(event) {
			if (event.target == modal) {
				modal.style.display = "none";
			}
		};
	});
	},

	/////////////////////////////////////////////////////////////GENERAL_MODAL/////////////////////////////////////////////////////////////

	DiscogsSearch: function(track, artist, id, type) {
		console.log("DiscogsSearch: initialize");
		var spotifyURL = 'https://api.discogs.com/database/search?q=?';
		var key = 'bsIqdNRottjcwAlywdms';
		var secret = 'VarafRnDMykSDvJxJlMPczjKBrnFXmTH';
		var mySpotifyReqURL = spotifyURL + artist + " - " + track + '&key=' + key + '&secret=' + secret;  
		$.ajax({
			url: mySpotifyReqURL,
			type: 'GET', 
			dataType: 'json',

			error: function(err){
				console.log("DiscogsSearch: error");
				console.log(err);
			},
			success: function(data){
				console.log("DiscogsSearch: success");
				console.log(data.results[0].resource_url);
				app.getDiscogsInfo(data.results[0].resource_url, id, type, track);
			}
		});
	},

	getDiscogsInfo: function(releaseURL, id, type, track){
		console.log("getDiscogsInfo: initialize");
		var mySpotifyReqURL = releaseURL;
		$.ajax({
			url: mySpotifyReqURL,
			type: 'GET',
			dataType: 'json',
			error: function(err){
				console.log("getDiscogsInfo: error");
				console.log(err);
			},
			success: function(data){
				console.log("getDiscogsInfo: success");

				if(data.community && data.uri){
					app.populateDiscogsModal(
						data.artists[0].name, 
						track, 
						data.title, 
						data.year, 
						data.num_for_sale, 
						data.lowest_price, 
						data.community.have, 
						data.community.want, 
						data.community.rating.average, 
						data.community.rating.count, 
						"N/A", 
						id, 
						type);
				}
				// if(!data.community && data.uri){
				// 	app.populateDiscogsModal(data.artists[0].name, data.title, data.year, data.num_for_sale, data.lowest_price, "N/A", "N/A", "N/A", "N/A", data.uri, id, type);
				// }
				// if(data.community && data.uri){
				// 	app.populateDiscogsModal(data.artists[0].name, data.title, data.year, data.num_for_sale, data.lowest_price, data.community.have, data.community.want, data.community.rating.average, data.community.rating.count, data.uri, id, type);
				// }
				else{
					app.populateDiscogsModal(
						data.artists[0].name, 
						track, 
						data.title, 
						data.year, 
						data.num_for_sale, 
						data.lowest_price, 
						"N/A", 
						"N/A", 
						"N/A", 
						"N/A", 
						"N/A", 
						id, 
						type);
				}
			}
		});
	},

	populateDiscogsModal: function(artist, track, record, year, numForSale, lowestPrice, have, want, rating, numRatings, uri, id, type){
		console.log("populateDiscogsModal: entered");
		var that = id; 
		var moreHTML = '';
		moreHTML += "<tr class = even> <td> Artist </td><td>" + artist + "</td></tr>";
		moreHTML += "<tr> <td> Track </td> <td>" + track + "</td> </tr>";
		moreHTML += "<tr> <td> Record Name </td> <td>" + record + "</td> </tr>";
		moreHTML += "<tr> <td> Release Date </td> <td>" + year + "</td> </tr>";
		moreHTML += "<tr> <td> Number For Sale </td> <td>" + numForSale + "</td> </tr>";
		moreHTML += "<tr> <td> Lowest Price Available </td> <td> $" + lowestPrice + "</td> </tr>";
		moreHTML += "<tr> <td> Owned By </td> <td>" + have + "</td> </tr>";
		moreHTML += "<tr> <td>  Wanted By </td> <td>" + want + "</td> </tr>";
		moreHTML += "<tr> <td> Average Rating </td> <td>" + rating + "</td> </tr>";
		moreHTML += "<tr> <td> Number of Ratings </td> <td>" + numRatings + "</td> </tr>";
		moreHTML += "<tr> <td> Discogs Link </td> <td>" + uri + "</td> </tr>";
		moreHTML +=  "<tr> <td class='the-track'></td></tr>";
		if (type == 1){
			app.trackPreview(app.sortedplaylist[that].track.id);
			moreHTML += "<td> <img src='" + app.sortedplaylist[that].track.album.images[0].url + "'/> </td>";
		}
		else{
			app.trackPreview(app.sortedrecommendedTracks[that].id);
			moreHTML += "<td> <img src='" + app.sortedrecommendedTracks[that].album.images[0].url + "'/> </td>";
		}

		$('.DiscogsInfo').html(moreHTML);
	},

	trackPreview: function(id) {
		console.log("trackPreview: initialize");
		var key = localStorage.getItem("jammer");
		$.ajax({
			url: "https://api.spotify.com/v1/tracks/" + id,
			type: 'GET',
			dataType: 'json',
			headers: {
				'Authorization': 'Bearer ' + key
			},

			success: function(data) {
				console.log("trackPreview: success");
				var trackName = data.name;
				var url = data.preview_url;
				var audioElement = document.createElement('audio');
				audioElement.src = data.preview_url;
				audioElement.autoplay = 'true';
				audioElement.controls = 'true';
				$('.the-track').append(audioElement);
			},

			error: function() {
				console.log("trackPreview: error");
			}
		});
	},

/////////////////////////////////////////////////////////////DATA_VISUALIZATION/////////////////////////////////////////////////////////////

deeThreeExperiment: function(){
	console.log("deeThreeExperiment: entered");
	console.log(app.playlistTracks);
	var arr = $.map(app.playlistTracks, function (el) {
		return el.track.popularity;
	});
	console.log(arr);
	// console.log(app.playlistBPMS);
	// var experiment = [];
	// experiment = $.makeArray(app.playlistBPMS);

	// experiment = $.each(app.playlistBPMS.tempo);
	// console.log(experiment);

	d3.select("body").selectAll("p")
	.data(arr)
	.enter()
	.append("p")
	.text(arr);
},
};



























//  SCRAP PILESCRAP PILESCRAP PILESCRAP PILESCRAP PILESCRAP PILESCRAP PILESCRAP PILESCRAP PILE SCRAP PILESCRAP PILESCRAP PILESCRAP PILESCRAP PILESCRAP PILESCRAP PILESCRAP PILESCRAP PILE

/*

curl -X "POST" -H "Authorization: Basic MmI5NTk4YjU0NWRkNDQyMGJiOTViNmY0OGU4MTYyNmI6OTY0YThlN2I0OWM1NDA2ZWE2NTU0Mzk5MjYzZDcyM2U=" -d grant_type=client_credentials https://accounts.spotify.com/api/token

curl -X GET "https://api.spotify.com/v1/tracks/3n3Ppam7vgaVa1iaRUc9Lp" -H "Authorization: Bearer BQAhUlCFHXXOJ5BHR1g45AhUuT-fpaqQZ22oK_cOIf68T39YX406phiegI6ElQmeCBNFV2b_YFuEiG9CjsHmQQ"

*/

	// initializePlaylistClick: function() {
	// 	$(function(){
	// 		var ids = '';
	// 		var $tracks = $('li');
	// 		$tracks.on('click', function(){
	// 			console.log(this.id);
	// 			var recommendationID = app.playlistTracks[this.id].track.id;
	// 			var recommendationBPM = app.playlistBPMS[this.id].tempo;
	// 			console.log(recommendationID, recommendationBPM);
	// 			app.getSpotifyRecommendations(recommendationID);

	// 		});
	// 	});
	// },

	// makePlaylistHTML: function() {
	// 	// var theHTML = "<div class='playlistitems'>";
	// 	// theHTML += "</div>";
	// 	// $('main').append(theHTML);
	// 	// var moreHTML = '';
	// 	// for (var i = 0; i < app.playlistTracks.length; i++){
	// 	// 	moreHTML += "<li" + "  " + 'id=' + i + ">" + app.playlistBPMS[i].tempo + "  " + app.playlistTracks[i].track.artists[0].name + " - " + app.playlistTracks[i].track.name + "</li>" + "<br>";
	// 	// 	// + "class=" + "playlisto"
	// 	// 	// theHTML += "<img src='" + app.playlistTracks[i].track.album.images[0].url + "'/>";
	// 	// }
	// 	// $('.playlistitems').append(moreHTML);
	// 	// app.initializePlaylistClick();
	// 	app.sortPlaylist();
	// },

	// getUserPlaylists: function() {
	// 	var key = localStorage.getItem("jammer");
	// 	var mySpotifyKey = key;
	// 	console.log("Get User Playlists");
	// 	var spotifyURL = 'https://api.spotify.com/v1/users/';
	// 	var userID = "122514310";
	// 	var mySpotifyReqURL = spotifyURL + userID + "/playlists";
	// 	$.ajax({
	// 		url: mySpotifyReqURL,
	// 		type: 'GET',
	// 		dataType: 'json',
	// 		headers: {
	// 			'Authorization': 'Bearer ' + key

	// 		},
	// 		error: function(err){
	// 			console.log("Uh oh...");
	// 			console.log(err);
	// 		},
	// 		success: function(data){
	// 			//console.log(data);
	// 			console.log("I found some user playlists.");
	// 			console.log(data);
	// 		}
	// 	});
	// },