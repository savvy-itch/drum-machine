# Drum Machine React app
## Description
This is a Drum Machine web app built on React.js with state managed using Redux. 
You can check the [live version](https://drum-machine-redux-sib.netlify.app/) here.

![App Screenshot](https://i.ibb.co/SymfbrV/Screenshot-4.jpg)
## Functionality
- Pressing a respective key or clicking a pad triggers sample playing
- Power switch turns the app on and off
- Bank switch changes the current samples bank
- Pattern field allows to assign samples to create patterns that can be played
- The pattern can be cleared using "Clear" button
## Contribution
Any useful contribution is welcome. Here's what could be improved as of right now:
- Right now the volume change during a loop play resets it to start from the beginning. A solution to avoid loop reset would be useful.
- Re-renders optimization: some operations cause re-renders of unrelated components (e.g. changing volume).