/* eslint-disable */
if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register("/serviceworker.js").then(function(registration) {
    console.log("Service Worker registered with scope:", registration.scope);
  }).catch(function(err) {
    console.log("Service Worker registration failed:", err);
  });
}

$(document).ready(function() {
  var html = "";
  $.get("http://localhost:3000/messages.json", function(data) {
    if (!_.isUndefined(data.data)) {
      var messages = data.data;
      messages.map(function (message, index) {
        html += renderMessage(message);
      });
    }

    if (html !== '') {
      $("#content").html(html);
    }
  });
});

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
  $.ajax({
    type: "POST",
    url: "http://localhost:3000/api/v1/messages",
    dataType: "json",
    data: {
      message: $uiMessage.val()
    },
    success: function(data) {
      var html = renderMessage(data.data);
      $("#content").append(html);
    }
  });

  $uiMessage.val('');
  return false;
}

function renderMessage (message) {
  var html = "";
  if (message.user_id === 1) {
    html += '<div class="message-wrapper me">';
  } else {
    html += '<div class="message-wrapper them">';
  }
    html += '<div class="circle-wrapper animated bounceIn"></div>';
    html += '<div class="text-wrapper">'+ message.message +'</div>';
  html += '</div>';

  return html;
}