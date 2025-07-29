import { useEffect, useRef } from 'react';

export default function WtVisionWebRtcViewer() {
    const videoRef = useRef(null);
    const signalingServer = 'https://monitor.wtvision.cloud:8888';
    const roomName = 'wTVision_R3';
    const targetPeer = 'Output';

    useEffect(() => {
        // Dynamically load socket.io and simplewebrtc
        const loadScripts = async () => {
            const loadScript = (src) =>
                new Promise((resolve, reject) => {
                    const script = document.createElement('script');
                    script.src = src;
                    script.onload = resolve;
                    script.onerror = reject;
                    document.body.appendChild(script);
                });

            try {
                await loadScript('https://monitor.wtvision.cloud:8888/socket.io/socket.io.js');
                await loadScript('https://monitor.wtvision.cloud:8888/js/simplewebrtc.bundle.js');

                const webrtc = new window.SimpleWebRTC({
                    url: signalingServer,
                    target: targetPeer,
                    iceServers: [
                        { urls: "stun:stun.l.google.com:19302" },
                        {
                            urls: "turn:monitor.wtvision.cloud:3478",
                            username: "wtv",
                            credential: "wtvtest",
                        },
                    ],
                    localVideoEl: '',
                    remoteVideosEl: '',
                    autoRequestMedia: false,
                    debug: false,
                });

                webrtc.on('readyToCall', () => {
                    webrtc.setInfo('', webrtc.connection.connection.id, '');
                    webrtc.joinRoom(roomName);
                });

                webrtc.on('videoAdded', (video, peer) => {
                    if (videoRef.current) {
                        videoRef.current.srcObject = video.srcObject || video;
                        videoRef.current.play().catch(console.error);
                    }
                });

                webrtc.on('videoRemoved', (video, peer) => {
                    if (videoRef.current) {
                        videoRef.current.srcObject = null;
                    }
                });

            } catch (err) {
                console.error("Failed to load WebRTC libraries:", err);
            }
        };

        loadScripts();
    }, []);

    return (
        <div >
            <video ref={videoRef} autoPlay playsInline controls width={400} />
        </div>
    );
}
