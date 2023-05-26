import React, { useContext, useState } from 'react';
import './App.css';
import DrumPad from './components/DrumPad';
import Switch from './components/Switch';
import { DrumMachineContext, ACTIONS } from './context';
import PatternField from './components/PatternField';

// add ability to play with wrong language layout
// assign to each pad unique color

export const AUDIO_CLIPS = [
  {bank: 'Heater Kit', clips: [
    {id: "Heater-1", name: "Heater 1", src: "https://s3.amazonaws.com/freecodecamp/drums/Heater-1.mp3"},
    {id: "Heater-2", name: "Heater 2", src: "https://s3.amazonaws.com/freecodecamp/drums/Heater-2.mp3"},
    {id: "Heater-3", name: "Heater 3", src: "https://s3.amazonaws.com/freecodecamp/drums/Heater-3.mp3"},
    {id: "Heater-4", name: "Heater 4", src: "https://s3.amazonaws.com/freecodecamp/drums/Heater-4_1.mp3"},
    {id: "Clap", name: "Clap", src: "https://s3.amazonaws.com/freecodecamp/drums/Heater-6.mp3"},
    {id: "Heater-Open-HH", name: "Heater Open HH", src: "https://s3.amazonaws.com/freecodecamp/drums/Dsc_Oh.mp3"},
    {id: "Kick-n-Hat", name: "Kick n' Hat", src: "https://s3.amazonaws.com/freecodecamp/drums/Kick_n_Hat.mp3"},
    {id: "Kick", name: "Kick", src: "https://s3.amazonaws.com/freecodecamp/drums/RP4_KICK_1.mp3"},
    {id: "Heater-Closed-HH", name: "Heater Closed HH", src: "https://s3.amazonaws.com/freecodecamp/drums/Cev_H2.mp3"},
  ]},
  {bank: 'Smooth Piano Kit', clips: [
    {id: "Chord-1", name: "Chord 1", src: "https://s3.amazonaws.com/freecodecamp/drums/Chord_1.mp3"},
    {id: "Chord-2", name: "Chord 2", src: "https://s3.amazonaws.com/freecodecamp/drums/Chord_2.mp3"},
    {id: "Chord-3", name: "Chord 3", src: "https://s3.amazonaws.com/freecodecamp/drums/Chord_3.mp3"},
    {id: "Shaker", name: "Shaker", src: "https://s3.amazonaws.com/freecodecamp/drums/Give_us_a_light.mp3"},
    {id: "Smooth-Open-HH", name: "Smooth Open HH", src: "https://s3.amazonaws.com/freecodecamp/drums/Dry_Ohh.mp3"},
    {id: "Smooth-Closed-HH", name: "Smooth Closed HH", src: "https://s3.amazonaws.com/freecodecamp/drums/Bld_H1.mp3"},
    {id: "Punchy-Kick", name: "Punchy Kick", src: "https://s3.amazonaws.com/freecodecamp/drums/punchy_kick_1.mp3"},
    {id: "Side-Stick", name: "Side Stick", src: "https://s3.amazonaws.com/freecodecamp/drums/side_stick_1.mp3"},
    {id: "Snare", name: "Snare", src: "https://s3.amazonaws.com/freecodecamp/drums/Brk_Snr.mp3"},
  ]},
];
const KEYBOARD_KEYS = ['Q', 'W', 'E', 'A', 'S', 'D', 'Z', 'X', 'C'];
// const KEYBOARD_KEYSs = [['Q', 'Й'], ['W', 'Ц'], ['E', 'У'], ['A', 'Ф'], ['S', 'Ы'], ['D', 'В'], ['Z', 'Я'], ['X', 'Ч'], ['C', 'С']];

function App() {
  const [volume, setVolume] = useState(5);
  const [ state, dispatch ] = useContext(DrumMachineContext); 

  function handlePowerSwitch() {
    dispatch({ type: ACTIONS.SWITCH_POWER, payload: {mute: state.mute} });
  }

  function handleBankChange() {
    const newBankIndex = state.bankIndex === 0 ? 1 : 0;
    dispatch({ type: ACTIONS.DISPLAY_NAME, payload: {currentName: AUDIO_CLIPS[newBankIndex].bank} });
    dispatch({ type: ACTIONS.CHANGE_BANK, payload: {currentName: AUDIO_CLIPS[newBankIndex].bank, bankIndex: state.bankIndex} });
  }

  function handleVolumeChange(e) {
    const newVolume = parseInt(e.target.value);
    setVolume(newVolume);
    dispatch({ type: ACTIONS.CHANGE_VOLUME, payload: { volume: newVolume } });
  }

  return (
    <div className="App">
      <div id="drum-machine" className="drum-machine">
        <h1 className="drum-machine-brand">Mockai</h1>
        <div className="drum-machine-ui">
          <div className="keys">
          {AUDIO_CLIPS[state.bankIndex].clips.map((drumpad, index) => {
            return <DrumPad key={drumpad.id} drumpad={drumpad} keyboardKey={KEYBOARD_KEYS[index]} />
          })}
          </div>
          <div className="settings">
            <div id="display" className="display">{state.currentName}</div>
            <div className="switches-container">
              <Switch name={'Power'} onChange={handlePowerSwitch} />
              <Switch name={'Bank'} onChange={handleBankChange} />
            </div>
            <input type="range" onInput={handleVolumeChange} min="0" max="10" value={volume} step="1" />
          </div>
        </div>
        <PatternField />
      </div>
    </div>
  );
}

export default App;