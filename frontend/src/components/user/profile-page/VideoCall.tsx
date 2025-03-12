import { useEffect, useRef, useState } from "react";
import AgoraRTC, {
  IAgoraRTCClient,
  ICameraVideoTrack,
  IRemoteVideoTrack,
} from "agora-rtc-sdk-ng";

const APP_ID = import.meta.env.VITE_AGORA_APP_ID;

const client: IAgoraRTCClient = AgoraRTC.createClient({
  mode: "rtc",
  codec: "vp8",
});

const VideoCall: React.FC<{ channelName: string }> = ({ channelName }) => {
  const [isJoined, setIsJoined] = useState<boolean>(false);
  const localVideoRef = useRef<HTMLDivElement>(null);
  const remoteVideoRef = useRef<HTMLDivElement>(null);
  const localTrackRef = useRef<ICameraVideoTrack | null>(null);
  const remoteTrackRef = useRef<IRemoteVideoTrack | null>(null);

  useEffect(() => {
    const initCall = async () => {
      client.on(
        "user-published",
        async (user: any, mediaType: "video" | "audio") => {
          await client.subscribe(user, mediaType);
          if (mediaType === "video" && user.videoTrack) {
            remoteTrackRef.current = user.videoTrack;
            remoteTrackRef.current!.play(remoteVideoRef.current!);
          }
        }
      );

      client.on("user-unpublished", () => {
        if (remoteTrackRef.current) {
          remoteTrackRef.current.stop();
          remoteTrackRef.current = null;
        }
      });
    };

    initCall();
  }, []);

  const joinChannel = async () => {
    console.log(channelName, APP_ID, "fhsdlfjsldjlksdjfklsj")

    await client.join(APP_ID, channelName, null, null);
    const localTrack = await AgoraRTC.createCameraVideoTrack();
    console.log(localTrack, "this is the localTrack")
    localTrackRef.current = localTrack;
    if (localVideoRef.current) {
      localTrack.play(localVideoRef.current);
    }
    await client.publish(localTrack);
    setIsJoined(true);
  };

  const leaveChannel = async () => {
    if (localTrackRef.current) {
      localTrackRef.current.stop();
      localTrackRef.current.close();
      localTrackRef.current = null;
    }
    await client.leave();
    setIsJoined(false);
  };

  return (
    <div>
      <div className="flex gap-10 justify-center">
        <div
          ref={localVideoRef}
          style={{ width: "300px", height: "200px", background: "#000",marginTop: "10px", }}
        />
        <div
          ref={remoteVideoRef}
          style={{
            width: "300px",
            height: "200px",
            background: "#000",
            marginTop: "10px",
          }}
        />
      </div>
      <div className="flex justify-center">
        {!isJoined ? (
          <button className="mt-5 px-3 py-2 bg-green-400 rounded-lg" onClick={joinChannel}>Join Call</button>
        ) : (
          <button onClick={leaveChannel}>Leave Call</button>
        )}
      </div>
    </div>
  );
};

export default VideoCall;
