
// src/hooks/useTimer.ts

import { useState, useEffect, useRef } from 'react';
import { TimerSettings, TimerState, AlarmSoundType } from '../types';

interface UseTimerResult {
    settings: TimerSettings;
    timerState: TimerState;
    setSettings: (newSettings: Partial<TimerSettings>) => void;
    startTimer: () => void;
    pauseTimer: () => void;
    resumeTimer: () => void;
    stopTimer: () => void;
    resetTimer: () => void;
    validatePin: (pin: string) => boolean;
}

const initialSettings: TimerSettings = {
    minutes: 0,
    seconds: 0,
    pinCode: "0000",
    alarmSound: AlarmSoundType.PhoneRingtone,
    alarmVolume: 0.5,
};

const initialTimerState: TimerState = {
    remainingTime: 0,
    isRunning: false,
    isPaused: false,
    isFinished: false,
};

export const useTimer = (): UseTimerResult => {
    const [settings, setSettingsState] = useState<TimerSettings>(initialSettings);
    const [timerState, setTimerState] = useState<TimerState>(initialTimerState);
    const intervalRef = useRef<number | null>(null);

    useEffect(() => {
        setTimerState(prevState => ({
            ...prevState,
            remainingTime: settings.minutes * 60 + settings.seconds,
        }));
    }, [settings.minutes, settings.seconds]);

    const setSettings = (newSettings: Partial<TimerSettings>) => {
        setSettingsState(prevSettings => ({
            ...prevSettings,
            ...newSettings,
        }));
    };

    const startTimer = () => {
        if (timerState.isRunning && !timerState.isPaused) return;

        setTimerState(prevState => ({
            ...prevState,
            isRunning: true,
            isPaused: false,
            isFinished: false,
        }));

        if (intervalRef.current) {
            clearInterval(intervalRef.current);
        }

        intervalRef.current = window.setInterval(() => {
            setTimerState(prevState => {
                if (prevState.remainingTime > 0) {
                    return { ...prevState, remainingTime: prevState.remainingTime - 1 };
                } else {
                    clearInterval(intervalRef.current!);
                    return { ...prevState, isRunning: false, isFinished: true };
                }
            });
        }, 1000);
    };

    const pauseTimer = () => {
        if (intervalRef.current) {
            clearInterval(intervalRef.current);
        }
        setTimerState(prevState => ({ ...prevState, isPaused: true }));
    };

    const resumeTimer = () => {
        startTimer();
    };

    const stopTimer = () => {
        if (intervalRef.current) {
            clearInterval(intervalRef.current);
        }
        setTimerState(prevState => ({
            ...prevState,
            isRunning: false,
            isPaused: false,
        }));
    };

    const resetTimer = () => {
        stopTimer();
        setTimerState(prevState => ({
            ...prevState,
            remainingTime: settings.minutes * 60 + settings.seconds,
            isFinished: false,
        }));
    };

    const validatePin = (pin: string): boolean => {
        return pin === settings.pinCode;
    };

    return {
        settings,
        timerState,
        setSettings,
        startTimer,
        pauseTimer,
        resumeTimer,
        stopTimer,
        resetTimer,
        validatePin,
    };
};
