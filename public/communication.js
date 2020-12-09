var idPacticipant = '';
var hideButton = document.querySelector('.hide');
var instructions = document.querySelector('.instructions');
hideButton.onclick = function(evt) {
    instructions.classList.toggle('hidden');
    this.textContent = instructions.classList.contains('hidden') ? 'Show' : 'Hide';
    return false;
};

var detail = '';
var room = document.querySelector('[sharedspace]');
room.addEventListener('enterparticipant', function(evt) {
    //var detail = evt.detail;
    detail = evt.detail;
    console.log('-------------------------------------------------------------');
    console.log("isConnected(): " + room.components.sharedspace.isConnected());
    console.log('Un nuevo participante se ha unido a la sala');
    console.log("Id participant: " + detail.id + ' - position: ' + detail.position);
    console.log('-------------------------------------------------------------');
});

// Configuracion para cuando se agrega un nuevo avatar
room.addEventListener('avataradded', function onAdded(evt) {
    var avatar = evt.detail.avatar;
    console.log("Id participant: " + detail.id + ' - position: ' + detail.position);
    //console.log('Avatar params: ' + JSON.stringify(avatar.attributes))
    console.log('Avatar attributes: ');
    console.log(avatar.attributes);
    console.log('Position: ');
    console.log(avatar.getAttribute('position'));
    console.log('Camera: ');
    console.log(avatar.getAttribute('camera'));
    //Esto permite hacer algo con la camara q no se que ajajaja
    avatar.setAttribute('camera', 'false');
    //console.log(avatar.getAttribute('camera'));
    if (!avatar.hasLoaded) {
        avatar.addEventListener('loaded', onAdded.bind(null, evt));
        return;
    }

    var center = { x: 0, z: 0 };
    var avatarY = avatar.getAttribute('position').y;
    console.log('Avatar current position: ' +
        center.x + ', ' +
        avatarY + ', ' +
        center.z);
    avatar.object3D.lookAt(new THREE.Vector3(
        center.x, avatarY, center.z
    ));

    var radToDeg = THREE.Math.radToDeg;
    var rotation = avatar.object3D.rotation;
    rotation.y += Math.PI;
    avatar.setAttribute('rotation', {
        x: radToDeg(rotation.x),
        y: radToDeg(rotation.y),
        z: radToDeg(rotation.z)
    });
    console.log('Avatar new position: ' +
        avatar.getAttribute('position').x + ' ' +
        avatar.getAttribute('position').y + ' ' +
        avatar.getAttribute('position').z);

    console.log('Avatar rotation: ' +
        avatar.getAttribute('rotation').x + ' ' +
        avatar.getAttribute('rotation').y + ' ' +
        avatar.getAttribute('rotation').z);
});

room.addEventListener('exitparticipant', function(evt) {
    var detail = evt.detail;
    console.log("isConnected(): " + room.components.sharedspace.isConnected());
    console.log('Un participante se ha desconectado de la sala');
    console.log("Id participant: " + detail.id + ' - position: ' + detail.position);
});

var roomName = window.location.search.substr(1);
if (!roomName) {
    roomName = Date.now() + '';
    console.log('Room name: ' + window.location + '?' + roomName);
    history.pushState({}, '', window.location + '?' + roomName);
}
connect();

function connect() {
    console.log('**Connect**');
    var scene = document.querySelector('a-scene');
    var allObjects = document.querySelector('*');
    for (var i = 0; i < allObjects.length; i++) {
        console.log('Element: ' + allObjects[i]);
    }
    if (!scene.hasLoaded) {
        scene.addEventListener('loaded', connect);
        return;
    }

    window.addEventListener('keydown', function(evt) {
        if (evt.keyCode === 17 /* Ctrl-left */ ) {
            var preset = getNextPreset();
            setEnvironment(preset);
            room.components.sharedspace.send('*', { type: 'environment', preset: preset });
            //text.setAttribute('value','cabez mapa');
        }
    });




    var text = document.querySelector('[text]');
    console.log('Text: ' + text.getAttribute('text').value);



    // Función que permite setear un nuevo preset
    function setText(message) {
        console.log('setText');
        text.setAttribute('text', { value: message });
    }

    function sendMessage() {
        var currentMessage = text.getAttribute('text').value;
        return currentMessage;
    }


    window.enter = function() {
        var textField = document.getElementById("test_input");
        //textField.value=globalMessage;
        console.log('tag-name: ' + textField.tagName);
        console.log('value: ' + textField.value);
        //console.log('position: '+textField.position);
        var text = document.querySelector('a-gui-input ');
        //console.log("width: "+text.getAttribute('width'));
        //console.log("height: "+text.getAttribute('height'));
        console.log("Mensaje: " + globalMessage);
        var gmssgl = globalMessage.length;
        console.log("Length: " + gmssgl);
        console.log("test input Attributes: " + textField.getAttributeNames());

        //Aqui se hace la magia
        var message = sendMessage() + '\n' + idPacticipant + ' /SAY-->: ' + globalMessage;
        setText(message);
        room.components.sharedspace.send('*', { type: 'text', value: message });


        for (var i = (gmssgl - 1); i >= 0; i--) {
            console.log(i + " " + globalMessage[i]);
            textField.components["gui-input"].delete();
        }
        console.log('Enviando Mensaje...');
        globalMessage = "";
        textField.value = globalMessage;
        console.log('value: ' + textField.value);
        console.log("enter");
    }




    //document.querySelector('#showVideo').addEventListener('click', e => init(e));


    room.addEventListener('participantmessage', function(evt) {
        idPacticipant = evt.detail.id;
        //console.log('---------------------*-------*-*-----------');
        //console.log('Id participante: ');
        //console.log(idPacticipant);
        //console.log('---------------------*-------*-*-----------');
        if (evt.detail.message.type === 'text') {
            var message = evt.detail.message.value + globalMessage;
            setText(message);
        }
    });

    room.addEventListener('participantstream', function(evt) {
        idPacticipant = evt.detail;
        console.log('---------------------*-------*-*-----------');
        console.log('Stream participante: ', idPacticipant);
    });

    room.setAttribute('sharedspace', { room: roomName, hold: false });
}

// Select link on click.
var link = document.querySelector('.link');
link.textContent = window.location.href;
link.onclick = function() {
    var range = document.createRange();
    range.selectNode(link);
    var selection = document.getSelection();
    selection.empty();
    selection.addRange(range);
};