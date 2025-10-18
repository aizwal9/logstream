import { useEffect, useState } from "react"
import type { Metrics, WikimediaChange } from "../types";
import { Client } from '@stomp/stompjs';
import SockJs from 'sockjs-client'

const WEBSOCKET_URL = "http://localhost:8082/ws";
const MAX_CHANGES_LIST_SIZE = 100;

export const useWikimediaStream = () => {
    const [isConnected, setIsConnected] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [metrics, setMetrics] = useState<Metrics>({ totalChanges: 0, botChanges: 0, humanChanges: 0, wikiCounts: {} });
    const [changes, setChanges] = useState<WikimediaChange[]>([]);

    useEffect(() => {

        const client = new Client({
            webSocketFactory: () => new SockJs(WEBSOCKET_URL),
            reconnectDelay: 5000,
            debug: (str) => console.log(new Date(), str),

        });

        client.onConnect = () =>{
            setIsConnected(true)
            setError(null)
            client.subscribe('/topic/metrics',(message) => setMetrics(JSON.parse(message.body)))
            client.subscribe('/topic/recentchanges',(message) =>{
                const rawChange : WikimediaChange = JSON.parse(message.body)
                setChanges(prev => [{...rawChange,key : `${rawChange.id}-${rawChange.timestamp}`},...prev].slice(0,MAX_CHANGES_LIST_SIZE));
            })
        }

        client.onStompError = (frame) =>{
            const errorMsg = `Connection Error: ${frame.headers['message']}. Please ensure the backend service is running and accessible.`
            console.error(errorMsg,frame.body)
            setError(errorMsg)
        }

        client.onDisconnect = () => setIsConnected(false);
        client.activate();

        return () => {client.deactivate();}
    }, []);

    return {isConnected,metrics,changes,error}
}