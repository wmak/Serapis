var total = 15;
var offset = $(document).height()*0.4; //when to start loading
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
   console.log(response);
   if (response.status === "connected"){
    apiCall();
   }
  });
}

function FbLogin(){
 FB.login(function(){
  apiCall();
 }, {
  scope: 'read_stream'
 });
}

function apiCall(){
 $("#loading-bar").html('<img src=loading.gif style="height:50px;display:block;margin-left:auto;margin-right:auto">');
 FB.api(
  "/me/home?limit=" + total,
  function (r) {
   if (r && !r.error){
    genFeed(r);
   }
  }
 );
}

var test;
function genFeed(r){
 test = r;
 for (var i=total-15; i < r.data.length; i++){
  current = r.data[i];
  time = Math.round((new Date().getTime() - new Date(current.created_time).getTime())/(3600000)*10)/10
  $("#fb-feed").append(
   $("#template").jqote({
    up : (current.likes && current.likes.data.length) || 0,
    commentlink : (current.actions && current.actions[0].link),
    comments : (current.comments && current.comments.data.length) || 0,
    upvote : (current.actions && current.actions[1] && current.actions[1].link),
    title : current.story || current.message,
    created : time, 
    author : current.from.name,
    link : current.link || (current.actions && current.actions[0].link),
    picture : current.picture,
    id : current.from.id
   })
  );
  total += 1;
 }
 
 $("#fb-go").html("<a> Facebook </a>");
 $("#loading-bar").html('');
}

$(window).scroll(function() {
   if($(window).scrollTop() + $(window).height() > $(document).height() - offset) {
       apiCall();
   }
});
