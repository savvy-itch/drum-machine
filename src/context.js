import { createContext, useReducer, useEffect, useState } from "react";

const DrumMachineContext = createContext();

const initialState = {
  mute: false,
  bankIndex: 0,
  volume: 0.5,
  currentName: 'Heater Kit',
  playingPadIndex: -1,
  patternPadsAudio: [], 
}

const ACTIONS = {
  SWITCH_POWER: 'switch-power',
  CHANGE_BANK: 'change-bank',
  CHANGE_VOLUME: 'change-volume',
  DISPLAY_NAME: 'display-name',
  UPDATE_PLAYING_PAD: 'update-playing-pad',
  UPDATE_AUDIO_ELEMENT: 'update-audio-element'
}

function reducer(state, action) {
  switch(action.type) {
    case ACTIONS.SWITCH_POWER:
      return {...state, mute: !action.payload.mute}
    case ACTIONS.CHANGE_BANK:
      return (action.payload.bankIndex === 0) ? {...state, bankIndex: 1} : {...state, bankIndex: 0}
    case ACTIONS.CHANGE_VOLUME:
      return {...state, volume: action.payload.volume / 10}
    case ACTIONS.DISPLAY_NAME:
      return {...state, currentName: action.payload.currentName}
    case ACTIONS.UPDATE_PLAYING_PAD:
      return {...state, playingPadIndex: action.payload.playingPadIndex}
    case ACTIONS.UPDATE_AUDIO_ELEMENT:
      return {...state, patternPadsAudio: [...state.patternPadsAudio, action.payload.audioElement]};
    default:
      return state;
  }
}

const DrumMachineProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const [audioElements, setAudioElements] = useState([]);

  useEffect(() => {
    const elements = Array.from(document.querySelector('.pattern-field').querySelectorAll('audio'));
    setAudioElements(elements);
    // Create a MutationObserver to listen for changes in the audio elements
    const observer = new MutationObserver(() => {
      const updatedElements = Array.from(document.querySelector('.pattern-field').querySelectorAll('audio'));
      setAudioElements(updatedElements);
    });
    // Observe the container that holds the audio elements
    const container = document.querySelector('.pattern-field');
    observer.observe(container, { childList: true, subtree: true });
    // Clean up the observer when component unmounts
    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <DrumMachineContext.Provider value={[ state, dispatch, audioElements ]}>
      {children}
    </DrumMachineContext.Provider>
  )
}

export { DrumMachineContext, ACTIONS };
export default DrumMachineProvider;