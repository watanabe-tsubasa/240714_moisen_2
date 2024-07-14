import 'regenerator-runtime';
import React from "react";
import SpeechRecognition, {
 useSpeechRecognition,
} from "react-speech-recognition";

export const Dictaphone: React.FC = () => {
 const {
   transcript,
   listening,
   resetTranscript,
   browserSupportsSpeechRecognition,
 } = useSpeechRecognition();

 if (!browserSupportsSpeechRecognition) {
   return <span>ブラウザが音声認識未対応です</span>;
 }

 return (
   <div id="react-speech-recognition">
     <p>入力: {listening ? "on" : "off"}</p>
     <button type="button" onClick={() => SpeechRecognition.startListening()}>
       入力開始
     </button>
     <button type="button" onClick={() => SpeechRecognition.stopListening()}>
       Stop
     </button>
     <button type="button" onClick={() => resetTranscript()}>
       リセット
     </button>
     <p>{transcript}</p>
   </div>
 );
};
