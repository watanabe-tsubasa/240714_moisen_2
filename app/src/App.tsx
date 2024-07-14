// import { useState } from 'react';
// import { Avator } from './components/Avator';
// import { Calling } from './components/Calling';
import { Dictaphone } from './components/Dictaphone';

function App() {
  // const [showAvator, setShowAvator] = useState(false);

  // const handleCallingUnmount = () => {
  //   setShowAvator(true);
  // };

  return (
    // <div className='h-screen bg-slate-200'>
    //   {showAvator ? <Avator /> : <Calling onUnmount={handleCallingUnmount} />}
    // </div>
    <Dictaphone />
  );
}

export default App;
