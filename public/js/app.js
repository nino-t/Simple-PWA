/* eslint-disable */
if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register("/serviceworker.js").then(function(registration) {
    console.log("Service Worker registered with scope:", registration.scope);
  }).catch(function(err) {
    console.log("Service Worker registration failed:", err);
  });
}

$(document).ready(function() {
  populateMessages();
});

var populateMessages = function() {
  getMessages().then(renderMessages);
};

function messageEnter(e) { 
  e = e || window.event;
  var key = e.keyCode ? e.keyCode : e.which;
  if (key == 13) {
    e.preventDefault();
    chatOnSubmit();
  }
}

function chatOnSubmit () {
  var $uiMessage = $("#input");
  var messageData = { 
    id: Date.now().toString().substring(3, 11),
    user_id: 1,
    replay_id: 0,
    message: $uiMessage.val(),
    created_at: moment().format('YYYY-MM-DD HH:mm:ss'),
    status: 'Sending'
  }

  addToObjectStore("messages", messageData);
  renderMessage(messageData);

  if ("serviceWorker" in navigator && "SyncManager" in window) {
    navigator.serviceWorker.ready.then(function(registration) {
      registration.sync.register("sync-messages");
    });
  } else {
    $.ajax({
      type: "POST",
      url: "http://localhost:3000/api/v1/messages",
      dataType: "json",
      data: messageData,
      success: function(data) {
        console.log("Your ajax data success to created", data);
      }
    });  
  }

  $uiMessage.val('');
  return false;
}

function renderMessages(messages) {
  if (!_.isUndefined(messages.data) && !_.isUndefined(messages.status)) {
    messages = messages.data;
  }

  messages.forEach(function(message) {
    renderMessage(message);
  });
}

function renderMessage (message) {
  var html = "";
  if (message["user_id"] === 1) {
    html += '<div class="message-wrapper me">';
  } else {
    html += '<div class="message-wrapper them">';
  }
    html += '<div class="circle-wrapper animated bounceIn"></div>';
    html += '<div class="text-wrapper">'+ message["message"] +'</div>';
  html += '</div>';

  $("#content").append(html);
}