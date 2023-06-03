import React, { useRef, useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { AUDIO_CLIPS } from '../App';
import { displayName } from '../features/display/displaySlice';

export default function DrumPad({ drumpad, keyboardKey }) {
  const [pressedPad, setPressedPad] = useState(false);
  const audioRef = useRef();
  const dispatch = useDispatch();
  const switches = useSelector(state => state.switches);

  const style = {boxShadow: `0px 0px 4px 2px ${AUDIO_CLIPS[switches.bankIndex].clips.find(pad => pad.id === drumpad.id).color}`}

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.type === 'click' || event.key.toUpperCase() === keyboardKey) {
        // if drum machine is on
        if (!switches.powerOff) {
          dispatch(displayName({ currentName: AUDIO_CLIPS[switches.bankIndex].clips.find(clip => clip.id === drumpad.id).name}));
          setPressedPad(true)
          if (audioRef.current) {
            audioRef.current.currentTime = 0;
            audioRef.current.play().catch(error => {
              console.error('Error playing audio:', error);
            });
          }
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
  }, [keyboardKey, switches.powerOff]);

  function handleClick() {
    if (!switches.powerOff && audioRef.current) {
      dispatch(displayName({ currentName: AUDIO_CLIPS[switches.bankIndex].clips.find(clip => clip.id === drumpad.id).name}));
      audioRef.current.currentTime = 0;
      audioRef.current.play().catch(error => {
        console.error('Error playing audio:', error);
      });
    }
  }

  return (
    <div className={`drum-pad ${pressedPad && 'active'}`} 
      style={style}
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
        muted={ switches.powerOff ? true : false}
        preload="auto"
      ></audio>
    </div>
  )
}