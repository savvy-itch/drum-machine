import React, { useRef, useEffect, useState, useContext } from 'react';
import { ACTIONS, DrumMachineContext } from '../context';
import { AUDIO_CLIPS } from '../App';

export default function DrumPad({ drumpad, keyboardKey }) {
  const [pressedPad, setPressedPad] = useState(false);
  const audioRef = useRef();

  const [state, dispatch] = useContext(DrumMachineContext);
  const {mute, bankIndex, volume} = state;

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.type === 'click' || event.key.toUpperCase() === keyboardKey) {
        dispatch({ type: ACTIONS.DISPLAY_NAME, payload: {currentName: AUDIO_CLIPS[bankIndex].clips.find(clip => clip.id === drumpad.id).name} })
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
      dispatch({ type: ACTIONS.DISPLAY_NAME, payload: {currentName: AUDIO_CLIPS[bankIndex].clips.find(clip => clip.id === drumpad.id).name} })
      audioRef.current.volume = volume;
      audioRef.current.currentTime = 0;
      audioRef.current.play().catch(error => {
        console.error('Error playing audio:', error);
      });
    }
  }

  return (
    <div className={`drum-pad ${pressedPad ? 'active' : ''}`} 
      id={drumpad.id}
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