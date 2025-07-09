
// src/components/TimerDisplay.tsx

import React from 'react';
import './TimerDisplay.css'; // For styling the circle

interface TimerDisplayProps {
    remainingTime: number;
    totalTime: number;
    isRunning: boolean;
    isFinished: boolean;
    onStopRequest: () => void;
    onTimerEnd: () => void;
}

const TimerDisplay: React.FC<TimerDisplayProps> = ({
    remainingTime,
    totalTime,
    isRunning,
    isFinished,
    onStopRequest,
    onTimerEnd,
}) => {
    const minutes = Math.floor(remainingTime / 60);
    const seconds = remainingTime % 60;

    const circumference = 2 * Math.PI * 90; // Circle radius 90
    const offset = circumference - (remainingTime / totalTime) * circumference;

    return (
        <div className="timer-container">
            <div className="timer-circle-container">
                <svg className="timer-circle" viewBox="0 0 200 200">
                    <circle
                        className="timer-circle-bg"
                        cx="100"
                        cy="100"
                        r="90"
                    ></circle>
                    <circle
                        className="timer-circle-progress"
                        cx="100"
                        cy="100"
                        r="90"
                        strokeDasharray={circumference}
                        strokeDashoffset={offset}
                        transform="rotate(-90 100 100)"
                    ></circle>
                </svg>
                <div className="timer-time-display">
                    {`${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`}
                </div>
            </div>

            {!isFinished && (
                <button className="stop-button" onClick={onStopRequest}>
                    ストップ
                </button>
            )}

            {isFinished && (
                <button className="end-button" onClick={onTimerEnd}>
                    おわり
                </button>
            )}
        </div>
    );
};

export default TimerDisplay;
