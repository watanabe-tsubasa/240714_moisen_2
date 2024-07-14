import { useEffect, useState } from 'react';
import { Avator } from './components/Avator';
import { Calling } from './components/Calling';
import liff from '@line/liff'

function App() {
  const [showAvator, setShowAvator] = useState(false);

  const handleCallingUnmount = () => {
    setShowAvator(true);
  };
  useEffect(() => {
    liff.init({
      liffId: '2000869865-q8dvQa3v'
    })
  })

  return (
    <div className='h-screen bg-slate-200'>
      {showAvator ? <Avator /> : <Calling onUnmount={handleCallingUnmount} />}
    </div>
  );
}

export default App;
