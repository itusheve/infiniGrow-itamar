import { InputNumber } from 'antd';
import numeral from 'numeral';
import React from 'react';

const budgetMonthPrefix = '$';
export const budgetFormatter = (value: number | undefined) => {
  return numeral(value).format('0,0');
};

interface Props {
  value: number | null;
  disabled?: boolean;
  className?: string;
  onChange?: (val: number | null) => void;
  style?: object;
}

const InputBudget = ({
  value,
  disabled,
  className,
  onChange,
  style,
}: Props) => {
  return (
    <InputNumber
      formatter={budgetFormatter}
      min={0}
      prefix={budgetMonthPrefix}
      placeholder="10,000"
      disabled={disabled}
      className={className}
      value={value}
      onChange={onChange}
      style={style}
    />
  );
};

export default InputBudget;
