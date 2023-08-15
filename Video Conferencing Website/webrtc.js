// HTML elements
const localVideo = document.getElementById('local-video');
const remoteVideo = document.getElementById('remote-video');
const chatInput = document.getElementById('chat-input');
const chatMessages = document.getElementById('chat-messages');
const sendButton = document.getElementById('send-button');

// WebRTC setup
const configuration = {
    iceServers: [
        { urls: 'stun:stun.l.google.com:19302' },
    ],
};

let localStream;
let peerConnection;

// Access user's camera and microphone
navigator.mediaDevices.getUserMedia({ video: true, audio: true })
    .then(stream => {
        localStream = stream;
        localVideo.srcObject = localStream;
        createPeerConnection();
    })
    .catch(error => {
        console.error('Error accessing camera and microphone:', error);
    });

function createPeerConnection() {
    peerConnection = new RTCPeerConnection(configuration);

    // Add local stream to peer connection
    localStream.getTracks().forEach(track => {
        peerConnection.addTrack(track, localStream);
    });

    peerConnection.ontrack = event => {
        if (!remoteVideo.srcObject) {
            remoteVideo.srcObject = event.streams[0];
        }
    };

    // Handle ICE candidates
    peerConnection.onicecandidate = event => {
        if (event.candidate) {
            sendSignalingData({ type: 'ice-candidate', candidate: event.candidate });
        }
    };

    // Create offer
    peerConnection.createOffer()
        .then(offer => peerConnection.setLocalDescription(offer))
        .then(() => {
            sendSignalingData({ type: 'offer', sdp: peerConnection.localDescription });
        })
        .catch(error => {
            console.error('Error creating offer:', error);
        });

    // Chat message handling
    sendButton.addEventListener('click', () => {
        const message = chatInput.value;
        sendMessageToRemote(message);
        chatInput.value = '';
    });
}

// Signaling setup using WebSockets
const ws = new WebSocket('ws://your-signaling-server-url');

ws.addEventListener('open', () => {
    console.log('WebSocket connection opened.');
});

ws.addEventListener('message', event => {
    const message = JSON.parse(event.data);
    
    if (message.type === 'offer') {
        handleOfferMessage(message);
    } else if (message.type === 'answer') {
        handleAnswerMessage(message);
    } else if (message.type === 'ice-candidate') {
        handleIceCandidateMessage(message);
    }
});

function sendSignalingData(data) {
    ws.send(JSON.stringify(data));
}

function handleOfferMessage(message) {
    const remoteDescription = new RTCSessionDescription(message.sdp);
    peerConnection.setRemoteDescription(remoteDescription)
        .then(() => peerConnection.createAnswer())
        .then(answer => peerConnection.setLocalDescription(answer))
        .then(() => {
            sendSignalingData({ type: 'answer', sdp: peerConnection.localDescription });
        })
        .catch(error => {
            console.error('Error handling offer:', error);
        });
}

function handleAnswerMessage(message) {
    const remoteDescription = new RTCSessionDescription(message.sdp);
    peerConnection.setRemoteDescription(remoteDescription)
        .catch(error => {
            console.error('Error handling answer:', error);
        });
}

function handleIceCandidateMessage(message) {
    const candidate = new RTCIceCandidate(message.candidate);
    peerConnection.addIceCandidate(candidate)
        .catch(error => {
            console.error('Error handling ICE candidate:', error);
        });
}

function sendMessageToRemote(message) {
    // Implement your method of sending chat messages to the remote peer here
    // This could involve sending over the WebSocket connection or another method
    // Remember to handle message receiving on the remote side as well
}

ws.addEventListener('open', () => {
    console.log('WebSocket connection opened.');
});

ws.addEventListener('message', event => {
    const message = JSON.parse(event.data);

    if (message.type === 'offer') {
        handleOfferMessage(message);
    } else if (message.type === 'answer') {
        handleAnswerMessage(message);
    } else if (message.type === 'ice-candidate') {
        handleIceCandidateMessage(message);
    } else if (message.type === 'chat') {
        displayReceivedChatMessage(message);
    }
});

// Send chat messages to the remote peer
function sendChatMessage(message) {
    sendSignalingData({ type: 'chat', message });
}

// Display chat messages in the UI
function displayReceivedChatMessage(message) {
    const chatMessagesContainer = document.getElementById('chat-messages');
    const newMessageElement = document.createElement('div');
    newMessageElement.textContent = message;
    chatMessagesContainer.appendChild(newMessageElement);
}

// Event listener for the "Send" button
sendButton.addEventListener('click', () => {
    const message = chatInput.value;
    if (message.trim() !== '') {
        sendChatMessage(message);
        chatInput.value = '';
    }
});