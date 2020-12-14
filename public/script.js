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
var participantsId = []
var sharevideo = document.querySelector('a-video');



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
        participantsId.forEach(element => {
            console.log(element)
            connectToNewUser(element, localStream)
        });


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
        participantsId.forEach(element => {
            console.log(element)
            connectToNewUser(element, localStream)
        });

        //        connectToNewUser(hostId, localStream)
    })
}

window.buttonStopSharing = function() {
    console.log('Stop sharing...')
        //localStream.getTracks()[0].stop()
    localStream.getTracks().forEach((track) => {
        track.stop();
    });
    localStream = null

    participantsId.forEach(element => {
        console.log(element)
        peers[element].close()
    });

    participantsId.forEach(element => {
        connectToUserAgain(element, localStream)
    });
    //var call = myPeer.call(userID, localStream)
    //const video = document.getElementById('remoteVideo')

    //video.srcObject = localStream
    //video.remove()
    //console.log('Host stream ', userVideoStream)
    //connectToUserAgain(userID, localStream)
}

window.buttonChangeRoom = function() {
    //window.location.reload();
    window.location = "./"
}



myPeer.on('call', call => {
    const video = document.getElementById('remoteVideo')
    video.remove()
    console.log('Contestando llamada...')
    console.log('Reciviendo streaming...')
        //console.log('Sharing stream...')
        //console.log('Answer stream: ', stream)
    call.answer()
    video.style.borderColor = "blue"

    call.on('stream', userVideoStream => {
        console.log('Host stream ', userVideoStream)

        console.log(countParticipants)
            //if (countParticipants === 0) {
        console.log('Host stream ', userVideoStream)
        addVideoStream(video, userVideoStream)
        countParticipants++;
        //}
    })
})



socket.on('user-disconnected', userId => {
    if (peers[userId]) {
        peers[userId].close()
    }
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
        /*const call = ''

        if (participantsId.length > 1) {
            const call = myPeer.call(userId, stream)
            console.log('Call data: ', call)
            console.log('Connected with: ', userId)
            const video = document.getElementById('remoteVideo')
            userID = userId

            participantsId.push(userId)
            console.log('a-video: ', sharevideo.attributes);


            /*call.on('stream', userVideoStream => {
                console.log('Receiving remote stream: ', userVideoStream)
                    //addVideoStream(video, userVideoStream)
            })*/

    /*call.on('close', () => {
            video.remove()
        })

        peers[userId] = call
        console.log(userId)
        console.log(peers[userId])
    } else {

    }*/
    const call = myPeer.call(userId, stream)
    console.log('Call data: ', call)
    console.log('Connected with: ', userId)
    const video = document.getElementById('remoteVideo')
    userID = userId

    participantsId.push(userId)
    console.log('a-video: ', sharevideo.attributes);


    /*call.on('stream', userVideoStream => {
        console.log('Receiving remote stream: ', userVideoStream)
            //addVideoStream(video, userVideoStream)
    })*/

    call.on('close', () => {
        video.remove()
    })

    peers[userId] = call
        //console.log(userId)
        //console.log(peers[userId])

}

function connectToUserAgain(userId, stream) {
    console.log('Connecting with new user...')
    console.log('Iniciando llamada...')
    const call = myPeer.call(userId, stream)
    console.log('Call data: ', call)
    console.log('Connected with: ', userId)
    const video = document.getElementById('remoteVideo')

    var sharevideo = document.querySelector('a-video');
    console.log('a-video: ', sharevideo.attributes);


    peers[userId] = call
    console.log(userId)
    console.log(peers[userId])
}


function addVideoStream(video, stream) {
    video.srcObject = stream
        //console.log('addVideoStream', stream)
    video.addEventListener('loadedmetadata', () => {
        video.play()
    })
    videoGrid.append(video)
}