import React, { useState, useRef } from 'react';

export const Voice: React.FC = () => {
  const [text, setText] = useState<string>('');
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setText(event.target.value);
  };

  const handleButtonClick = async () => {
    try {
      const response = await fetch(`https://deprecatedapis.tts.quest/v2/voicevox/audio/?text=${text}&key=F9L529z2B342B-D`, {
        method: "GET",
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const audioBlob = await response.blob();
      const resUrl = URL.createObjectURL(audioBlob);
      
      // 音声の自動再生
      if (audioRef.current) {
        audioRef.current.src = resUrl;
        audioRef.current.play();
        setIsPlaying(true);
      }
    } catch (error) {
      console.error('Error fetching the audio:', error);
    }
  };

  const handleAudioEnded = () => {
    setIsPlaying(false);
  };

  return (
    <div>
      <input type="text" value={text} onChange={handleInputChange} />
      <button onClick={handleButtonClick} disabled={isPlaying}>
        Convert to Speech
      </button>
      <audio ref={audioRef} onEnded={handleAudioEnded} />
    </div>
  );
};
