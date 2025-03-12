import { ZegoUIKitPrebuilt } from "@zegocloud/zego-uikit-prebuilt";
import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";

const VideoCall = () => {
  const [searchParams] = useSearchParams();
  const roomID = searchParams.get("id") || "defaultRoom";
  const callContainer = useRef(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    if (!roomID || !callContainer.current) return;

    const appID = Number(import.meta.env.VITE_ZEGO_APP_ID);
    const serverSecret = import.meta.env.VITE_ZEGO_SERVER_SECRET;

    const kitToken = ZegoUIKitPrebuilt.generateKitTokenForTest(
      appID,
      serverSecret,
      roomID,
      "UserID_" + Date.now(),
      "Guest"
    );

    const zp = ZegoUIKitPrebuilt.create(kitToken);
    zp.joinRoom({
      container: callContainer.current,
      scenario: {
        mode: ZegoUIKitPrebuilt.GroupCall,
      },
    });

    setIsReady(true);
  }, [roomID]);

  return (
    <div style={{ width: "100vw", height: "100vh" }}>
      {!isReady && <p>Loading video call...</p>}
      <div ref={callContainer} style={{ width: "100%", height: "100%" }} />
    </div>
  );
};

export default VideoCall;
