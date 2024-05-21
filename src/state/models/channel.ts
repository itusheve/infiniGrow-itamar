import { v4 as uuidv4 } from 'uuid';

export enum BudgetFrequency {
  Annually,
  Monthly,
  Quarterlly,
}

export enum BudgetAllocationType {
  Equal,
  Manual,
}

export interface BudgetChannel {
  id: string;
  name: string;
  frequency: BudgetFrequency;
  baseline: number | null;
  allocationType: BudgetAllocationType;
  monthBreakdown: Array<number>;
}

export const generateNewChannel = () => {
  return {
    id: uuidv4(),
    name: 'New channel',
    monthBreakdown: Array(12).fill(0),
    frequency: BudgetFrequency.Annually,
    baseline: 0,
    allocationType: BudgetAllocationType.Equal,
  };
};

export const recalcChannel = (channel: BudgetChannel): BudgetChannel => {
  if (channel.allocationType === BudgetAllocationType.Manual) {
    const totalSum = channel.monthBreakdown.reduce((acc, monthBudget) => {
      return acc + monthBudget;
    }, 0);
    return {
      ...channel,
      baseline: totalSum,
    };
  } else {
    let monthlyBudget;
    switch (channel.frequency) {
      case BudgetFrequency.Annually:
        monthlyBudget = (channel.baseline || 0) / 12;
        break;
      case BudgetFrequency.Quarterlly:
        monthlyBudget = (channel.baseline || 0) / 3;
        break;
      case BudgetFrequency.Monthly:
        monthlyBudget = channel.baseline || 0;
        break;
    }

    return {
      ...channel,
      monthBreakdown: Array(12).fill(monthlyBudget),
    };
  }
};
