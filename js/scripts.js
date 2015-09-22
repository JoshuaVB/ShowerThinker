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
	getThought();
});

$(document).on('keydown',function(e){
	switch (e.which) {
		case 37:
			autoPlay = false;
			currentPost--;
			getThought();
			break;
		case 39:
			autoPlay = false;
			currentPost++;
			getThought();
			break;
	}
})

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
	
})

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
	if (autoPlay) {currentPost++;}

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
    thoughtLoop = setTimeout(function(){getThought()},delayThought);
    timerAnimate();
  });;
}

function timerAnimate(){
	$('#progress').css('width','0').animate({
		'width':'100%'
	},delayThought);
}