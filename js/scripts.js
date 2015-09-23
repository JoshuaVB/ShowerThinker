var animTime = 8000;
var delayAnim = 3000;
var delayThought = 10000;
var currentPost = -1;
var maxPost;
var thoughtLoop;
var autoPlay = true;

var settingsOpen = false;

$(document).ready(function(){
	cycleFog();
	nextThought();
});

$(document).on('keydown',function(e){
	switch (e.which) {
		case 37:
			prevThought();
			break;
		case 39:
			nextThought();
			break;
	}
});

$('#settings-toggle').on('click',function(){
	if (settingsOpen) {
		$(this).css('bottom',0);
		$('#settings-panel').css('bottom',-200);
		settingsOpen = false;
	} else {
		$(this).css('bottom',200);
		$('#settings-panel').css('bottom',0);
		settingsOpen = true;
	}
});

$('#progress-play').on('click',function(){
	if (autoPlay) { pause(); } else { play(); }
});

$('#progress-prev').on('click',function(){prevThought()});
$('#progress-next').on('click',function(){nextThought()});

function cycleFog() {
	$('#overlay').animate({
		opacity: 0.9
	},animTime,function(){
		$('#overlay').animate({
			opacity: 0.25
		},animTime,function(){
			setTimeout(function(){cycleFog()},delayAnim);
		});
	});
}

function getThought(){

	clearTimeout(thoughtLoop);
	if (currentPost>=maxPost) 	{ currentPost=0; }
	if (currentPost<0) 			{ currentPost=maxPost-1; }

	$.get( "https://www.reddit.com/r/Showerthoughts/.json", function( data ) {
		var $data = data;
		var $posts = $data.data.children;
		maxPost = $posts.length;

		var $loadPost = $posts[currentPost];
		var $loadText = $loadPost.data.title;

		$('#thought h3').empty().html($loadText);
	})
  .fail(function() {
    console.log( "error loading thought "+currentPost );
  })
  .always(function() {
    console.log( "finished loading thought "+currentPost );
    if (autoPlay) {
	    thoughtLoop = setTimeout(function(){nextThought()},delayThought);
	    timerRefresh();
	}
  });
}

function timerRefresh(){
	console.log('timer refreshed')
	$('#progress').stop().css('width','0').animate({
		'width':'100%'
	},delayThought);
}

function pause(){
	console.log('timer paused');
	clearTimeout(thoughtLoop);
	$('#progress').stop().css('width','0');
	$('#progress-play').find('i').removeClass('fa-play').addClass('fa-pause');
	autoPlay=false;
};

function play(){
	thoughtLoop = setTimeout(function(){getThought()},delayThought);
	$('#progress-play').find('i').removeClass('fa-pause').addClass('fa-play');
    timerRefresh();
    autoPlay=true;
}

function nextThought(){
	currentPost++;
	getThought();
}

function prevThought(){
	currentPost--;
	getThought();
}