import React, { useRef, useEffect, useState, useContext } from 'react';
import { DrumMachineContext } from '../context';

export default function DrumPad({ drumpad, keyboardKey }) {
  const [pressedPad, setPressedPad] = useState(false);
  const audioRef = useRef();

  const [state] = useContext(DrumMachineContext);
  const {mute, volume} = state;

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.type === 'click' || event.key.toUpperCase() === keyboardKey) {
        setPressedPad(true)
        if (audioRef.current) {
          audioRef.current.volume = volume;
          audioRef.current.currentTime = 0;
          audioRef.current.play().catch(error => {
            console.error('Error playing audio:', error);
          });
        }
      }
    };

    const handleKeyUp = (event) => {
      if (event.key.toUpperCase() === keyboardKey) {
        setPressedPad(false);
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('keyup', handleKeyUp);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('keyup', handleKeyUp);
    };
  }, [keyboardKey, volume]);

  function handleClick() {
    if (audioRef.current) {
      audioRef.current.volume = volume;
      audioRef.current.currentTime = 0;
      audioRef.current.play().catch(error => {
        console.error('Error playing audio:', error);
      });
    }
  }

  return (
    <div className={`drum-pad ${pressedPad ? 'active' : ''}`} 
      tabIndex={0}
      onClick={handleClick}
    >
      {keyboardKey}
      <audio 
        ref={audioRef} 
        id={keyboardKey} 
        className="clip" 
        src={drumpad.src}
        muted={ mute ? true : false}
        preload="auto"
      ></audio>
    </div>
  )
}