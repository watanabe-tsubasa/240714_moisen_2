import { useEffect, useState, useCallback } from 'react';
import { X, PhoneCall } from 'lucide-react';

export const Calling = () => {
  const [dots, setDots] = useState([0, 1, 2]);
  const [isAnswering, setIsAnswering] = useState(false);
  const [isUnmounting, setIsUnmounting] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setDots(prevDots => [...prevDots.slice(1), prevDots[0]]);
    }, 500);

    return () => clearInterval(interval);
  }, []);

  const handleAnswer = useCallback(() => {
    setIsAnswering(true);
    setTimeout(() => {
      setIsUnmounting(true);
    }, 500); // アニメーションが500msで終了するのを待つ
  }, []);

  if (isUnmounting) {
    return null; // コンポーネントをアンマウント
  }

  return (
    <div className={`flex flex-col items-center justify-center h-screen w-screen bg-gray-800 text-white transition-all duration-500 ease-in-out ${isAnswering ? '-translate-y-full' : ''}`}>
      <div className="w-32 h-32 mb-4 overflow-hidden border-gray-100 border-solid rounded-full">
        <img src="AIhayashFace.png" alt="Profile" className="object-cover w-full h-full" />
      </div>
      <h2 className="mb-4 text-2xl">AI林さん</h2>
      <div className="flex mb-8 space-x-2">
        {dots.map((dot, index) => (
          <div
            key={index}
            className={`w-2 h-2 rounded-full bg-green-500 transition-all duration-300 ease-in-out ${
              dot === 0 ? 'scale-100' : dot === 1 ? 'scale-75' : 'scale-50'
            }`}
          ></div>
        ))}
      </div>
      <div className="absolute flex justify-center w-full space-x-8 bottom-8">
        <button className="p-4 bg-red-500 rounded-full">
          <X size={32} />
        </button>
        <button className="p-4 bg-green-500 rounded-full" onClick={handleAnswer}>
          <PhoneCall size={32} />
        </button>
      </div>
    </div>
  );
};