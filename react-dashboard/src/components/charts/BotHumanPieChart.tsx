import { memo } from "react";
import type { Metrics } from "../../types";
import { Card } from "antd";
import { Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";


interface ChartProps {
    data: Metrics
}

const COLORS = ['#3772FF', '#A371F7'];

export const BotHumanPieChart = memo(({ data }: ChartProps) => {
    const hasData = data && (data.humanChanges > 0 || data.botChanges > 0);
    const chartData = [{ name: 'Human Edits', value: data.humanChanges }, { name: 'Bot Edits', value: data.botChanges }]

    return (
        <Card title="Bot vs Human Activity">
            <div style={{ height: 300 }}>
                {!hasData ? (
                    <div>
                        Awaiting data...
                    </div>
                ) : (
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                dataKey="value"
                                data={chartData}
                                innerRadius="60%"
                                outerRadius="80%"
                                paddingAngle={5}
                            >
                                {chartData.map((_entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>

                            {/* Improved Tooltip */}
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: 'var(--color-background-secondary)',
                                    border: 'none',
                                    borderRadius: '8px',
                                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
                                    color: 'var(--color-text)',
                                    padding: '12px',
                                    fontSize: '14px',
                                    fontFamily: 'inherit',
                                }}
                                itemStyle={{
                                    color: 'var(--color-text)',
                                    fontSize: '14px',
                                    padding: '4px 0',
                                }}
                                labelStyle={{
                                    fontWeight: '600',
                                    marginBottom: '6px',
                                    color: 'var(--color-text-primary)',
                                }}
                                formatter={(value, name) => [
                                    `${value}`,
                                    name,
                                ]}
                                separator=": "
                            />

                            <Legend
                                iconType="circle"
                                wrapperStyle={{ paddingTop: '16px' }}
                                formatter={(value, _entry, index) => {
                                    void _entry;
                                    return (
                                        <span style={{ color: 'var(--color-text)' }}>
                                            {value} ({chartData[index].value})
                                        </span>
                                    );
                                }}
                            />
                        </PieChart>
                    </ResponsiveContainer>
                )}
            </div>
        </Card>
    )
})