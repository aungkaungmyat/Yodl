let isAlreadyCalling = false;
let getCalled = false;

const PROD = true;

// const existingCalls = [];

// const { RTCPeerConnection, RTCSessionDescription } = window;

// const peerConnection = new RTCPeerConnection();

// function unselectUsersFromList() {
//   const alreadySelectedUser = document.querySelectorAll(
//     ".active-user.active-user--selected"
//   );

//   alreadySelectedUser.forEach(el => {
//     el.setAttribute("class", "active-user");
//   });
// }

// function createUserItemContainer(socketId) {
//   const userContainerEl = document.createElement("div");

//   const usernameEl = document.createElement("p");

//   userContainerEl.setAttribute("class", "active-user");
//   userContainerEl.setAttribute("id", socketId);
//   usernameEl.setAttribute("class", "username");
//   usernameEl.innerHTML = `Socket: ${socketId}`;

//   userContainerEl.appendChild(usernameEl);

//   userContainerEl.addEventListener("click", () => {
//     unselectUsersFromList();
//     userContainerEl.setAttribute("class", "active-user active-user--selected");
//     const talkingWithInfo = document.getElementById("talking-with-info");
//     talkingWithInfo.innerHTML = `Talking with: "Socket: ${socketId}"`;
//     callUser(socketId);
//   });

//   return userContainerEl;
// }

// async function callUser(socketId) {
//   const offer = await peerConnection.createOffer();
//   await peerConnection.setLocalDescription(new RTCSessionDescription(offer));

//   socket.emit("call-user", {
//     offer,
//     to: socketId
//   });
// }

// function updateUserList(socketIds) {
//   const activeUserContainer = document.getElementById("active-user-container");

//   socketIds.forEach(socketId => {
//     const alreadyExistingUser = document.getElementById(socketId);
//     if (!alreadyExistingUser) {
//       const userContainerEl = createUserItemContainer(socketId);

//       activeUserContainer.appendChild(userContainerEl);
//     }
//   });
// }

const socket = PROD ? io.connect("https://yodl.aws.andrewarpasi.com") : io.connect("localhost:7007")
let roomID = ''


navigator.mediaDevices.getUserMedia({ video: true, audio: true })
.then(function(stream) {
  console.log(stream)
    const localVideo = document.getElementById("local-video");
    if (localVideo) {
      localVideo.srcObject = stream;
    }
  /* use the stream */
})
.catch(function(err) {
  /* handle the error */
});

$('#submitSong').click((event) => {
  event.preventDefault();
  $.ajax({
    type: "POST",
    url: '/searchsong/' + document.querySelector("#songname").value + '/' + roomID,
    data: null,
    success: loadVideo
  });
})

$('#start-button').click((e) => {
  socket.emit('start_video', roomID)
  document.querySelector('#start-button').style.display = 'block'
})

function loadVideo(data, status) {
  if (status == 'success') {
    // $('#lyricVideo').src = data
    var url = data.replace("watch?v=", "embed/");
    document.querySelector('#lyricVideo').src = url
    socket.emit('set_video', {iframe: document.querySelector('#lyricVideo').outerHTML, roomID: roomID })
    $('#start-button').css('display','block');
  } else {
    console.log('error')
  }
}

socket.on("connect", () => {
  console.log("Sawkit kernekted")
  axios.get('/get_room').then(response => {
    roomID = response.data.roomID
    document.querySelector('#room-id').textContent = 'Room ID: ' + roomID
    document.querySelector('#room-id-share').textContent = 'Shareable link: ' + 'yodl.aws.andrewarpasi.com/vid.html?id=' + roomID
    socket.emit('create', roomID)
  })

  socket.on('room_start', () => {
    $("#lyricVideo")[0].src += "?autoplay=1&playsinline=1"
  })
})

// navigator.mediaDevices.getUserMedia(
//   { video: true, audio: true },
//   stream => {
//     console.log(stream)
//     const localVideo = document.getElementById("local-video");
//     if (localVideo) {
//       localVideo.srcObject = stream;
//     }
//   },
//   error => {
//     console.warn(error.message);
//   }
//  );

// socket.on("update-user-list", ({ users }) => {
//   updateUserList(users);
// });

// socket.on("remove-user", ({ socketId }) => {
//   const elToRemove = document.getElementById(socketId);

//   if (elToRemove) {
//     elToRemove.remove();
//   }
// });

// socket.on("call-made", async data => {
//   if (getCalled) {
//     const confirmed = confirm(
//       `User "Socket: ${data.socket}" wants to call you. Do accept this call?`
//     );

//     if (!confirmed) {
//       socket.emit("reject-call", {
//         from: data.socket
//       });

//       return;
//     }
//   }

//   await peerConnection.setRemoteDescription(
//     new RTCSessionDescription(data.offer)
//   );
//   const answer = await peerConnection.createAnswer();
//   await peerConnection.setLocalDescription(new RTCSessionDescription(answer));

//   socket.emit("make-answer", {
//     answer,
//     to: data.socket
//   });
//   getCalled = true;
// });

// socket.on("answer-made", async data => {
//   await peerConnection.setRemoteDescription(
//     new RTCSessionDescription(data.answer)
//   );

//   if (!isAlreadyCalling) {
//     callUser(data.socket);
//     isAlreadyCalling = true;
//   }
// });

// socket.on("call-rejected", data => {
//   alert(`User: "Socket: ${data.socket}" rejected your call.`);
//   unselectUsersFromList();
// });

// peerConnection.ontrack = function({ streams: [stream] }) {
//   const remoteVideo = document.getElementById("remote-video");
//   if (remoteVideo) {
//     remoteVideo.srcObject = stream;
//   }
// };

// navigator.mediaDevices.getUserMedia(
//   { video: true, audio: true },
//   stream => {
//     const localVideo = document.getElementById("local-video");
//     if (localVideo) {
//       localVideo.srcObject = stream;
//     }

//     stream.getTracks().forEach(track => peerConnection.addTrack(track, stream));
//   },
//   error => {
//     console.warn(error.message);
//   }
// );
