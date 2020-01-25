let isAlreadyCalling = false;
let getCalled = false;

const PROD = false;

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

const socket = PROD ? io.connect("wss://yodl.aws.andrewarpasi.com") : io.connect("localhost:7007")

let offerCreated = false
let activeStream = null

const { RTCPeerConnection, RTCSessionDescription } = window
const peerConnection = new RTCPeerConnection({
  'iceServers': [
    {
      'urls': 'stun:stun.l.google.com:19302'
    },
    {
      'urls': 'turn:192.158.29.39:3478?transport=udp',
      'credential': 'JZEOEt2V3Qb0y27GRntt2u2PAYA=',
      'username': '28224511:1379330808'
    },
    {
      'urls': 'turn:192.158.29.39:3478?transport=tcp',
      'credential': 'JZEOEt2V3Qb0y27GRntt2u2PAYA=',
      'username': '28224511:1379330808'
    }
  ]
});

// create our webrtc connection
const webrtc = new SimpleWebRTC({
  // the id/element dom element that will hold "our" video
  localVideoEl: 'local-video',
  // the id/element dom element that will hold remote videos
  remoteVideosEl: 'remote-videos',
  // immediately ask for camera access
  autoRequestMedia: true,
  debug: false,
  detectSpeakingEvents: true,
  autoAdjustMic: false,
});


const startVideo = () => {
  console.log("Should start video!")
  navigator.mediaDevices.getUserMedia({ video: true, audio: true })
  .then(function(stream) {
    console.log(stream)
      const localVideo = document.getElementById("local-video");
      if (localVideo) {
        localVideo.srcObject = stream;
      }

      stream.getTracks().forEach(track => peerConnection.addTrack(track, stream));
      /* use the stream */
  })
  .catch(function(err) {
    /* handle the error */
  });

  peerConnection.ontrack = function({ streams: [stream] }) {
    const remoteVideo = document.getElementById("remote-video");
    if (remoteVideo) {
      remoteVideo.srcObject = stream;
    } else {
      console.log("FUCc")
    }
  };
}

socket.on("connect", () => {
  console.log("Sawkit kernekted")

  console.log("id: ", socket.id)

  socket.on("room_ready", roomID => {
    // start sending video
    console.log("Joined room", roomID)

    socket.on("video", data => {
      console.log("Got video data", data)
      if (data.type === "offer") {
        console.log("Got an offer!")
        peerConnection.setRemoteDescription(new RTCSessionDescription(data.offer)).then(() => {
          peerConnection.createAnswer().then(answer => {
            peerConnection.setLocalDescription(new RTCSessionDescription(answer)).then(() => {
              socket.emit("video", {
                roomID,
                type: "answer",
                answer,
              })
            })
          })
        })
      }
      // if (data.type === "answer") {
      //   startVideo();
      // }
      //console.log('recvd data', data)
    })
  })

  socket.on("chat_ready", roomID => {
    startVideo();
  })
})

// Create offer to join video session
const runKaraoke = () => {
  document.getElementById('statusLabel').innerText = "Awaiting peer to join..."

  socket.emit("join", {})

  socket.on("start_offer", roomID => {
    document.getElementById('statusLabel').innerText = "In room with peer."

    setTimeout(() => {
      peerConnection.createOffer().then(offer => {
        peerConnection.setLocalDescription(new RTCSessionDescription(offer)).then(() => {
          console.log("Emitting offer", offer)
          socket.emit("video", {
            roomID,
            type: "offer",
            offer,
          })
        })
      })
    }, 250)

    offerCreated = true;
  })
}

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
