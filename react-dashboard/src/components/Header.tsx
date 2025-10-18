import { Layout } from 'antd'
import {memo} from 'react'
import './scss/Header.scss'

const IconGlobe = () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M2 12h20"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>;

interface HeaderProps{
    isConnected:boolean
}

const AppHeader =({isConnected} : HeaderProps) =>(
    
    <Layout.Header className='header' >
        <div className='title'>
            <IconGlobe />
            <h1>LogStream Analysis</h1>
        </div>

        <div className='status'>
            <div className={`${'statusDot'} ${isConnected ? 'connected' : 'disconnected'}`}></div>
            <span>{isConnected ? 'Live' : 'Connecting...'}</span>
        </div>

    </Layout.Header>
)

export default memo(AppHeader)