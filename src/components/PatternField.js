import React, { useContext, useEffect, useState } from 'react'
import PatternPad from './PatternPad';
import { ACTIONS, DrumMachineContext } from '../context';
import { BsFillPlayFill, BsFillStopFill } from "react-icons/bs";

// add second row

const padsAmount = 8;

export default function PatternField() {
  const [isLoopPlaying, setIsLoopPlaying] = useState(false);
  const [highlightedPadIndex, setHighlightedPadIndex] = useState(-1);
  const [isPatternCleared, setIsPatternCleared] = useState(false);
  const [state, dispatch, audioElements] = useContext(DrumMachineContext);
  let padsArr = [];

  for (let i = 0; i < padsAmount; i++) {
    padsArr.push(<PatternPad key={i} highlighted={i === highlightedPadIndex} isPatternCleared={isPatternCleared} />);
  }

  useEffect(() => {
    let intervalId = null;

    if (isLoopPlaying) {
      let index = 0;
      intervalId = setInterval(() => {
        dispatch({ type: ACTIONS.UPDATE_PLAYING_PAD, payload: { playingPadIndex: index }});
        setHighlightedPadIndex(index);
        if (audioElements[index].src !== '') {
          audioElements[index].play().catch(error => {console.log(error)});
          index++;
        } else {
          index++;
        }
        if (index >= padsArr.length) {
          // Restart the loop from 0
          index = 0;
        }
      }, 300);
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

  function clearPattern() {
    // stop playing loop
    setIsLoopPlaying(false);
    // setIsPatternCleared(true);
    dispatch({ type: ACTIONS.UPDATE_PLAYING_PAD, payload: { playingPadIndex: -1 }});
    // remove assigned attributes for all audio elements
    audioElements.forEach(audio => {
      audio.removeAttribute("src");
      audio.removeAttribute("data-name");
    });
  }

  return (
    <div className="pattern-field">
      <div className="pattern-row">
        <button className="pattern-play-btn pattern-btn" onClick={() => setIsLoopPlaying(!isLoopPlaying)}>
          {isLoopPlaying ? <BsFillStopFill/> : <BsFillPlayFill />}
        </button>
        <button className="clear-pattern-btn pattern-btn" onClick={clearPattern}>
          Clear
        </button>
        {padsArr}
      </div>
      {/* <div className="pattern-row">
        {padsArr}
      </div> */}
    </div>
  )
}