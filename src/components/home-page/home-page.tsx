import React from 'react';
import { PlusOutlined } from '@ant-design/icons';
import { Layout, Button, Tabs } from 'antd';
import { Content } from 'antd/es/layout/layout';
import TabPane from 'antd/es/tabs/TabPane';
import BudgetEditor from '../budget-editor/budget-editor';
import ChannelsYearlyView from '../channels-yearly-view/channels-yearly-view';
import { ADD_CHANNEL, useGlobalState } from '../../state/budget-context';

const HomePage = () => {
  const { dispatch } = useGlobalState();
  return (
    <Layout className="layout">
      <Content style={{ padding: '0 50px', marginTop: '20px' }}>
        <h1>Build your budget plan</h1>
        <h2>Setup channels</h2>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <p className="ghost-sub">
            Setup your added channels by adding baseline budgets out of your
            total budget. See the forecast impact with the help of tips and
            insights.
          </p>
          <Button
            icon={<PlusOutlined />}
            onClick={() => {
              dispatch({ type: ADD_CHANNEL, payload: undefined });
            }}
          >
            Add Channel
          </Button>
        </div>
        <Tabs defaultActiveKey="1">
          <TabPane tab="Tab 1" key="1">
            <BudgetEditor />
          </TabPane>
          <TabPane tab="Tab 2" key="2">
            <ChannelsYearlyView />
          </TabPane>
        </Tabs>
      </Content>
    </Layout>
  );
};

export default HomePage;
