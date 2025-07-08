
// src/types.ts

export enum AlarmSoundType {
    PhoneRingtone = "電話着信音",
    Beep = "ビープ音",
    Siren = "サイレン音",
    Warble = "ワーベル音",
    Buzzer = "ブザー音",
    Bell = "ベル音",
    Horn = "ホーン音",
}

export interface TimerSettings {
    minutes: number;
    seconds: number;
    pinCode: string;
    alarmSound: AlarmSoundType;
    alarmVolume: number;
}

export interface TimerState {
    remainingTime: number; // in seconds
    isRunning: boolean;
    isPaused: boolean;
    isFinished: boolean;
}
