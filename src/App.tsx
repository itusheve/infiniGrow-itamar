import React from 'react';
import { BudgetProvider } from './state/budget-context';
import HomePage from './components/home-page/home-page';

function App() {
  return (
    <BudgetProvider>
      <HomePage />
    </BudgetProvider>
  );
}

export default App;
