import './scss/ChangeTable.scss'
import { useMemo, memo } from 'react';
import { Card, Table, Tag } from 'antd';
import type { TableProps } from 'antd';
import type { WikimediaChange, FilterState } from '../types';


// Inline SVG icons for better performance and customization
const IconBot = () => <svg width="14" height="14" viewBox="0 0 24 24"><path fill="currentColor" d="M12,2A2,2 0 0,1 14,4V6H10V4A2,2 0 0,1 12,2M16,9V11H8V9H6V11A2,2 0 0,0 8,13H16A2,2 0 0,0 18,11V9H16M20,15H4V13H2V15A2,2 0 0,0 4,17H20A2,2 0 0,0 22,15V13H20V15Z" /></svg>;
const IconUser = () => <svg width="14" height="14" viewBox="0 0 24 24"><path fill="currentColor" d="M12,4A4,4 0 0,1 16,8A4,4 0 0,1 12,12A4,4 0 0,1 8,8A4,4 0 0,1 12,4M12,14C16.42,14 20,15.79 20,18V20H4V18C4,15.79 7.58,14 12,14Z" /></svg>;

interface ChangeTableProps {
    changes: WikimediaChange[];
    filter: FilterState;
    setFilter: React.Dispatch<React.SetStateAction<FilterState>>;
}

const columns: TableProps<WikimediaChange>['columns'] = [
    {
        title: 'Type',
        dataIndex: 'bot',
        key: 'bot',
        width: 100,
        render: (isBot) => isBot ? <Tag icon={<IconBot />} color='purple'>Bot</Tag> : <Tag icon={<IconUser />} color='blue'>Human</Tag>
    }
]

const ChangesTable = ({ changes, filter, setFilter }: ChangeTableProps) => {

    const filteredChanges = useMemo(() => changes.filter(c => {
        const typeFilter = filter.type === 'all' || (filter.type === 'bot' && c.bot) || (filter.type === 'human' && !c.bot);
        const domainFilter = filter.domain.trim() === '' || c.server_name.toLowerCase().includes(filter.domain.toLowerCase());
        return typeFilter && domainFilter
    }), [changes, filter])



    return (
        <Card className='tableCard'>
            <Table
                columns={columns}
                dataSource={filteredChanges}
                pagination={false}
                size='small'
                scroll={{ y: 400 }}
                rowKey="key"
            />
        </Card>
    )
}

export default memo(ChangesTable);