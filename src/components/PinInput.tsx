
// src/components/PinInput.tsx

import React, { useState, useEffect } from 'react';

interface PinInputProps {
    validatePin: (pin: string) => boolean;
    onPinVerified: () => void;
    onClose: () => void;
}

const PinInput: React.FC<PinInputProps> = ({ validatePin, onPinVerified, onClose }) => {
    const [pinAttempt, setPinAttempt] = useState('');
    const [error, setError] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => {
            if (pinAttempt === '') {
                onClose();
            }
        }, 5000);
        return () => clearTimeout(timer);
    }, [pinAttempt, onClose]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setPinAttempt(value);
        setError(false);
        if (value.length === 4) {
            if (validatePin(value)) {
                onPinVerified();
            } else {
                setError(true);
                setPinAttempt(''); // Clear input on incorrect PIN
            }
        }
    };

    return (
        <div className="pin-input-overlay">
            <div className="pin-input-container">
                <h3>PINコードを入力してください</h3>
                <input
                    type="password"
                    value={pinAttempt}
                    onChange={handleChange}
                    maxLength={4}
                    autoFocus
                    className={error ? 'error' : ''}
                />
                {error && <p className="error-message">PINコードが間違っています</p>}
                <button onClick={onClose}>キャンセル</button>
            </div>
        </div>
    );
};

export default PinInput;
