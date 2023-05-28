import React, { useContext, useEffect, useState } from 'react'
import PatternPad from './PatternPad';
import { ACTIONS, DrumMachineContext } from '../context';
import { BsFillPlayFill, BsFillStopFill } from "react-icons/bs";

// add second row

const padsAmount = 8;

export default function PatternField() {
  const [isLoopPlaying, setIsLoopPlaying] = useState(false);
  const [highlightedPadIndex, setHighlightedPadIndex] = useState(-1);

  // removing state from context
  const [playingPadIndex, setPlayingPadIndex] = useState(-1);

  const [state, dispatch] = useContext(DrumMachineContext);

  const [audioElementsRow1, setAudioElementsRow1] = useState([]);
  const [audioElementsRow2, setAudioElementsRow2] = useState([]);
  useEffect(() => {
    const elementsRow1 = Array.from(document.getElementById('row-1').querySelectorAll('audio'));
    const elementsRow2 = Array.from(document.getElementById('row-2').querySelectorAll('audio'));
    setAudioElementsRow1(elementsRow1);
    setAudioElementsRow2(elementsRow2);
  }, [setAudioElementsRow1, setAudioElementsRow2]);
  useEffect(() => {
    // Create a MutationObserver to listen for changes in the audio elements
    const observerRow1 = new MutationObserver(() => {
      const updatedElements = Array.from(document.getElementById('row-1').querySelectorAll('audio'));
      setAudioElementsRow1(updatedElements);
    });
    const observerRow2 = new MutationObserver(() => {
      const updatedElements = Array.from(document.getElementById('row-2').querySelectorAll('audio'));
      setAudioElementsRow2(updatedElements);
    });
    // Observe the container that holds the audio elements
    const container1 = document.getElementById('row-1');
    const container2 = document.getElementById('row-2');

    observerRow1.observe(container1, { childList: true, subtree: true });
    observerRow1.observe(container2, { childList: true, subtree: true });
    // Clean up the observer when component unmounts
    return () => {
      observerRow1.disconnect();
      observerRow2.disconnect();
    };
  }, [setAudioElementsRow1, setAudioElementsRow2]);

  const audioElements = [audioElementsRow1, audioElementsRow2];


  let padsArr = [];
  let padsArr2 = [];

  for (let i = 0; i < padsAmount; i++) {
    padsArr.push(<PatternPad key={i} highlighted={i === highlightedPadIndex} />);
    padsArr2.push(<PatternPad key={i} highlighted={i === highlightedPadIndex} />);
  }

  useEffect(() => {
    let intervalId = null;

    if (isLoopPlaying) {
      let index = 0;
      intervalId = setInterval(() => {
        // dispatch({ type: ACTIONS.UPDATE_PLAYING_PAD, payload: { playingPadIndex: index }});
        // setPlayingPadIndex(index)
        setHighlightedPadIndex(index);

        const row1 = audioElements[0];
        const row2 = audioElements[1];

        if (row1.length > 0 && row1[index] && row1[index].src !== '') {
          row1[index].play().catch(error => { console.log(error) });
        }

        if (row2.length > 0 && row2[index] && row2[index].src !== '') {
          row2[index].play().catch(error => { console.log(error) });
        }
        index = (index + 1) % padsAmount;
      }, 300);
    } else {
      // When the loop is not playing, don't highlight any pads
      setHighlightedPadIndex(-1);
    }
    // Clear the interval when the loop isn't playing
    return () => {
      clearInterval(intervalId);
      // dispatch({ type: ACTIONS.UPDATE_PLAYING_PAD, payload: { playingPadIndex: -1 }});
      // setPlayingPadIndex(-1)
    };
  }, [isLoopPlaying]);

  function clearPattern() {
    // stop playing loop
    setIsLoopPlaying(false);
    // dispatch({ type: ACTIONS.UPDATE_PLAYING_PAD, payload: { playingPadIndex: -1 }});
    // setPlayingPadIndex(-1);

    const row1 = audioElements[0];
    const row2 = audioElements[1];
    row1.forEach(audio => {
      audio.removeAttribute("src");
      audio.removeAttribute("data-name");
    });
    row2.forEach(audio => {
      audio.removeAttribute("src");
      audio.removeAttribute("data-name");
    });
  }

  return (
    <div className="pattern-field">
      <div id="row-1" className="pattern-row">
        <button className="pattern-play-btn pattern-btn" onClick={() => setIsLoopPlaying(!isLoopPlaying)}>
          {isLoopPlaying ? <BsFillStopFill/> : <BsFillPlayFill />}
        </button>
        {padsArr}
      </div>
      <div id="row-2" className="pattern-row">
        <button className="clear-pattern-btn pattern-btn" onClick={clearPattern}>
          Clear
        </button>
        {padsArr2}
      </div>
    </div>
  )
}