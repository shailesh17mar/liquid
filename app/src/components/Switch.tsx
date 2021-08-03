import React from 'react';

interface SwitchProps {
  checked: boolean;
  label?: string;
  onChange: (value: boolean) => void;
}

const Switch = ({checked = false, label, onChange}: SwitchProps) => {
  return (
    <div>
      <label className="switch">
        <input
          type="checkbox"
          checked={checked}
          onChange={() => onChange(!checked)}
        />
        <span className="slider round"></span>
      </label>
      {label && <span className="switch-label">Shailesh</span>}
    </div>
  );
};

export default Switch;
