
// src/types.ts

export enum AlarmSoundType {
    BEEP = 'Beep',
    SIREN = 'Siren',
    WARBLE = 'Warble',
    BUZZER = 'Buzzer',
    BELL = 'Bell',
    HORN = 'Horn',
    PHONERINGTONE = 'PhoneRingtone',
}

export interface TimerSettings {
    minutes: number;
    seconds: number;
    pinCode: string;
    alarmSound: AlarmSoundType;
    isSoundEnabled: boolean;
}

export interface TimerState {
    remainingTime: number; // in seconds
    isRunning: boolean;
    isPaused: boolean;
    isFinished: boolean;
}
