
// src/components/Settings.tsx

import React, { useState } from 'react';
import { TimerSettings, AlarmSoundType } from '../types';
import { audioService } from '../services/AudioService'; // Import audioService

interface SettingsProps {
    settings: TimerSettings;
    setSettings: (newSettings: Partial<TimerSettings>) => void;
    onStart: () => void;
}

const Settings: React.FC<SettingsProps> = ({ settings, setSettings, onStart }) => {
    const [minutesInput, setMinutesInput] = useState(String(settings.minutes));
    const [secondsInput, setSecondsInput] = useState(String(settings.seconds));
    const [pinInput, setPinInput] = useState(settings.pinCode);

    const handleMinutesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setMinutesInput(value);
    };

    const handleSecondsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setSecondsInput(value);
    };

    const handleMinutesFocus = (e: React.FocusEvent<HTMLInputElement>) => {
        setMinutesInput('');
    };

    const handleSecondsFocus = (e: React.FocusEvent<HTMLInputElement>) => {
        setSecondsInput('');
    };

    const handleMinutesBlur = (e: React.FocusEvent<HTMLInputElement>) => {
        if (e.target.value === '') {
            setMinutesInput('0');
            setSettings({ minutes: 0 });
        } else {
            const minutes = parseInt(e.target.value, 10);
            if (!isNaN(minutes)) {
                setSettings({ minutes });
            }
        }
    };

    const handleSecondsBlur = (e: React.FocusEvent<HTMLInputElement>) => {
        if (e.target.value === '') {
            setSecondsInput('0');
            setSettings({ seconds: 0 });
        } else {
            const seconds = parseInt(e.target.value, 10);
            if (!isNaN(seconds)) {
                setSettings({ seconds });
            }
        }
    };

    const handlePinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setPinInput(value);
        setSettings({ pinCode: value });
    };

    const handleAlarmSoundChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newSoundType = e.target.value as AlarmSoundType;
        setSettings({ alarmSound: newSoundType });
        audioService.previewSound(newSoundType, settings.alarmVolume); // Play preview sound
    };

    const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newVolume = parseFloat(e.target.value);
        setSettings({ alarmVolume: newVolume });
        // Optionally, play a short sound to preview volume change
        // audioService.previewSound(settings.alarmSound, newVolume, 500);
    };

    const alarmSoundNames: Record<AlarmSoundType, string> = {
        [AlarmSoundType.BEEP]: 'ビープ音',
        [AlarmSoundType.SIREN]: 'サイレン音',
        [AlarmSoundType.WARBLE]: 'ワーブル音',
        [AlarmSoundType.BUZZER]: 'ブザー音',
        [AlarmSoundType.BELL]: 'ベル音',
        [AlarmSoundType.HORN]: 'ホーン音',
        [AlarmSoundType.PHONERINGTONE]: '電話着信音',
    };

    return (
        <div className="settings-container">
            <h2>設定</h2>
            <div className="setting-group">
                <label>時間設定:</label>
                <div className="time-input-group">
                    <input
                        type="number"
                        inputMode="numeric"
                        pattern="[0-9]*"
                        value={minutesInput}
                        onChange={handleMinutesChange}
                        onFocus={handleMinutesFocus}
                        onBlur={handleMinutesBlur}
                        min="0"
                        placeholder="分"
                    />
                    <span>分</span>
                    <input
                        type="number"
                        inputMode="numeric"
                        pattern="[0-9]*"
                        value={secondsInput}
                        onChange={handleSecondsChange}
                        onFocus={handleSecondsFocus}
                        onBlur={handleSecondsBlur}
                        min="0"
                        placeholder="秒"
                    />
                    <span>秒</span>
                </div>
            </div>

            <div className="setting-group">
                <label>PINコード:</label>
                <input
                    type="password"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    value={pinInput}
                    onChange={handlePinChange}
                    maxLength={4}
                    placeholder="0000"
                />
            </div>

            <div className="setting-group">
                <label>アラーム音:</label>
                <select value={settings.alarmSound} onChange={handleAlarmSoundChange}>
                    {Object.values(AlarmSoundType).map(soundType => (
                        <option key={soundType} value={soundType}>
                            {alarmSoundNames[soundType]}
                        </option>
                    ))}
                </select>
            </div>

            <div className="setting-group">
                <label>音量:</label>
                <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.01"
                    value={settings.alarmVolume}
                    onChange={handleVolumeChange}
                />
            </div>

            <button onClick={onStart}>タイマー開始</button>
        </div>
    );
};

export default Settings;
