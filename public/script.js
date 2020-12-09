const socket = io('/')
const videoGrid = document.getElementById('video-grid')
const localVideo = document.getElementById('localVideo')

const myPeer = new Peer(undefined, {
    host: '/',
    port: '3001'
})

const myVideo = document.createElement('video')
myVideo.muted = true
const peers = {}
var countParticipants = 0

var localStream = null
var hostId = null


const beginCallBtn = document.getElementById('beginCallBtn')
beginCallBtn.addEventListener('click', beginCall)

const shareScreenBtn = document.getElementById('shareScreenBtn')
shareScreenBtn.addEventListener('click', shareScreen)

const joinBtn = document.getElementById('joinBtn')
joinBtn.addEventListener('click', joinRoom)

const getMediaBtn = document.getElementById('getMediaBtn')
getMediaBtn.addEventListener('click', getUserMedia)


//console.log('Sharing screen...')


/* navigator.mediaDevices.getDisplayMedia({
    video: true,
    audio: true
}).then(stream => {
    console.log('Gaining access to multimedia devices....')
        //  Parte donde se agrega el video local al grid
        //  addVideoStream(myVideo, stream)
    console.log('Local stream: ', stream)
    localVideo.srcObject = stream
    localStream = stream
    myPeer.on('call', call => {
        console.log('Respondiendo llamada')
        console.log('Sharing stream...')
        console.log('Answer stream: ', stream)
        call.answer(stream)
        const video = document.createElement('video')
        video.style.borderColor = "blue"
        call.on('stream', userVideoStream => {
            //console.log('Host stream ', userVideoStream)

            if (countParticipants === 0) {
                console.log('Host stream ', userVideoStream)
                addVideoStream(video, userVideoStream)
                countParticipants++;
            }
        })
    })
}) */

myPeer.on('error', function(err) {
    console.log('Error: ', err);
});

socket.on('user-connected', userId => {
    console.log('New remote user-connected!: ', userId, '\nSending host stream...', localStream)
    hostId = userId
    if (localStream != null) {
        connectToNewUser(hostId, localStream)
    } else {
        console.log('localStream = null')
    }
    //connectToNewUser(hostId, localStream)
})

function shareScreen() {
    localVideo.srcObject = localStream
    console.log('Compartiendo video....')
    connectToNewUser(hostId, localStream)

}



function joinRoom() {
    console.log('Joining room....')
        //  Parte donde se agrega el video local al grid
        //  addVideoStream(myVideo, stream)
        //  console.log('Local stream: ', stream)
        //  localVideo.srcObject = stream
        //  localStream = stream
    myPeer.on('call', call => {
        console.log('Respondiendo llamada')
        console.log('Sharing stream...')
            //  console.log('Answer stream: ', stream)
        call.answer(localStream)
        const video = document.createElement('video')
        video.style.borderColor = "blue"
        call.on('stream', userVideoStream => {
            //console.log('Host stream ', userVideoStream)

            if (countParticipants === 0) {
                console.log('Host stream ', userVideoStream)
                addVideoStream(video, userVideoStream)
                countParticipants++;
            }
        })
    })
}


//ya no es necesario
function beginCall() {
    // navigator.mediaDevices.getDisplayMedia({
    //    video: true,
    //    audio: true
    //}).then(stream => {
    console.log('Starting call....')
        //  Parte donde se agrega el video local al grid
        //  addVideoStream(myVideo, stream)
        //console.log('Local stream: ', stream)
    localVideo.srcObject = localStream
        // localStream = stream
    myPeer.on('call', call => {
            console.log('Respondiendo llamada')
            console.log('Sharing stream...')
            console.log('Answer stream: ', stream)
            call.answer(stream)
            const video = document.createElement('video')
            video.style.borderColor = "blue"
            call.on('stream', userVideoStream => {
                //console.log('Host stream ', userVideoStream)

                if (countParticipants === 0) {
                    console.log('Host stream ', userVideoStream)
                    addVideoStream(video, userVideoStream)
                    countParticipants++;
                }
            })
        })
        //})
}

myPeer.on('call', call => {
    //console.log('Respondiendo llamada')
    //console.log('Sharing stream...')
    //console.log('Answer stream: ', stream)
    call.answer()
    const video = document.getElementById('remoteVideo')
    video.style.borderColor = "blue"
    call.on('stream', userVideoStream => {
        //console.log('Host stream ', userVideoStream)

        if (countParticipants === 0) {
            console.log('Host stream ', userVideoStream)
            addVideoStream(video, userVideoStream)
            countParticipants++;
        }
    })
})

function getUserMedia() {
    navigator.mediaDevices.getDisplayMedia({
        video: true,
        audio: true
    }).then(stream => {
        console.log('Gaining access to multimedia devices....')
        console.log('Local stream: ', stream)
        localVideo.srcObject = stream
        localStream = stream
    })
}

/*     const video = document.getElementById('videon');
    video.srcObject = stream;

    // demonstrates how to detect that the user has stopped
    // sharing the screen via the browser UI.
    stream.getVideoTracks()[0].addEventListener('ended', () => {
        errorMsg('The user has ended sharing the screen');
        startButton.disabled = false;
    }); */



socket.on('user-disconnected', userId => {
    if (peers[userId]) peers[userId].close()
})

myPeer.on('open', id => {
    console.log('Joining room...')
    console.log('ROOM_ID: ', ROOM_ID, '\nPeer ID (userId): ', id)
    socket.emit('join-room', ROOM_ID, id)
})

myPeer.on('error', function(err) {
    console.log('Error: ', err);
});



function connectToNewUser(userId, stream) {
    console.log('Connecting with new user...')
    console.log('Iniciando llamada...')
    const call = myPeer.call(userId, stream)
    console.log('Call data: ', call)
    console.log('Connected with: ', userId)
    const video = document.getElementById('remoteVideo')

    var sharevideo = document.querySelector('a-video');
    console.log('a-video: ', sharevideo.attributes);



    call.on('stream', userVideoStream => {
        console.log('Receiving remote stream: ', userVideoStream)
            //addVideoStream(video, userVideoStream)
    })

    call.on('close', () => {
        video.remove()
    })

    peers[userId] = call
}

function addVideoStream(video, stream) {
    video.srcObject = stream
    console.log('addVideoStream', stream)
    video.addEventListener('loadedmetadata', () => {
        video.play()
    })
    videoGrid.append(video)
}