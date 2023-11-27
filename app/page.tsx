import * as React from "react";
import "./styles.css";
import { useRoomConnection } from '@whereby.com/browser-sdk/react'
import IconButton from "./components/IconButton";
import ChatInput from "./components/ChatInput";

// Change this to your own room URL.
const ROOM_URL = "https://rodsbecker.whereby.com/test01d7e4c3e8-4b2b-4a97-8de5-8f908ead363c";

export default function App() {
  const [isCameraActive, setIsCameraActive] = React.useState(true);
  const [isMicrophoneActive, setIsMicrophoneActive] = React.useState(true);
  const [
    isLocalScreenshareActive,
    setIsLocalScreenshareActive
  ] = React.useState(false);
  const messagesBottomRef = React.useRef<HTMLDivElement>(null);
  const roomConnection = useRoomConnection(ROOM_URL, {
    localMediaOptions: {
      audio: true,
      video: true
    }
  });

  const { actions, components, state } = roomConnection;
  const { VideoView } = components;
  const {
    localParticipant,
    remoteParticipants,
    screenshares,
    chatMessages
  } = state;
  const {
    toggleCamera,
    toggleMicrophone,
    startScreenshare,
    stopScreenshare,
    sendChatMessage
  } = actions;

  function getDisplayName(id: string) {
    return remoteParticipants.find((p) => p.id === id)?.displayName || "Guest";
  }

  function scrollToNewMessage() {
    messagesBottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }

  React.useEffect(() => {
    scrollToNewMessage();
  }, [chatMessages]);

  return (
    <div className="App">
      <div className="left-section">
        <div className="chat-wrapper">
          {chatMessages.map((msg) => (
            <>
              <p className="chat-message">{msg.text}</p>
              <p className="chat-message-name">
                {msg.senderId === localParticipant?.id
                  ? "You"
                  : getDisplayName(msg.senderId)}
              </p>
            </>
          ))}
          <div ref={messagesBottomRef} />
        </div>
        {localParticipant?.stream && isCameraActive ? (
          <div className="self-view-wrapper">
            <VideoView muted stream={localParticipant.stream} />
            <p className="self-name">You</p>
          </div>
        ) : null}
        <ChatInput sendChatMessage={sendChatMessage} />
      </div>
      <div className="video-stage">
        {remoteParticipants[0]?.stream ? (
          <div
            className={
              !screenshares.length ? "remote-view-wrapper" : "remote-view-small"
            }
          >
            <VideoView stream={remoteParticipants[0].stream} />
            <p
              className={
                !screenshares.length ? "remote-name" : "screenshare-remote-name"
              }
            >
              {getDisplayName(remoteParticipants[0].id)}
            </p>
          </div>
        ) : null}
        {screenshares[0]?.stream ? (
          <>
            <div className="screenshare-view-wrapper">
              <VideoView stream={screenshares[0].stream} />
            </div>
            <p>
              {screenshares[0].isLocal
                ? "Screenshare (You)"
                : `Screenshare (${getDisplayName(
                    screenshares[0].participantId
                  )})`}
            </p>
          </>
        ) : null}
      </div>
      <div className="control-wrapper">
        <div className="buttons">
          <IconButton
            variant="camera"
            isActive={isCameraActive}
            onClick={() => {
              setIsCameraActive((prev) => !prev);
              toggleCamera();
            }}
          >
            Cam
          </IconButton>
          <IconButton
            variant="microphone"
            isActive={isMicrophoneActive}
            onClick={() => {
              setIsMicrophoneActive((prev) => !prev);
              toggleMicrophone();
            }}
          >
            Mic
          </IconButton>
          <IconButton
            variant="share"
            isActive={isLocalScreenshareActive}
            onClick={() => {
              if (isLocalScreenshareActive) {
                stopScreenshare();
              } else {
                startScreenshare();
              }
              setIsLocalScreenshareActive((prev) => !prev);
            }}
          >
            {isLocalScreenshareActive ? "Stop" : "Share"}
          </IconButton>
        </div>
      </div>
    </div>
  );
}
