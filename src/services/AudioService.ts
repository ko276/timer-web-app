// src/services/AudioService.ts

import { AlarmSoundType } from '../types';

class AudioService {
    private audioContext: AudioContext;
    private oscillator: OscillatorNode | null = null;
    private gainNode: GainNode | null = null;
    private timeoutIds: number[] = [];

    constructor() {
        this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    }

    private createOscillator(frequency: number, type: OscillatorType = 'sine') {
        this.oscillator = this.audioContext.createOscillator();
        this.oscillator.frequency.setValueAtTime(frequency, this.audioContext.currentTime);
        this.oscillator.type = type;

        this.gainNode = this.audioContext.createGain();
        this.gainNode.gain.setValueAtTime(0, this.audioContext.currentTime);
        this.gainNode.gain.linearRampToValueAtTime(0.5, this.audioContext.currentTime + 0.01);

        this.oscillator.connect(this.gainNode);
        this.gainNode.connect(this.audioContext.destination);
        this.oscillator.start();
    }

    

    stopSound() {
        if (this.oscillator) {
            this.oscillator.stop();
            this.oscillator.disconnect();
            this.oscillator = null;
        }
        if (this.gainNode) {
            this.gainNode.disconnect();
            this.gainNode = null;
        }
        this.timeoutIds.forEach(id => clearTimeout(id));
        this.timeoutIds = [];
    }

    async resumeAudioContext() {
        if (this.audioContext.state === 'suspended') {
            await this.audioContext.resume();
        }
    }

    // Plays one cycle of the sound
    private playSingleCycleSound(type: AlarmSoundType) {
        this.stopSound(); // Stop any previous sound

        switch (type) {
            case AlarmSoundType.BEEP:
                this.playBeepOnce();
                break;
            case AlarmSoundType.SIREN:
                this.playSirenOnce();
                break;
            case AlarmSoundType.WARBLE:
                this.playWarbleOnce();
                break;
            case AlarmSoundType.BUZZER:
                this.playBuzzerOnce();
                break;
            case AlarmSoundType.BELL:
                this.playBellOnce();
                break;
            case AlarmSoundType.HORN:
                this.playHornOnce();
                break;
            case AlarmSoundType.PHONERINGTONE:
                this.playPhoneRingtoneOnce();
                break;
        }
    }

    // Starts continuous alarm playback (for when timer finishes)
    startContinuousAlarm(type: AlarmSoundType, isSoundEnabled: boolean) {
        if (!isSoundEnabled) {
            return;
        }
        this.stopSound(); // Stop any previous sound

        const playAndScheduleNext = () => {
            this.playSingleCycleSound(type);
            let nextCycleDelay = 0;
            switch (type) {
                case AlarmSoundType.BEEP:
                    nextCycleDelay = 1000; // 0.5s beep + 0.5s silence
                    break;
                case AlarmSoundType.SIREN:
                    nextCycleDelay = 2000; // 1s up + 1s down
                    break;
                case AlarmSoundType.WARBLE:
                    nextCycleDelay = 400; // 0.2s tone + 0.2s tone
                    break;
                case AlarmSoundType.PHONERINGTONE:
                    nextCycleDelay = 2000 + (0.4 + 0.2) * 3 * 1000; // 3 tones with silence + 2s interval
                    break;
                default:
                    nextCycleDelay = 1000; // Default repeat after 1 second for non-looping sounds
                    break;
            }
            this.timeoutIds.push(window.setTimeout(playAndScheduleNext, nextCycleDelay));
        };
        playAndScheduleNext();
    }

    // Previews sound once (for settings screen)
    previewSound(type: AlarmSoundType, isSoundEnabled: boolean, duration: number = 1000) { // Default to 1 second
        if (!isSoundEnabled) {
            return;
        }
        this.playSingleCycleSound(type);
        this.timeoutIds.push(window.setTimeout(() => {
            this.stopSound();
        }, duration));
    }

    // MARK: - Single Cycle Sound Generation Functions

    private playBeepOnce() {
        this.createOscillator(440);
        this.gainNode?.gain.setValueAtTime(0.5, this.audioContext.currentTime);
        this.oscillator?.stop(this.audioContext.currentTime + 0.5);
        
    }

    private playSirenOnce() {
        this.createOscillator(800);
        const now = this.audioContext.currentTime;
        this.oscillator?.frequency.setValueAtTime(800, now);
        this.oscillator?.frequency.linearRampToValueAtTime(1200, now + 1);
        this.oscillator?.frequency.linearRampToValueAtTime(800, now + 2);
        this.oscillator?.stop(now + 2);
        
    }

    private playWarbleOnce() {
        let is600Hz = true;
        const playNextSegment = (segmentCount: number) => {
            if (segmentCount <= 0) {
                return;
            }
            this.createOscillator(is600Hz ? 600 : 1000);
            this.gainNode?.gain.setValueAtTime(0.5, this.audioContext.currentTime);
            this.oscillator?.stop(this.audioContext.currentTime + 0.2);
            is600Hz = !is600Hz;
            this.timeoutIds.push(window.setTimeout(() => playNextSegment(segmentCount - 1), 200));
        };
        playNextSegment(2); // Play two segments (600Hz then 1000Hz)
    }

    private playBuzzerOnce() {
        this.createOscillator(400, 'square');
        this.gainNode?.gain.setValueAtTime(0.5, this.audioContext.currentTime);
        this.oscillator?.stop(this.audioContext.currentTime + 1);
    }

    private playBellOnce() {
        this.createOscillator(2000);
        const now = this.audioContext.currentTime;
        this.gainNode?.gain.setValueAtTime(0.5, now);
        this.gainNode?.gain.exponentialRampToValueAtTime(0.0001, now + 0.3); // Decay
        this.oscillator?.stop(now + 0.3);
    }

    private playHornOnce() {
        this.createOscillator(200);
        this.gainNode?.gain.setValueAtTime(0.5, this.audioContext.currentTime);
        this.oscillator?.stop(this.audioContext.currentTime + 1);
    }

    private playPhoneRingtoneOnce() {
        const playSegment = (segmentIndex: number) => {
            if (segmentIndex >= 3) {
                return;
            }
            this.createOscillator(600);
            this.gainNode?.gain.setValueAtTime(0.5, this.audioContext.currentTime);
            this.oscillator?.stop(this.audioContext.currentTime + 0.4);
            this.timeoutIds.push(window.setTimeout(() => {
                if (segmentIndex < 2) { // Only add silence between first two tones
                    this.timeoutIds.push(window.setTimeout(() => playSegment(segmentIndex + 1), 200)); // 0.2s silence
                } else {
                    playSegment(segmentIndex + 1); // No silence after last tone of the sequence
                }
            }, 400));
        };
        playSegment(0);
    }
}

export const audioService = new AudioService();