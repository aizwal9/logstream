import { Card } from "antd";
import { memo, useMemo } from "react"
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

interface ChartProps {
    data: Record<string, number>
}

export const TopWikisBarChart = memo(({ data }: ChartProps) => {
    const hasData = data && Object.keys(data).length > 0
    const chartData = useMemo(() => hasData ?
        Object.entries(data).sort(([, a], [, b]) => b - a).slice(0, 7).map(([name, Edits]) => ({ name, Edits })).reverse()
        : [], [data]);

    return (
        <Card title="Top 10 Active Wikis">
            <div style={{ height: 300 }}>
                {!hasData ? (
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: 'var(--color-text-secondary)' }}>
                        Awaiting data...
                    </div>
                ) : (
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                            data={chartData}
                            layout="vertical"
                            margin={{ top: 20, right: 30, left: 100, bottom: 20 }}
                            barCategoryGap="30%"
                            barGap={4}
                        >
                            {/* Background grid for better readability */}
                            <CartesianGrid
                                horizontal={false}
                                stroke="var(--color-border)"
                                strokeDasharray="2 2"
                            />

                            {/* Category axis (Y-axis for names) */}
                            <YAxis
                                type="category"
                                dataKey="name"
                                stroke="var(--color-text-secondary)"
                                fontSize={13}
                                tickLine={false}
                                axisLine={false}
                                width={100}
                                tick={{
                                    fill: 'var(--color-text)',
                                    textAnchor: 'end',
                                    dx: -8
                                }}
                            />

                            {/* Value axis (X-axis for numbers) */}
                            <XAxis
                                type="number"
                                stroke="var(--color-text-secondary)"
                                fontSize={12}
                                tickLine={false}
                                axisLine={{ stroke: 'var(--color-border)' }}
                                tick={{ fill: 'var(--color-text-secondary)' }}
                                padding={{ left: 10, right: 10 }}
                            />

                            {/* Enhanced tooltip */}
                            <Tooltip
                                cursor={{
                                    fill: 'var(--color-primary)',
                                    opacity: 0.1,
                                    rx: 4,
                                    ry: 4
                                }}
                                contentStyle={{
                                    backgroundColor: 'var(--color-background-secondary)',
                                    border: '1px solid var(--color-border)',
                                    borderRadius: '8px',
                                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
                                    color: 'var(--color-text)',
                                    fontSize: '13px',
                                    padding: '10px 12px',
                                }}
                                formatter={(value) => [`${value} edits`, 'Edits']}
                                labelFormatter={(label) => `User: ${label}`}
                                separator=": "
                            />

                            {/* Animated, rounded bar with hover effect */}
                            <Bar
                                dataKey="Edits"
                                fill="var(--color-primary)"
                                radius={[0, 4, 4, 0]} // rounded right corners
                                barSize={24}
                                isAnimationActive
                                animationBegin={0}
                                animationDuration={600}
                                animationEasing="ease-out"
                            >
                                {/* Optional: show value labels on bars */}
                                {/* 
                                <LabelList 
                                    dataKey="Edits" 
                                    position="right" 
                                    fill="var(--color-text-secondary)" 
                                    fontSize={12}
                                    offset={8}
                                /> 
                                */}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                )}
            </div>
        </Card>
    )
})