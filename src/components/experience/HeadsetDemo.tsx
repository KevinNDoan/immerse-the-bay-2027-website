"use client";

import { useEffect, useRef, useState } from "react";

/** Presenter-controlled playback, kept outside the sequence of slides. */
export function HeadsetDemo() {
  const video = useRef<HTMLVideoElement>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    const element = video.current;
    const onHidden = () => { if (document.hidden) element?.pause(); };
    document.addEventListener("visibilitychange", onHidden);
    return () => {
      element?.pause();
      document.removeEventListener("visibilitychange", onHidden);
    };
  }, []);

  return <div className="zap-demo-player">
    <video ref={video} width={720} height={756} controls playsInline muted autoPlay preload="metadata" poster="/media/zap/headset-tour-poster.jpg" aria-label="ZAP! running on Meta Quest: spatial ideas, immersive worlds and voice-controlled learning objects" onError={() => setFailed(true)}>
      <source src="/media/zap/headset-tour.mp4" type="video/mp4" onError={() => setFailed(true)} />
      <track kind="captions" src="/media/zap/headset-tour.vtt" srcLang="en" label="Visual descriptions" />
      <a href="/media/zap/headset-tour.mp4">Open the headset demo.</a>
    </video>
    {failed && <p role="alert">The demo could not load. <a href="/media/zap/headset-tour.mp4">Open the video directly.</a></p>}
  </div>;
}
