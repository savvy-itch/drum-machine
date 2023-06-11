/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState, useRef } from 'react';
import PatternPad from './PatternPad';
import { BsFillPlayFill, BsFillStopFill } from 'react-icons/bs';
import { useSelector } from 'react-redux';

const padsAmount = 8;
const loopSpeed = 300;

export default function PatternField() {
  const [isLoopPlaying, setIsLoopPlaying] = useState(false);
  const [isPatternCleared, setIsPatternCleared] = useState(false);
  const [highlightedPadIndex, setHighlightedPadIndex] = useState(-1);
  const [audioElementsRow1, setAudioElementsRow1] = useState([]);
  const [audioElementsRow2, setAudioElementsRow2] = useState([]);
  const audioRefs = useRef([]);
  const switches = useSelector((state) => state.switches);
  const volume = useSelector(state => state.volume.volume);

  useEffect(() => {
    const elementsRow1 = Array.from(document.getElementById('row-1').querySelectorAll('audio'));
    const elementsRow2 = Array.from(document.getElementById('row-2').querySelectorAll('audio'));
    setAudioElementsRow1(elementsRow1);
    setAudioElementsRow2(elementsRow2);
  }, []);

  useEffect(() => {
    const observerRow1 = new MutationObserver(() => {
      const updatedElements = Array.from(document.getElementById('row-1').querySelectorAll('audio'));
      setAudioElementsRow1(updatedElements);
    });
    const observerRow2 = new MutationObserver(() => {
      const updatedElements = Array.from(document.getElementById('row-2').querySelectorAll('audio'));
      setAudioElementsRow2(updatedElements);
    });

    const container1 = document.getElementById('row-1');
    const container2 = document.getElementById('row-2');

    observerRow1.observe(container1, { childList: true, subtree: true });
    observerRow2.observe(container2, { childList: true, subtree: true });

    return () => {
      observerRow1.disconnect();
      observerRow2.disconnect();
    };
  }, []);

  useEffect(() => {
    const row1 = audioElementsRow1;
    const row2 = audioElementsRow2;

    if (isLoopPlaying) {
      if (switches.powerOff) {
        clearPattern();
      } else {
        const playStep = () => {
          setHighlightedPadIndex((prevIndex) => (prevIndex + 1) % padsAmount);
          if (row1.length > 0 && row1[index] && row1[index].src !== '') {
            const audioElement = audioRefs.current[row1[index].dataset.name];
            if (audioElement) {
              audioElement.currentTime = 0;
              audioElement.volume = volume;
              audioElement.play();
            }
          }
          if (row2.length > 0 && row2[index] && row2[index].src !== '') {
            const audioElement = audioRefs.current[row2[index].dataset.name];
            if (audioElement) {
              audioElement.currentTime = 0;
              audioElement.volume = volume;
              audioElement.play();
            }
          }
          index = (index + 1) % padsAmount;
        };

        let index = 0;
        const interval = setInterval(playStep, loopSpeed);

        return () => {
          clearInterval(interval);
        };
      }
    } else {
      setHighlightedPadIndex(-1);
      audioElementsRow1.forEach((audio) => {
        const audioElement = audioRefs.current[audio.dataset.name];
        if (audioElement) {
          audioElement.pause();
          audioElement.currentTime = 0;
        }
      });
      audioElementsRow2.forEach((audio) => {
        const audioElement = audioRefs.current[audio.dataset.name];
        if (audioElement) {
          audioElement.pause();
          audioElement.currentTime = 0;
        }
      });
    }
  }, [isLoopPlaying, switches.powerOff, audioElementsRow1, audioElementsRow2, volume]);

  const audioElements = [audioElementsRow1, audioElementsRow2];
  const padsArrRow1 = [];
  const padsArrRow2 = [];
  for (let i = 0; i < padsAmount; i++) {
    padsArrRow1.push(<PatternPad key={`row-1 ${i}`} highlighted={i === highlightedPadIndex} isPatternCleared={isPatternCleared} setIsPatternCleared={setIsPatternCleared} />);
    padsArrRow2.push(<PatternPad key={`row-2 ${i}`} highlighted={i === highlightedPadIndex} isPatternCleared={isPatternCleared} setIsPatternCleared={setIsPatternCleared} />);
  }

  function clearPattern() {
    setIsLoopPlaying(false);
    setIsPatternCleared(true);
    audioElementsRow1.forEach((audio) => {
      const audioElement = audioRefs.current[audio.dataset.name];
      if (audioElement) {
        audioElement.removeAttribute('src');
        audioElement.load();
      }
    });
    audioElementsRow2.forEach((audio) => {
      const audioElement = audioRefs.current[audio.dataset.name];
      if (audioElement) {
        audioElement.removeAttribute('src');
        audioElement.load();
      }
    });
  }

  function handlePlayButtonClick() {
    if (isLoopPlaying) {
      setIsLoopPlaying(false);
    } else {
      if (audioElementsRow1.find((pad) => pad.src && pad.src !== '/audio/silence.mp3')) {
        setIsLoopPlaying(true);
      } else {
        setIsLoopPlaying(false);
      }
    }
  }

  return (
    <div className="pattern-field">
      <div id="row-1" className="pattern-row">
        <button className="pattern-play-btn pattern-btn" onClick={handlePlayButtonClick}>
          {isLoopPlaying ? <BsFillStopFill /> : <BsFillPlayFill />}
        </button>
        {padsArrRow1}
      </div>
      <div id="row-2" className="pattern-row">
        <button className="clear-pattern-btn pattern-btn" onClick={clearPattern}>
          Clear
        </button>
        {padsArrRow2}
      </div>
      {audioElements.map((audioRow) =>
        audioRow.map((audio, index) => (
          <audio
            key={`${audio.dataset.name} ${index}`}
            ref={(ref) => {
              audioRefs.current[audio.dataset.name] = ref;
            }}
          >
            <source src={audio.src} type="audio/mpeg" />
          </audio>
        ))
      )}
    </div>
  );
}