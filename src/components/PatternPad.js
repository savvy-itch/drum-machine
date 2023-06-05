import React, { useEffect, useRef, useState, useCallback } from 'react';
import { useSelector } from 'react-redux';
import { AUDIO_CLIPS } from '../App';

export default function PatternPad({ highlighted, isPatternCleared, setIsPatternCleared }) {
  const [isAssigned, setIsAssigned] = useState(false);
  const [padColor, setPadColor] = useState('');
  const switches = useSelector(state => state.switches);
  const display = useSelector(state => state.display);
  const patternPadRef = useRef();

  // assign a sound clip to a pad that was last clicked (seen on display)
  const handleClick = useCallback(() => {
    // if the pad was already assigned to the same sample
    if (isAssigned && display.currentName === patternPadRef.current.dataset.name) {
      // unassign the sound from the pad
      setIsAssigned(false);
      patternPadRef.current.src = '/audio/silence.mp3';
      patternPadRef.current.dataset.name = '';
    } else {
      // if currentName is not a bank name
      if (!AUDIO_CLIPS.find(bank => bank.bank === display.currentName)) {
        // assign corresponding sound to pad
        setIsAssigned(true);
        setPadColor(AUDIO_CLIPS[switches.bankIndex].clips.find(clip => clip.name === display.currentName).color);
        patternPadRef.current.src = AUDIO_CLIPS[switches.bankIndex].clips.find(clip => clip.name === display.currentName).src;
        patternPadRef.current.dataset.name = display.currentName;
      }
    }
  }, [isAssigned, display.currentName, patternPadRef]);

  useEffect(() => {
    // if 'clear' button was clicked
    if (isPatternCleared) {
      // remove assigned pad highlight
      setIsAssigned(false);
      setIsPatternCleared(false);
    }
  }, [isPatternCleared]);

  return (
    <button className={`pattern-pad ${highlighted && 'playing-pad'}`} 
      style={{backgroundColor: `${isAssigned && !switches.powerOff ? padColor : '' }`}}
      onClick={handleClick}>
      <audio ref={patternPadRef}></audio>
    </button>
  )
}