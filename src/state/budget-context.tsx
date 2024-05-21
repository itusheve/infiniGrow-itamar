import React, {
  createContext,
  useReducer,
  useContext,
  Dispatch,
  ReactNode,
} from 'react';
import {
  BudgetAllocationType,
  BudgetChannel,
  BudgetFrequency,
  generateNewChannel,
  recalcChannel,
} from './models/channel';

export interface GlobalState {
  channels: Array<BudgetChannel>;
}

const initialState: GlobalState = {
  channels: [],
};

export const ADD_CHANNEL = 'ADD_CHANNEL';
export const UPDATE_BUDGET = 'UPDATE_BUDGET';
export const REMOVE_CHANNEL = 'REMOVE_CHANNEL';
export const UPDATE_BUDGET_ALLOCATION = 'UPDATE_BUDGET_ALLOCATION';
export const UPDATE_BUDGET_FREQUENCY = 'UPDATE_BUDGET_FREQUENCY';
export const UPDATE_BUDGET_BASELINE = 'UPDATE_BUDGET_BASELINE';
export const UPDATE_MONTH_BUDGET = 'UPDATE_MONTH_BUDGET';
export const UPDATE_CHANNEL_NAME = 'UPDATE_CHANNEL_NAME';

export type Action =
  | { type: typeof ADD_CHANNEL; payload: undefined }
  | { type: typeof REMOVE_CHANNEL; payload: { channelId: string } }
  | {
      type: typeof UPDATE_CHANNEL_NAME;
      payload: { channelId: string; name: string };
    }
  | {
      type: typeof UPDATE_BUDGET_FREQUENCY;
      payload: { channelId: string; frequency: BudgetFrequency };
    }
  | {
      type: typeof UPDATE_BUDGET_BASELINE;
      payload: { channelId: string; baseline: number | null };
    }
  | {
      type: typeof UPDATE_MONTH_BUDGET;
      payload: { channelId: string; month: number; budget: number };
    }
  | {
      type: typeof UPDATE_BUDGET_ALLOCATION;
      payload: { channelId: string; allocationType: BudgetAllocationType };
    };

const budgetReducer = (state: GlobalState, action: Action) => {
  let newState;
  switch (action.type) {
    case ADD_CHANNEL:
      newState = {
        ...state,
        channels: [...state.channels, generateNewChannel()],
      };
      break;
    case REMOVE_CHANNEL:
      newState = {
        ...state,
        channels: state.channels.filter(
          (channel: { id: string }) => channel.id !== action.payload.channelId,
        ),
      };
      break;
    case UPDATE_CHANNEL_NAME:
      newState = {
        ...state,
        channels: state.channels.map((channel) =>
          channel.id === action.payload.channelId
            ? { ...channel, name: action.payload.name }
            : channel,
        ),
      };
      break;
    case UPDATE_BUDGET_ALLOCATION:
      newState = {
        ...state,
        channels: state.channels.map((channel) => {
          if (channel.id === action.payload.channelId) {
            const channelWithUpdatedAllocationType = {
              ...channel,
              allocationType: action.payload.allocationType,
            };
            return recalcChannel(channelWithUpdatedAllocationType);
          } else {
            return channel;
          }
        }),
      };
      break;
    case UPDATE_BUDGET_FREQUENCY:
      newState = {
        ...state,
        channels: state.channels.map((channel) => {
          if (channel.id === action.payload.channelId) {
            const channelWithUpdatedFrequency = {
              ...channel,
              frequency: action.payload.frequency,
            };
            return recalcChannel(channelWithUpdatedFrequency);
          } else {
            return channel;
          }
        }),
      };
      break;
    case UPDATE_BUDGET_BASELINE:
      newState = {
        ...state,
        channels: state.channels.map((channel) => {
          if (channel.id === action.payload.channelId) {
            const channelWithUpdatedBaseline = {
              ...channel,
              baseline: action.payload.baseline,
            };
            return recalcChannel(channelWithUpdatedBaseline);
          } else {
            return channel;
          }
        }),
      };
      break;
    case UPDATE_MONTH_BUDGET:
      newState = {
        ...state,
        channels: state.channels.map((channel) => {
          if (channel.id === action.payload.channelId) {
            const channelWithUpdatedMonthBudget = {
              ...channel,
              monthBreakdown: channel.monthBreakdown.map(
                (oldBudget, monthIndex) =>
                  monthIndex === action.payload.month
                    ? action.payload.budget
                    : oldBudget,
              ),
            };
            return recalcChannel(channelWithUpdatedMonthBudget);
          } else {
            return channel;
          }
        }),
      };
      break;
    default:
      throw new Error('invalid action dispatched');
  }

  return newState;
};

interface BudgetContextProps {
  state: GlobalState;
  dispatch: Dispatch<Action>;
}

const BudgetContext = createContext<BudgetContextProps | undefined>(undefined);

export const BudgetProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(budgetReducer, initialState);

  return (
    <BudgetContext.Provider value={{ state, dispatch }}>
      {children}
    </BudgetContext.Provider>
  );
};

export const useGlobalState = (): BudgetContextProps => {
  const context = useContext(BudgetContext);
  if (!context) {
    throw new Error('useBudget must be used within a BudgetProvider');
  }
  return context;
};
