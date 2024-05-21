import React, { ReactNode } from 'react';
import './labeled-input.css';

interface Props {
  label: string;
  input: ReactNode;
}

const LabeledInput = ({ label, input }: Props) => {
  return (
    <div className="labeled-input-container">
      <div className="labeled-input-label">{label}</div>
      <div className="labeled-input-input">{input}</div>
    </div>
  );
};

export default LabeledInput;
