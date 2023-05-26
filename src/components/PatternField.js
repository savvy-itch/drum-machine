import React, { useContext, useEffect, useState } from 'react'
import PatternPad from './PatternPad';
import { ACTIONS, DrumMachineContext } from '../context';

// play all assigned samples in the loop
// clear samples on the second clicks 
// on second play button click stop the loop
// on play button click toggle play/stop icon

const padsAmount = 8;

export default function PatternField() {
  const [isLoopPlaying, setIsLoopPlaying] = useState(false);
  const [highlightedPadIndex, setHighlightedPadIndex] = useState(-1);
  const [state, dispatch, audioElements] = useContext(DrumMachineContext);
  let padsArr = [];

  for (let i = 0; i < padsAmount; i++) {
    padsArr.push(<PatternPad key={i} highlighted={i === highlightedPadIndex} isLoopPlaying={isLoopPlaying} />);
    console.log(<PatternPad />)
  }

  useEffect(() => {
    let intervalId = null;

    if (isLoopPlaying) {
      let index = 0;
      intervalId = setInterval(() => {
        dispatch({ type: ACTIONS.UPDATE_PLAYING_PAD, payload: { playingPadIndex: index }});
        setHighlightedPadIndex(index);
        audioElements[index].play();
        index++;
        if (index >= padsArr.length) {
          // Restart the loop from 0
          index = 0;
        }
      }, 500);
    } else {
      // When the loop is not playing, don't highlight any pads
      setHighlightedPadIndex(-1);
    }
    // Clear the interval when the loop isn't playing
    return () => {
      clearInterval(intervalId);
      dispatch({ type: ACTIONS.UPDATE_PLAYING_PAD, payload: { playingPadIndex: -1 }});
    };
  }, [isLoopPlaying]);

  return (
    <div className="pattern-field">
      <div className="pattern-row">
        <button className="pattern-play-btn" onClick={() => setIsLoopPlaying(!isLoopPlaying)}>Play</button>
        {padsArr}
      </div>
    </div>
  )
}