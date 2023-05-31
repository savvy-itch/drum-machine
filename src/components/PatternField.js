import React, { useContext, useEffect, useState } from 'react'
import PatternPad from './PatternPad';
import { BsFillPlayFill, BsFillStopFill } from "react-icons/bs";
import * as Tone from 'tone';
import { DrumMachineContext } from '../context';

const padsAmount = 8;

export default function PatternField() {
  const [isLoopPlaying, setIsLoopPlaying] = useState(false);
  const [isPatternCleared, setIsPatternCleared] = useState(false);
  const [highlightedPadIndex, setHighlightedPadIndex] = useState(-1);
  const [audioElementsRow1, setAudioElementsRow1] = useState([]);
  const [audioElementsRow2, setAudioElementsRow2] = useState([]);
  const [loop, setLoop] = useState(null);
  const [state] = useContext(DrumMachineContext);

  useEffect(() => {
    const elementsRow1 = Array.from(document.getElementById('row-1').querySelectorAll('audio'));
    const elementsRow2 = Array.from(document.getElementById('row-2').querySelectorAll('audio'));
    setAudioElementsRow1(elementsRow1);
    setAudioElementsRow2(elementsRow2);
  }, [setAudioElementsRow1, setAudioElementsRow2]);

  useEffect(() => {
    // Listen for changes in the audio elements
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
    padsArr.push(<PatternPad key={i} highlighted={i === highlightedPadIndex} isPatternCleared={isPatternCleared} setIsPatternCleared={setIsPatternCleared} />);
    padsArr2.push(<PatternPad key={i} highlighted={i === highlightedPadIndex} isPatternCleared={isPatternCleared} setIsPatternCleared={setIsPatternCleared} />);
  }

  useEffect(() => {
    let index = 0;
    const row1 = audioElements[0];
    const row2 = audioElements[1];

    if (isLoopPlaying) {
      // if drum machine is off
      if (state.powerOff) {
        // stop the loop and clear the pattern
        clearPattern();
      } else {
        const playStep = () => {
          setHighlightedPadIndex(index);
          if (row1.length > 0 && row1[index] && row1[index].src !== '') {
            const sample1 = new Tone.Player(row1[index].src).toDestination();
            sample1.volume.value = state.volume * 10;
            Tone.loaded().then(() => sample1.start());
          }
          if (row2.length > 0 && row2[index] && row2[index].src !== '') {
            const sample2 = new Tone.Player(row2[index].src).toDestination();
            sample2.volume.value = state.volume * 10;
            Tone.loaded().then(() => sample2.start());
          }
          // set index to 0 when it reaches the end of the array
          index = (index + 1) % padsAmount;
        }
        const loop = new Tone.Loop(playStep, '6n');
        Tone.Transport.start();
        loop.start(0);
        Tone.start()
        setLoop(loop);
      }
    } else {
      if (loop) {
        // Stop the loop and don't highlight any pads
        Tone.Transport.stop();
        loop.stop(0);
        setLoop(null);
        setHighlightedPadIndex(-1);
      }
    }
  }, [isLoopPlaying, state.powerOff, state.volume]);

  function clearPattern() {
    // stop playing loop
    setIsLoopPlaying(false);
    // clear pattern
    setIsPatternCleared(true)
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