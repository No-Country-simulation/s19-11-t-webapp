import { useRef, useState, useEffect } from "react";
import io from "socket.io-client"; // Make sure to npm install socket.io-client

const VideoChat = () => {
  const [isCallActive, setIsCallActive] = useState(false);
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const peerConnection = useRef(null);
  const socket = useRef(null);

  useEffect(() => {
    // Initialize Socket.IO connection
    socket.current = io("http://localhost:3003", {
      withCredentials: true,
    });

    socket.current.on("connect", () => {
      console.log("Connected to Socket.IO server");
    });

    socket.current.on("message", (data) => {
      console.log("Mensaje recibido del servidor:", data);

      try {
        switch (data.type) {
          case "offer":
            handleReceiveOffer(data.offer);
            break;
          case "answer":
            handleReceiveAnswer(data.answer);
            break;
          case "ice-candidate":
            handleReceiveIceCandidate(data.candidate);
            break;
          default:
            break;
        }
      } catch (error) {
        console.error("Error processing socket message:", error);
      }
    });

    return () => {
      if (socket.current) {
        socket.current.disconnect();
      }
      if (peerConnection.current) {
        peerConnection.current.close();
      }
    };
  }, []);

  const startCall = async () => {
    try {
      const localStream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });
      localVideoRef.current.srcObject = localStream;

      const pc = new RTCPeerConnection({
        iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
      });

      pc.ontrack = (event) => {
        remoteVideoRef.current.srcObject = event.streams[0];
      };

      localStream
        .getTracks()
        .forEach((track) => pc.addTrack(track, localStream));

      pc.onicecandidate = (event) => {
        if (event.candidate) {
          socket.current.emit("message", {
            type: "ice-candidate",
            candidate: event.candidate,
          });
        }
      };

      peerConnection.current = pc;

      // Create and send offer
      const offer = await pc.createOffer();
      await pc.setLocalDescription(offer);

      socket.current.emit("message", { type: "offer", offer });

      setIsCallActive(true);
    } catch (error) {
      console.error("Error accessing media devices:", error);
    }
  };

  const handleReceiveOffer = async (offer) => {
    try {
      const pc = new RTCPeerConnection({
        iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
      });

      pc.ontrack = (event) => {
        remoteVideoRef.current.srcObject = event.streams[0];
      };

      pc.onicecandidate = (event) => {
        if (event.candidate) {
          socket.current.emit("message", {
            type: "ice-candidate",
            candidate: event.candidate,
          });
        }
      };

      const localStream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });
      localVideoRef.current.srcObject = localStream;
      localStream
        .getTracks()
        .forEach((track) => pc.addTrack(track, localStream));

      peerConnection.current = pc;

      await pc.setRemoteDescription(new RTCSessionDescription(offer));
      const answer = await pc.createAnswer();
      await pc.setLocalDescription(answer);

      socket.current.emit("message", { type: "answer", answer });

      setIsCallActive(true);
    } catch (error) {
      console.error("Error handling received offer:", error);
    }
  };

  const handleReceiveAnswer = async (answer) => {
    try {
      await peerConnection.current.setRemoteDescription(
        new RTCSessionDescription(answer)
      );
    } catch (error) {
      console.error("Error handling received answer:", error);
    }
  };

  const handleReceiveIceCandidate = async (candidate) => {
    try {
      await peerConnection.current.addIceCandidate(
        new RTCIceCandidate(candidate)
      );
    } catch (error) {
      console.error("Error adding received ICE candidate:", error);
    }
  };

  const endCall = () => {
    if (peerConnection.current) {
      peerConnection.current.close();
    }

    setIsCallActive(false);
  };

  return (
    <div className="videoChatContainer">
      <div className="videos">
        <video
          ref={localVideoRef}
          autoPlay
          muted
          className="localVideo"
        ></video>
        <video ref={remoteVideoRef} autoPlay className="remoteVideo"></video>
      </div>
      <div className="controls">
        {!isCallActive ? (
          <button onClick={startCall} className="startButton">
            Start Call
          </button>
        ) : (
          <button onClick={endCall} className="endButton">
            End Call
          </button>
        )}
      </div>
    </div>
  );
};

export default VideoChat;
