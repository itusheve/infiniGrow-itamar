import React from 'react';
import { Collapse, Dropdown, Button, Select, Radio, Card } from 'antd';
import { DollarOutlined, EllipsisOutlined } from '@ant-design/icons';
import LabeledInput from '../labeled-input/labeled-input';
import './budget-editor.css';
import {
  REMOVE_CHANNEL,
  UPDATE_BUDGET_ALLOCATION,
  UPDATE_BUDGET_BASELINE,
  UPDATE_BUDGET_FREQUENCY,
  UPDATE_CHANNEL_NAME,
  UPDATE_MONTH_BUDGET,
  useGlobalState,
} from '../../state/budget-context';
import {
  BudgetAllocationType,
  BudgetChannel,
  BudgetFrequency,
} from '../../state/models/channel';
import promptDialog from './channel-name-prompt';
import { toMonthDisplay } from '../utils';
import InputBudget from '../input-budget/input-budget';

const { Panel } = Collapse;

const budgetAllocationOptions = [
  {
    label: 'Equal',
    value: BudgetAllocationType.Equal,
  },
  {
    label: 'Manual',
    value: BudgetAllocationType.Manual,
  },
];

const toFrequencyDisplay = (frequency: BudgetFrequency) => {
  switch (frequency) {
    case BudgetFrequency.Annually:
      return 'anual';
    case BudgetFrequency.Monthly:
      return 'monthly';
    case BudgetFrequency.Quarterlly:
      return 'quarterly';
  }
};

const BudgetEditor = () => {
  const {
    state: { channels },
    dispatch,
  } = useGlobalState();
  const createMenu = (channelId: string) => {
    return [
      {
        key: 'edit',
        label: (
          <a
            onClick={async (e) => {
              e.preventDefault();
              e.stopPropagation();
              let newName;
              try {
                const currentName = channels.find(
                  (channel) => channel.id === channelId,
                )?.name;
                newName = await promptDialog(
                  'Change channel name',
                  '',
                  currentName,
                );
                dispatch({
                  type: UPDATE_CHANNEL_NAME,
                  payload: { channelId: channelId, name: newName },
                });
              } catch (_error) {
                /* empty */
              }
            }}
          >
            Edit
          </a>
        ),
      },
      {
        key: 'delete',
        label: (
          <span
            className="menu-item-danger"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              dispatch({ type: REMOVE_CHANNEL, payload: { channelId } });
            }}
          >
            Delete
          </span>
        ),
      },
    ];
  };

  return (
    <div>
      <h2>Edit Budget Channels</h2>
      <Collapse accordion>
        {channels.map((channel: BudgetChannel) => (
          <Panel
            header={
              <>
                <DollarOutlined /> <span>{channel.name}</span>
              </>
            }
            key={channel.id}
            extra={
              <Dropdown
                menu={{
                  items: createMenu(channel.id),
                }}
                trigger={['click']}
              >
                <Button
                  type="text"
                  size="small"
                  icon={<EllipsisOutlined style={{ fontSize: '16px' }} />}
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                  }}
                />
              </Dropdown>
            }
          >
            <div className="top-options">
              <LabeledInput
                label="Budget Frequency"
                input={
                  <Select
                    disabled={
                      channel.allocationType === BudgetAllocationType.Manual
                    }
                    defaultValue={channel.frequency}
                    options={[
                      {
                        value: BudgetFrequency.Annually,
                        label: <span>Annually</span>,
                      },
                      {
                        value: BudgetFrequency.Monthly,
                        label: <span>Monthly</span>,
                      },
                      {
                        value: BudgetFrequency.Quarterlly,
                        label: <span>Quarterly</span>,
                      },
                    ]}
                    onChange={(selectedFrequency) => {
                      dispatch({
                        type: UPDATE_BUDGET_FREQUENCY,
                        payload: {
                          channelId: channel.id,
                          frequency: selectedFrequency,
                        },
                      });
                    }}
                  />
                }
              />
              <LabeledInput
                label={`Baseline ${toFrequencyDisplay(channel.frequency)} Budget`}
                input={
                  <InputBudget
                    value={channel.baseline}
                    disabled={
                      channel.allocationType === BudgetAllocationType.Manual
                    }
                    onChange={(newBaseline) => {
                      dispatch({
                        type: UPDATE_BUDGET_BASELINE,
                        payload: {
                          channelId: channel.id,
                          baseline: newBaseline,
                        },
                      });
                    }}
                    className={
                      channel.allocationType === BudgetAllocationType.Equal
                        ? 'baseline-input-equal'
                        : 'baseline-input-manual'
                    }
                  />
                }
              />
              <LabeledInput
                label="Budget Allocation"
                input={
                  <Radio.Group
                    value={channel.allocationType}
                    options={budgetAllocationOptions}
                    onChange={(e) => {
                      dispatch({
                        type: UPDATE_BUDGET_ALLOCATION,
                        payload: {
                          channelId: channel.id,
                          allocationType: e.target.value,
                        },
                      });
                    }}
                    optionType="button"
                  />
                }
              />
            </div>
            <Card className="budget-editor-breakdown-card">
              <h2>Budget Breakdown</h2>
              <p className="ghost-sub">
                By default, your budget will be equally divided throughout the
                year. You can manually change the budget allocation, either now
                or later.
              </p>
              <div className="breakdown-items">
                {channel.monthBreakdown.map((budget, monthIndex) => (
                  <LabeledInput
                    key={monthIndex}
                    label={`${toMonthDisplay(monthIndex)} 21`}
                    input={
                      <InputBudget
                        disabled={
                          channel.allocationType === BudgetAllocationType.Equal
                        }
                        className={`budget-breakdown-item-input ${
                          channel.allocationType === BudgetAllocationType.Equal
                            ? 'budget-breakdown-item-equal'
                            : 'budget-breakdown-item-manual'
                        }
                        }`}
                        value={budget}
                        onChange={(newBudget) => {
                          dispatch({
                            type: UPDATE_MONTH_BUDGET,
                            payload: {
                              channelId: channel.id,
                              month: monthIndex,
                              budget: newBudget || 0,
                            },
                          });
                        }}
                      />
                    }
                  />
                ))}
              </div>
            </Card>
          </Panel>
        ))}
      </Collapse>
    </div>
  );
};

export default BudgetEditor;
