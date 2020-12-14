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
var userID = null


const beginCallBtn = document.getElementById('beginCallBtn')
beginCallBtn.addEventListener('click', beginCall)

const shareScreenBtn = document.getElementById('shareScreenBtn')
shareScreenBtn.addEventListener('click', shareScreen)

const joinBtn = document.getElementById('joinBtn')
joinBtn.addEventListener('click', joinRoom)

const getMediaBtn = document.getElementById('getMediaBtn')
getMediaBtn.addEventListener('click', getUserMedia)

const shareCameraBtn = document.getElementById('shareCameraBtn')
shareCameraBtn.addEventListener('click', shareCamera)


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

window.buttonShareScreen = function() {
    console.log("Play video share-screen");
    navigator.mediaDevices.getDisplayMedia({
        video: true,
        audio: true
    }).then(stream => {
        console.log('Gaining access to multimedia devices....')
        console.log('Local stream: ', stream)
        localVideo.srcObject = stream
        localStream = stream

        //localVideo.srcObject = localStream
        //        connectToNewUser(hostId, localStream)
        localVideo.srcObject = localStream

        console.log('Compartiendo video....')

        connectToNewUser(hostId, localStream)

    })
}

window.buttonShareCamera = function() {
    navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true
    }).then(stream => {
        console.log('Gaining access to multimedia devices....')
        console.log('Local stream: ', stream)
        localVideo.srcObject = stream
        localStream = stream

        localVideo.srcObject = localStream
        console.log('Compartiendo video....')
        connectToNewUser(hostId, localStream)
    })
}

window.buttonStopSharing = function() {
    console.log('Stop sharing...')
    localStream.getTracks()[0].stop()
}

window.buttonChangeRoom = function() {
    //window.location.reload();
    window.location = "./"
}

function shareScreen() {
    //    navigator.mediaDevices.getDisplayMedia({

    navigator.mediaDevices.getDisplayMedia({
        video: true,
        audio: true
    }).then(stream => {
        console.log('Gaining access to multimedia devices....')
        console.log('Local stream: ', stream)
        localVideo.srcObject = stream
        localStream = stream

        //localVideo.srcObject = localStream
        //        connectToNewUser(hostId, localStream)
        localVideo.srcObject = localStream

        console.log('Compartiendo video....')

        connectToNewUser(hostId, localStream)

    })



}


function shareCamera() {
    navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true
    }).then(stream => {
        console.log('Gaining access to multimedia devices....')
        console.log('Local stream: ', stream)
        localVideo.srcObject = stream
        localStream = stream

        localVideo.srcObject = localStream
        console.log('Compartiendo video....')
        connectToNewUser(hostId, localStream)
    })

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