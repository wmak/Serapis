var total = 25;
var offset = $(document).height()*0.4; //when to start loading
var last;
function Gen(){
 $.getJSON("http://www.reddit.com/.json?count=25&after=" + last, function(response){
  front = response.data.children
  apiCall(front);
 });
}

(function(d, s, id) {
 var js, fjs = d.getElementsByTagName(s)[0];
 if (d.getElementById(id)) {return;}
 js = d.createElement(s); js.id = id;
 js.src = "//connect.facebook.net/en_US/all.js";
 fjs.parentNode.insertBefore(js, fjs);
}(document, 'script', 'facbebook-jssdk'));

window.fbAsyncInit = function() {
 FB.init({
  appId : '420413834760858',
  status : true,
  xfbml : true
 });
 FB.getLoginStatus(function(response){
  if (response.status === "connected"){
   Gen();
  }
 });
}

function FbLogin(){
 FB.login(function(){
  Gen();
 }, {
  scope: 'read_stream'
 });
}

function apiCall(front){
 $("#loading-bar").html('<img src=loading.gif style="height:50px;display:block;margin-left:auto;margin-right:auto">');
 FB.api(
  "/me/home?limit=" + total,
  function (r) {
   if (r && !r.error){
    return fbFeed(r, front);
   }
  }
 );
}

function fbFeed(r, front){
 for (var i=total-25; i < r.data.length; i++){
  current = r.data[i];
  time = Math.round((new Date().getTime() - new Date(current.created_time).getTime())/(3600000)*10)/10
  $("#feed").append($("#template").jqote({
    up : (current.likes && current.likes.data.length) || 0,
    commentlink : (current.actions && current.actions[0].link),
    comments : (current.comments && current.comments.data.length) || 0,
    upvote : (current.actions && current.actions[1] && current.actions[1].link),
    title : current.story || current.message,
    created : time, 
    author : current.from.name,
    link : current.link || (current.actions && current.actions[0].link),
    picture : current.picture,
    id : "http://www.facebook.com/" + current.from.id,
    rank : "fb",
    subreddit : "facebook"
   }));
  current = front[i%25].data;
  time = Math.round((new Date().getTime() - new Date(current.created_utc*1000).getTime())/(3600000)*10)/10
  $("#feed").append($("#template").jqote({
    up : current.ups - current.downs,
    commentlink : "http://reddit.com" + current.permalink,
    comments : current.num_comments,
    upvote : 0, //TODO
    title : current.title,
    created : time,
    author : current.author,
    link : current.url,
    picture : (current.thumbnail == "self" && undefined) || current.thumbnail,
    id : "http://reddit.com/u/" + current.author,
    rank : "rd", 
    subreddit: current.subreddit,
   }));
   total += 1;
   console.log(total);
 }
 last = current.name;
 $("#fb-go").html("<a> Facebook </a>");
 $("#loading-bar").html('');
}

$(window).scroll(function() {
 if (total<100){
   if($(window).scrollTop() + $(window).height() > $(document).height() - offset) {
    Gen();
   }
 } else {
  $("#loading-bar").html("<h1>End of page</h1>");
 }
});
