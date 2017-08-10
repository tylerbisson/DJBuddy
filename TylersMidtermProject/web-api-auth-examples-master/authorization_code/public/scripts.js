var app = {

	playlistName : '',

	playlistTracks : [],
	playlistBPMS : [],
	recommendedTracks : [],
	sortedrecommendedTracks : [],
	recommendationBPMS : [],
	sortedrecommendationBPMS : [],
	sortedplaylist: [],
	sortedBPMS: [],

	/////////////////////////////////////////////////////////////SEARCH/////////////////////////////////////////////////////////////

	search: function() {

	// send a chat msg
	$("#playlistSearch").click(function(){
		var query = $('#searchInput').val();
		var playlistPosOne = query.search("playlist");
		playlistPosOne = playlistPosOne + 9;
		var playlistID = query.slice(playlistPosOne, query.length);

		var userPos = query.search("user");
		var playlistPosTwo = query.search("playlist");
		playlistPosTwo = playlistPosTwo - 1;
		userPos = userPos + 5;
		var userID = query.slice(userPos, playlistPosTwo);

		app.getPlaylist(playlistID, userID);
		app.initializeNavClick();

	});
},

	/////////////////////////////////////////////////////////////INITIALIZATION/////////////////////////////////////////////////////////////


	initializeNavClick: function(){
		console.log("initializeNavClick: entered");
		$(function(){
			var $navButtons = $('li');
			$navButtons.on('click', function(){
				console.log(this);
			});
		});
	},

	getPlaylist: function(playlistID, userID) {
		var key = localStorage.getItem("jammer");
		console.log("getPlaylist: initialize");
		var spotifyURL = 'https://api.spotify.com/v1/users/';
		// var userID = "122514310";
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
				console.log("getPlaylist: success");
				app.playlistTracks = data.tracks.items;
				app.getBPMandKey();
				app.playlistName = data.name;
				console.log(data);
				console.log(data.name);
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
		var theHTML = "<h3>" + app.playlistName + "</h3>";
		theHTML += "<table class='playlistitems'>";
		theHTML += "<tr> <th> Artist </th> <th> Track </th> <th> Pop </th> <th> BPM </th> </tr>";
		theHTML += "</table>" ;
		$('.playlist').append(theHTML);
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
			moreHTML += "<td class= pop" + i + ">" + app.sortedplaylist[i].track.popularity + "</td>";
			moreHTML += "<td class= temp" + i + ">" + app.sortedBPMS[i].tempo + "</td>";
			moreHTML += "</tr>";
		}

		$('.playlistitems').append(moreHTML);

		var arrpop = $.map(app.sortedplaylist, function (el) {
			return el.track.popularity;
		});

		for (var j = 0; j < app.playlistTracks.length; j++){
			$(".pop" + j).css("color", "hsl(" + Math.round(250 * ((100-arrpop[j])/100)) + ",100%,50%)");
		}

		var arr = $.map(app.sortedBPMS, function (el) {
			return el.tempo;
		});

		for (var z = 0; z < arr.length; z++){
			switch (true){
				case arr[z] < 60:
				$(".temp" + z).css("color", '#000000');
				break;
				case arr[z] >= 60 && arr[z] < 70:
				$(".temp" + z).css("color", '#000066');
				break;
				case arr[z] >= 70 && arr[z] < 80:
				$(".temp" + z).css("color", '#0000ff');
				break;
				case arr[z] >= 80 && arr[z] < 90:
				$(".temp" + z).css("color", '#0080ff');
				break;
				case arr[z] >= 90 && arr[z] < 100:
				$(".temp" + z).css("color", '#00bfff');
				break;
				case arr[z] >= 100 && arr[z] < 110:
				$(".temp" + z).css("color", '#00ffff');
				break;
				case arr[z] >= 110 && arr[z] < 120:
				$(".temp" + z).css("color", '#00ffbf');
				break;
				case arr[z] >= 120 && arr[z] < 130:
				$(".temp" + z).css("color", '#00ff00');
				break;
				case arr[z] >= 130 && arr[z] < 140:
				$(".temp" + z).css("color", '#bfff00');
				break;
				case arr[z] >= 140 && arr[z] < 150:
				$(".temp" + z).css("color", '#ffff00');
				break;
				case arr[z] >= 150 && arr[z] < 160:
				$(".temp" + z).css("color", '#ffbf00');
				break;
				case arr[z] >= 160 && arr[z] < 170:
				$(".temp" + z).css("color", '#ff8000');
				break;
				case arr[z] >= 170 && arr[z] < 180:
				$(".temp" + z).css("color", '#ff4000');
				break;
				case arr[z] >= 180 && arr[z] < 190:
				$(".temp" + z).css("color", '#ff0000');
				break;
				case arr[z] >= 190 && arr[z] < 200:
				$(".temp" + z).css("color", '#800040');
				break;
				case arr[z] >= 200:
				$(".temp" + z).css("color", '#660033');
				break;	
			}
		}

		app.initializeSortedClick();
		app.makeDiscogsModal();
		app.deeThreeExperimentTWO();
	},

	/////////////////////////////////////////////////////////////RECOMMENDATIONS_COLUMN/////////////////////////////////////////////////////////////


	initializeSortedClick: function() {
		console.log("initializeSortedClick: entered");
		$(function(){
			var ids = '';
			var $tracks = $('.playlist tr');
			$tracks.on('click', function(){
				switch (true){
					case (parseInt(this.id)) == 0:
					var arecommendationID = app.sortedplaylist[this.id].track.id;
					var arecommendationBPM = app.sortedBPMS[this.id].tempo;
					var arecommendationIDdown = app.sortedplaylist[parseInt(this.id)+1].track.id;
					var arecommendationIDdowndown = app.sortedplaylist[parseInt(this.id)+2].track.id;
					var arecommendationIDdowndowndown = app.sortedplaylist[parseInt(this.id)+3].track.id;
					var arecommendationIDdowndowndowndown = app.sortedplaylist[parseInt(this.id)+4].track.id;
					app.getSpotifyRecommendations(arecommendationID, arecommendationBPM, arecommendationIDdown, arecommendationIDdowndown, arecommendationIDdowndowndown, arecommendationIDdowndowndowndown);
					break;
					case (parseInt(this.id)) == 1:
					var brecommendationID = app.sortedplaylist[this.id].track.id;
					var brecommendationBPM = app.sortedBPMS[this.id].tempo;
					var brecommendationIDup = app.sortedplaylist[parseInt(this.id)-1].track.id;
					var brecommendationIDdown = app.sortedplaylist[parseInt(this.id)+1].track.id;
					var brecommendationIDdowndown = app.sortedplaylist[parseInt(this.id)+2].track.id;
					var brecommendationIDdowndowndown = app.sortedplaylist[parseInt(this.id)+3].track.id;
					app.getSpotifyRecommendations(brecommendationID, brecommendationBPM, brecommendationIDup, brecommendationIDdown, brecommendationIDdowndown, brecommendationIDdowndowndown);
					break;
					case (parseInt(this.id)) == (app.playlistTracks.length-1):
					var zrecommendationID = app.sortedplaylist[this.id].track.id;
					var zrecommendationBPM = app.sortedBPMS[this.id].tempo;
					var zrecommendationIDup = app.sortedplaylist[parseInt(this.id)-1].track.id;
					var zrecommendationIDupup = app.sortedplaylist[parseInt(this.id)-2].track.id;
					var zrecommendationIDupupup = app.sortedplaylist[parseInt(this.id)-3].track.id;
					var zrecommendationIDupupupup = app.sortedplaylist[parseInt(this.id)-4].track.id;
					app.getSpotifyRecommendations(zrecommendationID, zrecommendationBPM, zrecommendationIDup, zrecommendationIDupup, zrecommendationIDupupup, zrecommendationIDupupupup);
					break;
					case (parseInt(this.id)) == (app.playlistTracks.length-2):
					var yrecommendationID = app.sortedplaylist[this.id].track.id;
					var yrecommendationBPM = app.sortedBPMS[this.id].tempo;
					var yrecommendationIDup = app.sortedplaylist[parseInt(this.id)-1].track.id;
					var yrecommendationIDupup = app.sortedplaylist[parseInt(this.id)-2].track.id;
					var yrecommendationIDupupup = app.sortedplaylist[parseInt(this.id)-3].track.id;
					var yrecommendationIDdown = app.sortedplaylist[parseInt(this.id)+1].track.id;
					app.getSpotifyRecommendations(yrecommendationID, yrecommendationBPM, yrecommendationIDup, yrecommendationIDupup, yrecommendationIDupupup, yrecommendationIDdown);
					break;
					default:
					var recommendationID = app.sortedplaylist[this.id].track.id;
					var recommendationBPM = app.sortedBPMS[this.id].tempo;
					var recommendationIDup = app.sortedplaylist[parseInt(this.id)-1].track.id;
					var recommendationIDupup = app.sortedplaylist[parseInt(this.id)-2].track.id;
					var recommendationIDdown = app.sortedplaylist[parseInt(this.id)+1].track.id;
					var recommendationIDdowndown = app.sortedplaylist[parseInt(this.id)+2].track.id;
					app.getSpotifyRecommendations(recommendationID, recommendationBPM, recommendationIDup, recommendationIDupup, recommendationIDdown, recommendationIDdowndown);
					break;
				}
			});
		});
	},

	getSpotifyRecommendations: function(recommendationID, recommendationBPM, recommendationIDup, recommendationIDupup, recommendationIDdown, recommendationIDdowndown) {
		console.log("getSpotifyRecommendations: initialize");
		var key = localStorage.getItem("jammer");
		var spotifyURL = 'https://api.spotify.com/v1/recommendations?seed_tracks=';
		spotifyURL += recommendationID + ",";
		spotifyURL += recommendationIDup + ",";
		spotifyURL += recommendationIDupup + ",";
		spotifyURL += recommendationIDdown + ",";
		spotifyURL += recommendationIDdowndown + ",";
		spotifyURL += "&target_tempo=";
		spotifyURL += recommendationBPM;
		spotifyURL += "&limit=50";
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
		var theHTML = "<h3 class= 'rex' > recommendations </h3>";
		theHTML += "<table class='recommendationstable'>";
		theHTML += "<tr> <th> Artist </th> <th> Track </th> <th> Pop </th> <th> BPM </th> </tr>";
		theHTML += "</table>" ;
		$('.recommendations').html(theHTML);
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
			moreHTML += "<td class= recpop" + i + ">" + app.sortedrecommendedTracks[i].popularity + "</td>";
			moreHTML += "<td class= rectemp" + i + ">" + app.sortedrecommendationBPMS[i].tempo + "</td>";
			moreHTML += "</tr>";
		}

		$('.recommendationstable').append(moreHTML);

		var poparr = $.map(app.sortedrecommendedTracks, function (el) {
			return el.popularity;
		});

		for (var k = 0; k < app.sortedrecommendedTracks.length; k++){
			$(".recpop" + k).css("color", "hsl(" + Math.round(250 * ((100-poparr[k])/100)) + ",100%,50%)");
		}

		var arr = $.map(app.sortedrecommendationBPMS, function (el) {
			return el.tempo;
		});

		for (var z = 0; z < arr.length; z++){
			switch (true){

				case arr[z] < 60:
				$(".rectemp" + z).css("color", '#000000');
				break;
				case arr[z] >= 60 && arr[z] < 70:
				$(".rectemp" + z).css("color", '#000066');
				break;
				case arr[z] >= 70 && arr[z] < 80:
				$(".rectemp" + z).css("color", '#0000ff');
				break;
				case arr[z] >= 80 && arr[z] < 90:
				$(".rectemp" + z).css("color", '#0080ff');
				break;
				case arr[z] >= 90 && arr[z] < 100:
				$(".rectemp" + z).css("color", '#00bfff');
				break;
				case arr[z] >= 100 && arr[z] < 110:
				$(".rectemp" + z).css("color", '#00ffff');
				break;
				case arr[z] >= 110 && arr[z] < 120:
				$(".rectemp" + z).css("color", '#00ffbf');
				break;
				case arr[z] >= 120 && arr[z] < 130:
				$(".rectemp" + z).css("color", '#00ff00');
				break;
				case arr[z] >= 130 && arr[z] < 140:
				$(".rectemp" + z).css("color", '#bfff00');
				break;
				case arr[z] >= 140 && arr[z] < 150:
				$(".rectemp" + z).css("color", '#ffff00');
				break;
				case arr[z] >= 150 && arr[z] < 160:
				$(".rectemp" + z).css("color", '#ffbf00');
				break;
				case arr[z] >= 160 && arr[z] < 170:
				$(".rectemp" + z).css("color", '#ff8000');
				break;
				case arr[z] >= 170 && arr[z] < 180:
				$(".rectemp" + z).css("color", '#ff4000');
				break;
				case arr[z] >= 180 && arr[z] < 190:
				$(".rectemp" + z).css("color", '#ff0000');
				break;
				case arr[z] >= 190 && arr[z] < 200:
				$(".rectemp" + z).css("color", '#800040');
				break;
				case arr[z] >= 200:
				$(".rectemp" + z).css("color", '#660033');
				break;	
			}
		}

		app.makeRecommendationDiscogsModal();
	},

	/////////////////////////////////////////////////////////////PLAYLIST_MODAL/////////////////////////////////////////////////////////////

	makeDiscogsModal: function(){
		console.log("makeDiscogsModal: entered");
		$(function(){
			var ids = '';
			var $tracks = $('.playlist tr');
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
			var $tracks = $('.recommendations tr');
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
				console.log(data);
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

				switch (true){
					case data.community && data.uri:
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
					break;
					case !data.community && data.uri:
					app.populateDiscogsModal(
						data.artists[0].name, 
						data.title, 
						data.year, 
						data.num_for_sale, 
						data.lowest_price, 
						"N/A", 
						"N/A", 
						"N/A", 
						"N/A", 
						data.uri, 
						id, 
						type);
					break;
					case data.community && !data.uri:
					app.populateDiscogsModal(
						data.artists[0].name, 
						data.title, 
						data.year, 
						data.num_for_sale, 
						data.lowest_price, 
						data.community.have, 
						data.community.want, 
						data.community.rating.average, 
						data.community.rating.count, 
						data.uri, 
						id, 
						type);
					break;
					default:
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

		if (type == 1){
			moreHTML += '"<tr> <td colspan="2" > <iframe src="https://open.spotify.com/embed/track/' + app.sortedplaylist[that].track.id + '" width="100%" height="500" frameborder="0" allowtransparency="true"></iframe> </td> </tr>';
		}
		else{
			moreHTML += '"<tr> <td colspan="2"> <iframe src="https://open.spotify.com/embed/track/' + app.sortedrecommendedTracks[that].id + '" width="100%" height="500" frameborder="0" allowtransparency="true"></iframe> </td> </tr>';
		}
		moreHTML += '<tr> <td colspan= "2"> <h2>Discogs Info</h2> </td> </tr>';
		moreHTML += "<tr class = oddmod> <td> Artist </td><td>" + artist + "</td></tr>";
		moreHTML += "<tr> <td> Track </td> <td>" + track + "</td> </tr>";
		moreHTML += "<tr class = oddmod> <td> Record Name </td> <td>" + record + "</td> </tr>";
		moreHTML += "<tr> <td> Release Date </td> <td>" + year + "</td> </tr>";
		moreHTML += "<tr class = oddmod> <td> Number For Sale </td> <td>" + numForSale + "</td> </tr>";
		moreHTML += "<tr> <td> Lowest Price Available </td> <td> $" + lowestPrice + "</td> </tr>";
		moreHTML += "<tr class = oddmod> <td> Owned By </td> <td>" + have + "</td> </tr>";
		moreHTML += "<tr> <td>  Wanted By </td> <td>" + want + "</td> </tr>";
		moreHTML += "<tr class = oddmod> <td> Average Rating </td> <td>" + rating + "</td> </tr>";
		moreHTML += "<tr> <td> Number of Ratings </td> <td>" + numRatings + "</td> </tr>";
		moreHTML += "<tr class = oddmod> <td> Discogs Link </td> <td>" + uri + "</td> </tr>";
		moreHTML += "<tr> <td class='the-track'></td></tr>";

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


/////////////////////////////////////////////////////////////DATA_VISUALIZATION_PIE/////////////////////////////////////////////////////////////


deeThreeExperimentTWO: function(){

	var a=0;
	var b=0;
	var c=0;
	var d=0;
	var e=0;
	var f=0;
	var g=0;
	var h=0;
	var i=0;
	var j=0;
	var k=0;
	var l=0;
	var m=0;
	var n=0;
	var o=0;
	var p=0;


	var arr = $.map(app.playlistBPMS, function (el) {
		return el.tempo;
	});

	for (var z = 0; z < arr.length; z++){
		switch (true){

			case arr[z] < 60:
			a+=1;
			break;
			case arr[z] >= 60 && arr[z] < 70:
			b+=1;
			break;
			case arr[z] >= 70 && arr[z] < 80:
			c+=1;
			break;
			case arr[z] >= 80 && arr[z] < 90:
			d+=1;
			break;
			case arr[z] >= 90 && arr[z] < 100:
			e+=1;
			break;
			case arr[z] >= 100 && arr[z] < 110:
			f+=1;
			break;
			case arr[z] >= 110 && arr[z] < 120:
			g+=1;
			break;
			case arr[z] >= 120 && arr[z] < 130:
			h+=1;
			break;
			case arr[z] >= 130 && arr[z] < 140:
			i+=1;
			break;
			case arr[z] >= 140 && arr[z] < 150:
			j+=1;
			break;
			case arr[z] >= 150 && arr[z] < 160:
			k+=1;
			break;
			case arr[z] >= 160 && arr[z] < 170:
			l+=1;
			break;
			case arr[z] >= 170 && arr[z] < 180:
			m+=1;
			break;
			case arr[z] >= 180 && arr[z] < 190:
			n+=1;
			break;
			case arr[z] >= 190 && arr[z] < 200:
			o+=1;
			break;
			case arr[z] >= 200:
			p+=1;
			break;	
		}
	}

	(function(d3) {
		'use strict';

		var dataset = [
		{ label: '-60 bpm', count: a },
		{ label: '60 - 70 bpm', count: b },
		{ label: '70 - 80 bpm', count: c },
		{ label: '80 - 90 bpm', count: d },
		{ label: '90 - 100 bpm', count: e },
		{ label: '100 - 110 bpm', count: f },
		{ label: '110 - 120 bpm', count: g },
		{ label: '120 - 130 bpm', count: h },
		{ label: '130 - 140 bpm', count: i },
		{ label: '140 - 150 bpm', count: j },
		{ label: '150 - 160 bpm', count: k },
		{ label: '160 - 170 bpm', count: l },
		{ label: '170 - 180 bpm', count: m },
		{ label: '180 - 190 bpm', count: n },
		{ label: '190 - 200 bpm', count: o },
		{ label: '200+ bpm', count: p },
		];

		var width = 600;
		var height = 600;
		var radius = Math.min(width, height) / 2;
		var donutWidth = 75;
		var legendRectSize = 18;                                  
		var legendSpacing = 4;                                    

		var color = d3.scaleOrdinal().range([
			'#000000', 
			'#000066', 
			'#0000ff', 
			'#0080ff', 
			'#00bfff', 
			'#00ffff', 
			'#00ffbf', 
			'#00ff00', 
			'#bfff00', 
			'#ffff00', 
			'#ffbf00', 
			'#ff8000', 
			'#ff4000', 
			'#ff0000', 
			'#800040', 
			'#660033']);

		var svg = d3.select('#chart')
		.append('svg')
		.attr('width', width)
		.attr('height', height)
		.append('g')
		.attr('transform', 'translate(' + (width / 2) +
			',' + (height / 2) + ')');

		var arc = d3.arc()
		.innerRadius(radius - donutWidth)
		.outerRadius(radius);

		var pie = d3.pie()
		.value(function(d) { return d.count; })
		.sort(null);

		var path = svg.selectAll('path')
		.data(pie(dataset))
		.enter()
		.append('path')
		.attr('d', arc)
		.attr('fill', function(d, i) {
			return color(d.data.label);
		});

		var legend = svg.selectAll('.legend')                     
		.data(color.domain())                                   
		.enter()                                                
		.append('g')                                            
		.attr('class', 'legend')                                
		.attr('transform', function(d, i) {                     
			var height = legendRectSize + legendSpacing;          
			var offset =  height * color.domain().length / 2;     
			var horz = -2 * legendRectSize;                       
			var vert = i * height - offset;                       
			return 'translate(' + horz + ',' + vert + ')';        
		});                                                     

		legend.append('rect')                                     
		.attr('width', legendRectSize)                          
		.attr('height', legendRectSize)                         
		.style('fill', color)                                   
		.style('stroke', color);                                

		legend.append('text')                                     
		.attr('x', legendRectSize + legendSpacing)              
		.attr('y', legendRectSize - legendSpacing)              
		.text(function(d) { return d; });                       

	})(window.d3);

},
};






//  SCRAP PILESCRAP PILESCRAP PILESCRAP PILESCRAP PILESCRAP PILESCRAP PILESCRAP PILESCRAP PILE SCRAP PILESCRAP PILESCRAP PILESCRAP PILESCRAP PILESCRAP PILESCRAP PILESCRAP PILESCRAP PILE

/////////////////////////////////////////////////////////////DATA_VISUALIZATION/////////////////////////////////////////////////////////////

// deeThreeExperiment: function(){

// 	var arr = $.map(app.playlistTracks, function (el) {
// 		return el.track.popularity;
// 	});

// 	d3.select(".chart")
// 	.selectAll("div")
// 	.data(arr)
// 	.enter()
// 	.append("div")
// 	.style("width", function(d) { return d * 10 + "px"; })
// 	.style("background-color", function(d) { return "hsl(" + Math.round(250 * ((100-d)/100)) + ",100%,50%)"; })
// 	.text(function(d) { return d; });

// },

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
			// d3.selectAll(".playlistitems")
		// // .forEach()
		// .data(arr)
		// .style("color", function(d) { return "hsl(" + Math.round(250 * ((100-d)/100)) + ",100%,50%)"; });
