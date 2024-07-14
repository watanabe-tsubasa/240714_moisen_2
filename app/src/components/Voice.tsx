import 'regenerator-runtime';
import { useState, useRef, useEffect } from 'react';
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { FirstTalk } from './FirstTalk';

export const Voice: React.FC = () => {
  const [text, setText] = useState<string>('');
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [speechLog, setSpeechLog] = useState<string[]>([]);
  const audioRef = useRef<HTMLAudioElement>(null);
  const {
    transcript,
    listening,
    browserSupportsSpeechRecognition,
  } = useSpeechRecognition();

  useEffect(() => {
    if (!browserSupportsSpeechRecognition) {
      return;
    }
    if (!isPlaying) {
      SpeechRecognition.startListening();
    }
    return () => {
      SpeechRecognition.stopListening();
    };
  }, [isPlaying, browserSupportsSpeechRecognition]);

  useEffect(() => {
    if (!listening && transcript) {
      setSpeechLog((prevLog) => [...prevLog, transcript]);
      playAudioFromText(transcript);
    }
  }, [listening, transcript]);

  const playAudioFromText = async (text: string) => {
    try {
      const response = await fetch(`https://deprecatedapis.tts.quest/v2/voicevox/audio/?text=${text}&key=F9L529z2B342B-D&speaker=47`, {
        method: "GET",
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const audioBlob = await response.blob();
      const resUrl = URL.createObjectURL(audioBlob);

      if (audioRef.current) {
        audioRef.current.src = resUrl;
        audioRef.current.play();
        setIsPlaying(true);
      }
    } catch (error) {
      console.error('Error fetching the audio:', error);
    }
  };

  if (!browserSupportsSpeechRecognition) {
    return <span>ブラウザが音声認識未対応です</span>;
  }

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setText(event.target.value);
  };

  const handleButtonClick = () => {
    playAudioFromText(text);
  };

  const handleAudioEnded = () => {
    setIsPlaying(false);
  };

  return (
    <div className='relative flex flex-col items-center justify-center w-full h-full p-4'>
      <div className='flex justify-center w-full'>
        <Input type="text" value={text} onChange={handleInputChange} className="flex-grow" />
        <Button onClick={handleButtonClick} disabled={isPlaying} className="ml-2">
          話す
        </Button>
      </div>
      {transcript}<br />
      <ul>
        {speechLog.map((speech, index) => (<li key={index}>{speech}</li>))}
      </ul>
      <audio ref={audioRef} onEnded={handleAudioEnded} />
      <FirstTalk setIsPlaying={setIsPlaying} />
      
      {listening && (
        <div className="fixed left-0 w-full p-4 text-center text-white transform -translate-y-1/2 bg-gray-700 bg-opacity-50 top-1/2">
          話しかけてください
        </div>
      )}
    </div>
  );
};
