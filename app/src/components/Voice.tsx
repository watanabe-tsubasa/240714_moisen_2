import 'regenerator-runtime';
import { useState, useRef, useEffect } from 'react';
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { FirstTalk } from './FirstTalk';
import { DifyMessageEventType, speechLogType } from '../types'

export const Voice: React.FC = () => {
  const [text, setText] = useState<string>('');
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [isFetching, setIsFetching] = useState<boolean>(false);
  const [speechLog, setSpeechLog] = useState<speechLogType[]>([]);
  const [conversationId, setConversationId] = useState('');
  const [userId, setUserId] = useState('');

  const audioRef = useRef<HTMLAudioElement>(null);
  const {
    transcript,
    listening,
    browserSupportsSpeechRecognition,
  } = useSpeechRecognition();

  useEffect(() => {
    // Generate and set the user ID when the component mounts
    const generateUserId = () => {
      const id = Math.floor(10000000 + Math.random() * 90000000).toString();
      setUserId(id);
    };
    generateUserId();
  }, []);

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
      setSpeechLog((prevLog) => [...prevLog, {'speaker': '患者', 'message': transcript}]);
      fetchAndTalk(transcript, userId, conversationId);
      // playAudioFromText(transcript);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [listening, transcript, conversationId]);

  const fetchAndTalk = async (text: string, userId: string, conversationId: string) => {
    setIsFetching(true);
    const res = await fetch('https://api.dify.ai/v1/chat-messages', {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer app-pzV66fOKYrXEBZUTcL14Nd1F',
        'Content-Type': 'application/json' 
      },
      body: JSON.stringify({
        "inputs" :{},
        "query": text,
        "user": userId,
        "response_mode": "blocking",
        "conversation_id": conversationId
      })
    });
    const json = await res.json() as DifyMessageEventType;
    setConversationId(json.conversation_id);
    setSpeechLog(prev => [...prev, {'speaker': '看護師', 'message': json.answer}]);
    console.log(json);
    playAudioFromText(json.answer);
  }

  const playAudioFromText = async (text: string) => {
    setIsFetching(true);
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
    } finally {
      setIsFetching(false);
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

  const handleEndConversation = async () => {
    const res = await fetch('https://elysia-trial.onrender.com', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        "userId": userId,
        "talkLog": speechLog
      })
    });
    const json = await res.json();
    console.log(json)
    setSpeechLog([]);
    setConversationId('');
  };

  const messageClass = "fixed left-0 w-full p-4 text-center text-white transform -translate-y-1/2 bg-gray-700 bg-opacity-50 top-1/2";

  return (
    <div className='relative flex flex-col items-center justify-center w-full h-full p-4'>
      {speechLog.length > 10 && (
        <div className="fixed top-0 mt-4 transform -translate-x-1/2 left-1/2">
          <Button onClick={handleEndConversation}>会話を終了する</Button>
        </div>
      )}
      <div className='flex justify-center w-full'>
        <Input type="text" value={text} onChange={handleInputChange} className="flex-grow" />
        <Button onClick={handleButtonClick} disabled={isPlaying} className="ml-2">
          話す
        </Button>
      </div>
      {/* {transcript}<br />
      <ul>
        {speechLog.map((speech, index) => (<li key={index}>{speech.message}</li>))}
      </ul> */}
      <audio ref={audioRef} onEnded={handleAudioEnded} />
      <FirstTalk setIsPlaying={setIsPlaying} />
      
      {isFetching ? (
        <div className={messageClass}>
          考え中・・・
        </div>
      ) : (
        listening && (
          <div className={messageClass}>
            話しかけてください
          </div>
        )
      )}
      {/* <Button onClick={() => {SpeechRecognition.startListening()}}>再開</Button> */}
    </div>
  );
};
