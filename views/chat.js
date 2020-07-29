var socket = io("/");
var username = "<%=username%>";

socket.emit("username", username);

function clearChat() {
  var e = document.querySelector("#messages");
  var child = e.lastElementChild;
  while (child) {
    e.removeChild(child);
    child = e.lastElementChild;
  }
}
var btn = (document.getElementById("clear").onclick = function () {
  clearChat();
});

Date.prototype.toShortFormat = function () {
  let monthNames = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  let day = this.getDate();
  let monthIndex = this.getMonth();
  let monthName = monthNames[monthIndex];
  let year = this.getFullYear();
  return `${day}-${monthName}-${year}`;
};

var today = new Date().toShortFormat();

$("form").submit(function (e) {
  e.preventDefault(); // prevents page reloading
  socket.emit("chat_message", $("#txt").val());
  $("#txt").val("");
  return false;
});

socket.on("chat_message", function (msg, uname) {
  if (uname != username) {
    const imgChar = uname.charAt(0);
    $("#messages").append(
      $(`   <div class="media w-50 mb-3">
            <figure class="figure">

            <img 
        title=${uname}
        src="http://placehold.it/50/55C1E7/fff&text=${imgChar.toUpperCase()}" alt=${uname} width="50" class="rounded-circle">
     
        </figure>  
        <div class="media-body ml-2">
            <div class="bg-light rounded py-2 px-3 mb-1">
              <p class="text-small mb-0 text-muted text-wrap">
                ${msg}</p>
            </div>
            <p class="small text-muted">${today}</p>
          </div>
        </div>`)
    );
  } else {
    $("#messages").append(
      $(`  
            <div class="media w-50 ml-auto mb-3">
              <div class="media-body">
            <div class="bg-secondary rounded py-2 px-3 mb-2">
              <p class="text-small mb-0 text-white">
                ${msg}</p>
            </div>
            <p class="small text-muted">${today}</p>
          </div>
       <span class="chat-img right clearfix  mx-2">
                   <img 
                                src="http://placehold.it/50/FA6F57/fff&text=ME"
                                 alt="ME" class="img-circle"
                                 class='img-rounded' />
                        </span>
        </div>
        `)
    );
  }
});

socket.on("userExist", (msg) => {
  alert(msg);
});

socket.on("is_online", function (username, userList) {
  for (var activeUser in userList) {
    $("#users").append(
      $(`<span class="chat-img right clearfix  mx-2">
                   <img 
                                src="http://placehold.it/50/FA6F57/fff&text=${activeUser
                                  .charAt(0)
                                  .toUpperCase()}"
                                 alt=${activeUser} class="img-circle"
                                 class='img-rounded' />
                        </span>`)
    );
  }
  $("#messages").append($("<div class='alert alert-info'>").html(username));
});
