import { createContext, useReducer } from "react";

const DrumMachineContext = createContext();

const initialState = {
  powerOff: false,
  bankIndex: 0,
  // volume: 0.5,
  currentName: 'Heater Kit',
  playingPadIndex: -1,
  patternPadsAudio: [], 
}

const ACTIONS = {
  SWITCH_POWER: 'switch-power',
  CHANGE_BANK: 'change-bank',
  // CHANGE_VOLUME: 'change-volume',
  DISPLAY_NAME: 'display-name',
  UPDATE_AUDIO_ELEMENT: 'update-audio-element'
}

function reducer(state, action) {
  switch(action.type) {
    case ACTIONS.SWITCH_POWER:
      return {...state, powerOff: !action.payload.powerOff}
    case ACTIONS.CHANGE_BANK:
      return (action.payload.bankIndex === 0) ? {...state, bankIndex: 1} : {...state, bankIndex: 0}
    // case ACTIONS.CHANGE_VOLUME:
    //   return {...state, volume: action.payload.volume / 10}
    case ACTIONS.DISPLAY_NAME:
      return {...state, currentName: action.payload.currentName}
    case ACTIONS.UPDATE_AUDIO_ELEMENT:
      return {...state, patternPadsAudio: [...state.patternPadsAudio, action.payload.audioElement]};
    default:
      return state;
  }
}

const DrumMachineProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  
  return (
    <DrumMachineContext.Provider value={[ state, dispatch ]}>
      {children}
    </DrumMachineContext.Provider>
  )
}

export { DrumMachineContext, ACTIONS };
export default DrumMachineProvider;