import React, { SetStateAction, useEffect, useRef } from 'react';

interface FirstTalkProps {
  setIsPlaying: React.Dispatch<SetStateAction<boolean>>
}

export const FirstTalk : React.FC<FirstTalkProps> = ({ setIsPlaying }) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    const handlePlay = () => {
      if (audioRef.current) {
        audioRef.current.play();
      }
    };

    // 初回マウント時に音声再生を試みる
    if (audioRef.current) {
      audioRef.current.play().catch(() => {
        // 自動再生がブロックされた場合のフォールバック
        document.addEventListener('click', handlePlay, { once: true });
      });
      setTimeout(() => {
        setIsPlaying(false);
      }, 3000)
    }

    // クリーンアップ関数
    return () => {
      document.removeEventListener('click', handlePlay);
    };
  }, [setIsPlaying]);

  return (
    <div>
      <audio ref={audioRef} src="firstvoice.wav" />
    </div>
  );
};
