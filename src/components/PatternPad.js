import React, { useContext, useEffect, useRef, useState, useCallback, useMemo } from 'react';
import { DrumMachineContext } from '../context';
import { AUDIO_CLIPS } from '../App';

export default function PatternPad({ highlighted }) {
  const [isAssigned, setIsAssigned] = useState(false);
  const [state] = useContext(DrumMachineContext);
  const patternPadRef = useRef();

  // assign a sound clip to a pad that was last clicked (seen on display)
  const handleClick = useCallback(() => {
    // if the pad was already assigned to the same sample
    if (isAssigned && state.currentName === patternPadRef.current.dataset.name) {
      // unassign the pad
      setIsAssigned(false);
      patternPadRef.current.src = '';
      patternPadRef.current.dataset.name = '';
    } else {
      // if currentName is not a bank name
      if (!AUDIO_CLIPS.find(bank => bank.bank === state.currentName)) {
        setIsAssigned(true);
        patternPadRef.current.src = AUDIO_CLIPS[state.bankIndex].clips.find(clip => clip.name === state.currentName).src;
        patternPadRef.current.dataset.name = state.currentName;
      }
    }
  }, [isAssigned, state.currentName, patternPadRef]);
  // optimize handleClick to decrease render duration
  const memoizedHandleClick = useMemo(() => handleClick, [handleClick]);

  useEffect(() => {
    console.log('useEffect')
    if (!patternPadRef.current.src) {
      setIsAssigned(false);
    }
  }, [patternPadRef.current?.src]);

  return (
    <button className={`pattern-pad ${highlighted ? 'playing-pad' : '' } ${patternPadRef.current?.src ? 'assigned-pad' : ''}`} onClick={memoizedHandleClick}>
      <audio ref={patternPadRef}></audio>
    </button>
  )
}