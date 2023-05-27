import React, { useContext, useEffect, useRef, useState } from 'react';
import { DrumMachineContext } from '../context';
import { AUDIO_CLIPS } from '../App';

export default function PatternPad({ highlighted, isPatternCleared }) {
  const [isAssigned, setIsAssigned] = useState(false);
  const [state] = useContext(DrumMachineContext);
  const patternPadRef = useRef();

  // assign a sound clip to a pad that was last clicked (seen on display)
  function handleClick() {
    // if the pad was already assigned to the same sample
    if (isAssigned && state.currentName === patternPadRef.current.dataset.name) {
      // unassign the pad
      setIsAssigned(false);
      patternPadRef.current.src = '';
      patternPadRef.current.dataset.name = '';
    } else {
      // check if currentName is not a bank name
      if (!AUDIO_CLIPS.find(bank => bank.bank === state.currentName)) {
        setIsAssigned(patternPadRef);
        patternPadRef.current.src = AUDIO_CLIPS[state.bankIndex].clips.find(clip => clip.name === state.currentName).src;
        patternPadRef.current.dataset.name = state.currentName;
      }
    }
  }

  useEffect(() => {
    if (!patternPadRef.current.src) {
      setIsAssigned(false);
    }
  }, [patternPadRef.current?.src]);

  return (
    <button className={`pattern-pad ${highlighted ? 'playing-pad' : '' } ${isAssigned ? 'assigned-pad' : ''}`} onClick={handleClick}>
      <audio ref={patternPadRef}></audio>
    </button>
  )
}