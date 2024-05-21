import React, { useState } from 'react';
import { Table, Button } from 'antd';
import { EditOutlined, CloseOutlined, CheckOutlined } from '@ant-design/icons';
import './channels-yearly-view.css';
import {
  UPDATE_BUDGET_ALLOCATION,
  UPDATE_MONTH_BUDGET,
  useGlobalState,
} from '../../state/budget-context';
import { toMonthDisplay } from '../utils';
import InputBudget, { budgetFormatter } from '../input-budget/input-budget';
import { BudgetAllocationType } from '../../state/models/channel';

interface EditingType {
  key: string;
  month: number;
}

const ChannelsYearlyView = () => {
  const {
    state: { channels },
    dispatch,
  } = useGlobalState();
  const [editing, setEditing] = useState<EditingType>();
  const [inputValue, setInputValue] = useState<number | null>(null);

  const handleEdit = (key: string, month: number) => {
    setEditing({ key, month });
    const channel = channels.find((item) => item.id === key);
    if (channel) {
      setInputValue(channel.monthBreakdown[month]);
    }
  };

  const handleSave = (key: string, month: number) => {
    dispatch({
      type: UPDATE_BUDGET_ALLOCATION,
      payload: { channelId: key, allocationType: BudgetAllocationType.Manual },
    });
    dispatch({
      type: UPDATE_MONTH_BUDGET,
      payload: {
        channelId: key,
        month,
        budget: inputValue || 0,
      },
    });
    setEditing(undefined);
  };

  const handleCancel = () => {
    setEditing(undefined);
  };

  const handleInputChange = (val: number | null) => {
    setInputValue(val);
  };

  const columns = [
    {
      title: 'CHANNEL',
      dataIndex: 'name',
      key: 'name',
    },
    ...Array.from({ length: 12 }, (_, index) => ({
      title: `${toMonthDisplay(index).toUpperCase()} 21`,
      dataIndex: 'monthBreakdown',
      key: `month-${index}`,
      render: (budgets: Array<number>, record: { key: string }) => {
        const isEditing =
          editing?.key === record.key && editing.month === index;
        return isEditing ? (
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <InputBudget
              value={inputValue}
              onChange={handleInputChange}
              style={{ width: 70, marginRight: 8 }}
            />
            <Button
              size="small"
              shape="circle"
              icon={<CheckOutlined />}
              onClick={() => handleSave(record.key, index)}
              style={{
                marginRight: 4,
                backgroundColor: '#2ecf5f',
                color: 'white',
              }}
            />
            <Button
              size="small"
              shape="circle"
              icon={<CloseOutlined />}
              onClick={handleCancel}
              style={{ backgroundColor: 'red', color: 'white' }}
            />
          </div>
        ) : (
          <div className="yearly-view-editable-cell">
            ${budgetFormatter(budgets[index])}
            <Button
              type="text"
              size="small"
              shape="circle"
              className="yearly-view-editable-cell-edit-button"
              icon={<EditOutlined />}
              onClick={() => handleEdit(record.key, index)}
              style={{ marginLeft: 8 }}
            />
          </div>
        );
      },
    })),
  ];

  return (
    <div className="yearly-view">
      <Table
        dataSource={channels.map((channel) => ({
          ...channel,
          key: channel.id,
        }))}
        columns={columns}
        pagination={false}
        bordered
      />
    </div>
  );
};

export default ChannelsYearlyView;
