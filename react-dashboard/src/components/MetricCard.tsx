import { Card, Statistic } from 'antd';
import { memo } from 'react';

interface MetricCardProps {
    title: string,
    value: number
}

const MetricCard = ({ title, value }: MetricCardProps) => (
    <Card>
        <Statistic title={title} value={value} />
    </Card>
)

export default memo(MetricCard)