$.urlParam = function(name){
    var results = new RegExp('[\?&]' + name + '=([^&#]*)').exec(window.location.href);
    if (results==null) {
       return null;
    }
    return decodeURI(results[1]) || 0;
}

theme = 0;
humor = [];
liked = false;
likelist = [];
function modHumor (catId, catDef, amount = 0) {
	console.log(catId, catDef, amount)
	let cf = humor.filter( el => el.catId === catId); // category found
	if (cf.length == 1) {
		cf[0].amount += amount;
	}else{
		humor.push({
			catId: catId,
			catDef: catDef,
			amount: amount
		})
	}
}
function printHumor(){
	$("#score-content").hide("fast",function(){
		let htmlContent = "";
		for (let i = 0 ; i < humor.length; i++){
			
			htmlContent += "<button type=\"button\" class=\"btn scr btn-primary\"> "+humor[i].catDef+" <span class=\"badge badge-light\">"+humor[i].amount+"</span></button>";
		}
		$("#score-content").html(htmlContent);
		$("#score-content").show("fast");
	});
}

let jokeClass = {
	cur_joke: {},
	get: (id) => {
		return new Promise((resolve,reject) => {
			$.getJSON(`/joke/${id}`).done(function ( data ) {
				resolve(data.data)
			}).fail(function ( err ) {
				reject(err);
			})
		})
	},
	getRnd: () => {
		return new Promise((resolve,reject) => {
			$.getJSON(`/jokes/getRand/`).done(function ( data ) {
				resolve(data.data)
			}).fail(function ( err ) {
				reject(err);
			})
		})
	},
	up: (id) => {
		return new Promise((resolve,reject) => {
			$.getJSON(`/joke/${id}/upvote`).done(function ( data ) {
				resolve(data.data)
			}).fail(function ( err ) {
				reject(err);
			})
		})
	},
	down: (id) => {
		return new Promise((resolve,reject) => {
			$.getJSON(`/joke/${id}/downvote`).done(function ( data ) {
				resolve(data.data)
			}).fail(function ( err ) {
				reject(err);
			})
		})
	},
}

function setLikeButton(state){
	console.log(state)
	if (state){
		$('.cmd-like').removeClass('heart-da').addClass('heart-en');
	}else{
		$('.cmd-like').removeClass('heart-en').addClass('heart-da');
	}
}

async function getWitz(action = 0,id = -1){
	switch(action){
		case 0:
			jokeClass.cur_joke = await jokeClass.getRnd(); break;
		case 1:
			jokeClass.cur_joke = await jokeClass.up(id); break;
		case 2:
			jokeClass.cur_joke = await jokeClass.down(id); break;
		case 3:
			jokeClass.cur_joke = await jokeClass.get(id); break;
	}
	liked = (likelist.includes(jokeClass.cur_joke.id))
	setLikeButton(liked);
    $("#content").hide("fast", function () {
		$("#joke-title").text(jokeClass.cur_joke.category);
		$("#joke-source").text(jokeClass.cur_joke.author);
		$("#joke-text").html(jokeClass.cur_joke.text);
		$("#content").show("fast");
	});
}

$('.cmd-next').click(function() {
	modHumor(jokeClass.cur_joke.categoryId,jokeClass.cur_joke.category,-50);
	getWitz(2,jokeClass.cur_joke.id);
	printHumor();
	
});

$('.cmd-more').click(function() {
	modHumor(jokeClass.cur_joke.categoryId,jokeClass.cur_joke.category,50);
	getWitz(1,jokeClass.cur_joke.id);
	printHumor();
});

$('.cmd-like').click(function() {
	liked = !liked;
	setLikeButton(liked);
	if (liked && !likelist.includes(jokeClass.cur_joke.id)){
		likelist.push(jokeClass.cur_joke.id);
	}else{
		likelist = likelist.filter(el => el !== jokeClass.cur_joke.id);
	}
	console.log(likelist)
	
});

$('.cmd-likes').click(function() {
	renderFavList();
	$('.popup-bg-likes').fadeIn('fast');
});

$('.cmd-close-likes').click(function() {
	$('.popup-bg-likes').fadeOut('fast');
	
});

async function renderFavList (){
	let html = "";
	for (let i = 0; i < likelist.length  ; i++){
		let joke = await jokeClass.get(likelist[i]);
		console.log(joke)
		html += renderFavJoke(joke);
	}
	$("#favList").html(html)
	for (let i = 0; i < likelist.length  ; i++){
		$(`#like-remove-${likelist[i]}`).click(function() {
			$(`#liked-joke-${likelist[i]}`).fadeOut('fast');
			likelist = likelist.filter(el => el !== likelist[i]);
			renderFavList();
		});
	}
}

function renderFavJoke(joke){
	let template = $("#j-template").html();
	template = template.replace("{{category}}",joke.category)
	template = template.replace("{{author}}",joke.author)
	template = template.replace("{{text}}",joke.text)
	template = template.replace("{{id}}",joke.id)
	const final = (`<div class="liked-joke" id="liked-joke-${joke.id}">${template}</div>`)
	return final;
}

// ANiMATION

let anim_rows = 50;
$( document ).ready(function() {
	$(function () {
		$('[data-toggle="tooltip"]').tooltip()
	})
	$('.popup-bg-likes').hide()
	// randomize theme
	theme = Math.round(Math.random()*5);
	if (theme < 3){
		$("#gradient-fill").addClass(`bg-fill-s${theme + 1}`);
	
		anim_rows= (window.innerWidth / 68 ) + (window.innerHeight / 68);
		generateBackground(anim_rows);
	}else if(theme > 2){
		$(".background").append("<div id='particles-js'></div>")
		particlesJS.load('particles-js', `particles_${theme - 2}.json`, function() { });
		$("#particles-js").addClass(`particles-js${theme - 2}`);
	}
	
	try {
		const tmp = JSON.parse($.cookie("score"));
		humor = tmp.humor;
		likelist = tmp.likes;
	}catch{ }
	printHumor();
	
	const reqJoke = $.urlParam('wid');
	console.log(reqJoke)
	if (reqJoke){
		getWitz(3,reqJoke);
	}else{
		getWitz();
	}
	
	$('#wasted').text(Math.floor((new Date - start) / 1000)  + " Sekunden");
});



$(window).on('resize', function(){
      var win = $(this); //this = window
	  anim_rows= (win.width() / 68) + (win.height() / 68);
	  if (theme < 3){
		generateBackground(anim_rows);
	  }
	  
});

$(window).on("unload", function(e) {
    $.cookie("score", JSON.stringify({
		humor: humor,
		likes: likelist
	}));
});

const start = new Date;

setInterval(function() {
    $('#wasted').text(Math.floor((new Date - start) / 1000)  + " Sekunden");
}, 1000);

function generateBackground(rows){

	let fullhmtl = ""
	for (let i = 0; i < rows;i++){
		const speed = Math.floor(Math.random() * 20 ) +20
		const css = "animation: " + speed + "s linear infinite slide;"
		fullhmtl += "<div class='single-line' style='" + css + "'></div>"
	}

	$("#bg-content").html(fullhmtl);
	
}

function calculateMapping(){
	let min = 1000000000;
	let max = -1000000000;
	
	for (let i = 0 ; i < humor.length; i++){
		if(humor[i].scr < min){
			min = humor[i].scr 
		}
	}
	
	const offset = (min * -1);
	let sum = 0;
	for (let i = 0 ; i < humor.length; i++){
		sum += (humor[i].scr + offset);
	}
	for (let i = 0 ; i < humor.length; i++){
		const percentage = ((humor[i].scr + offset) / sum);
		console.log(percentage);
	}
}
