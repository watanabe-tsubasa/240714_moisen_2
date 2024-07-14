import React, { useState, useRef } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

export const Voice: React.FC = () => {
  const [text, setText] = useState<string>('');
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setText(event.target.value);
  };

  const handleButtonClick = async () => {
    try {
      const response = await fetch(`https://deprecatedapis.tts.quest/v2/voicevox/audio/?text=${text}&key=F9L529z2B342B-D&speaker=47`, {
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
    <div className='flex flex-col items-center justify-center w-full h-full p-4'>
      <div className='flex justify-center w-full'>
        <Input type="text" value={text} onChange={handleInputChange} className="flex-grow" />
        <Button onClick={handleButtonClick} disabled={isPlaying} className="ml-2">
          話す
        </Button>
      </div>
      <audio ref={audioRef} onEnded={handleAudioEnded} />
    </div>
  );
};
