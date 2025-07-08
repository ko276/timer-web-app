// src/App.tsx

import React, { useState, useEffect, useCallback } from 'react';
import './App.css';
import { useTimer } from './hooks/useTimer';
import { audioService } from './services/AudioService';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { AlarmSoundType } from './types';


// Components (to be created)
import Settings from './components/Settings';
import TimerDisplay from './components/TimerDisplay';
import PinInput from './components/PinInput';

function App() {
    const { settings, timerState, setSettings, startTimer, stopTimer, resetTimer, validatePin } = useTimer();
    const [showSettings, setShowSettings] = useState(true);
    const [showPinInput, setShowPinInput] = useState(false);

    useEffect(() => {
        if (timerState.isFinished) {
            audioService.startContinuousAlarm(settings.alarmSound, settings.alarmVolume);
        }
    }, [timerState.isFinished, settings.alarmSound, settings.alarmVolume]);

    const handleStartTimer = () => {
        // Set initial time for the timer if it's 0
        if (settings.minutes === 0 && settings.seconds === 0) {
            setSettings({ minutes: 0, seconds: 0 }); // Ensure remainingTime is 0
        }
        startTimer();
        setShowSettings(false);
    };

    const handleStopRequest = () => {
        setShowPinInput(true);
    };

    const handlePinVerified = () => {
        stopTimer();
        audioService.stopSound();
        setShowPinInput(false);
        setShowSettings(true); // Go back to settings after stopping
    };

    const handleTimerEnd = () => {
        stopTimer();
        audioService.stopSound();
        resetTimer(); // Call resetTimer explicitly
        setSettings({ minutes: 0, seconds: 0 }); // Reset time only
        setShowSettings(true);
    };

    const handleClosePinInput = useCallback(() => {
        setShowPinInput(false);
    }, []);

    return (
        <div className="App">
            {showSettings ? (
                <Settings
                    settings={settings}
                    setSettings={setSettings}
                    onStart={handleStartTimer}
                />
            ) : (
                <TimerDisplay
                    remainingTime={timerState.remainingTime}
                    totalTime={settings.minutes * 60 + settings.seconds}
                    isRunning={timerState.isRunning}
                    isFinished={timerState.isFinished}
                    onStopRequest={handleStopRequest}
                    onTimerEnd={handleTimerEnd}
                />
            )}

            {showPinInput && (
                <PinInput
                    validatePin={validatePin}
                    onPinVerified={handlePinVerified}
                    onClose={handleClosePinInput}
                />
            )}
        </div>
    );
}

export default App;