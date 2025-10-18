
import './App.scss'
import { ConfigProvider, theme, Layout, Row, Col, Alert } from 'antd';
import Header from './components/Header';
import MetricCard from './components/MetricCard';
import { useState } from 'react';
import type { FilterState } from './types';
import ChangesTable from './components/ChangesTable';
import { BotHumanPieChart } from './components/charts/BotHumanPieChart';
import { TopWikisBarChart } from './components/charts/TopWikisBarChart';
// @ts-ignore
import { useWikimediaStream } from './hooks/useWikimediaStream';

const { Content } = Layout;

function App() {
  const { isConnected, metrics, changes, error } = useWikimediaStream();
  const [filter, setFilter] = useState<FilterState>({ type: 'All', domain: '' });

  return (
    <ConfigProvider theme={{ algorithm: theme.darkAlgorithm, token: { fontFamily: "'Inter', sans-serif" } }}>
      <Layout className='appLayout'>
        <Header isConnected={isConnected} />
        <Content className='content'>
          {error && <Alert message="Connection Error" description={error} type="error" showIcon closable style={{ marginBottom: 24 }} />}

          <Row gutter={[24, 24]}>
            <Col xs={24} sm={12} lg={6}><MetricCard title='Total Edits' value={20} /></Col>
            <Col xs={24} sm={12} lg={6}><MetricCard title='Human Edits' value={20} /></Col>
            <Col xs={24} sm={12} lg={6}><MetricCard title='Bot Edits' value={20} /></Col>
            <Col xs={24} sm={12} lg={6}><MetricCard title='Active Wikis' value={20} /></Col>
          </Row>

          <Row gutter={[24, 24]} style={{ marginTop: 24 }}>
            <Col xs={24} lg={12}><BotHumanPieChart data={metrics} /></Col>
            <Col xs={24} lg={12}><TopWikisBarChart data={metrics.wikiCounts} /></Col>
          </Row>
          <ChangesTable changes={changes} filter={filter} setFilter={setFilter} />
        </Content>
      </Layout>
    </ConfigProvider>
  )
}

export default App
