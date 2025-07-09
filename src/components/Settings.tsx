
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
        audioService.previewSound(newSoundType, settings.isSoundEnabled); // Play preview sound
    };

    const handleSoundToggle = () => {
        setSettings({ isSoundEnabled: !settings.isSoundEnabled });
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
                <label>音のオン/オフ:</label>
                <div onClick={handleSoundToggle} style={{ cursor: 'pointer' }}>
                    {settings.isSoundEnabled ? (
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="24px" height="24px">
                            <path d="M12 2C9.79 2 8 3.79 8 6v7c0 1.66-1.34 3-3 3H3v2h18v-2h-2c-1.66 0-3-1.34-3-3V6c0-2.21-1.79-4-4-4zm-1 17h2v2h-2v-2z"/>
                        </svg>
                    ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="24px" height="24px">
                            <path d="M12 2c-2.21 0-4 1.79-4 4v7c0 1.66-1.34 3-3 3H3v2h18v-2h-2c-1.66 0-3-1.34-3-3V6c0-2.21-1.79-4-4-4zm-1 17h2v2h-2v-2z"/>
                            <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" fill="red"/>
                        </svg>
                    )}
                </div>
            </div>

            <button onClick={onStart}>タイマー開始</button>
        </div>
    );
};

export default Settings;
