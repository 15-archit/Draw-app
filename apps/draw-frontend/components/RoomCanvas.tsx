"use client";
import { WS_URL } from "@/config";
import { useEffect, useState } from "react";
import { Canvas } from "./Canvas";

export function RoomCanvas({ roomId }: { roomId: string }) {
    const [socket, setSocket] = useState<WebSocket | null>(null);

    useEffect(() => {
        const tokenVal = localStorage.getItem("token");

        if (!tokenVal) {
            console.error("Token not found");
            return;
        }

        const ws = new WebSocket(`${WS_URL}?token=${tokenVal}`);

        ws.onopen = () => {
            setSocket(ws);

            const data = JSON.stringify({
                type: "join_room",
                roomId,
            });

            console.log(data);
            ws.send(data);
        };

        ws.onerror = (error) => {
            console.error("WebSocket error:", error);
        };

        ws.onclose = () => {
            console.log("WebSocket disconnected");
            setSocket(null);
        };

        return () => {
            ws.close();
        };
    }, [roomId]);

    if (!socket) {
        return <div>Connecting to server....</div>;
    }

    return (
        <div>
            <Canvas roomId={roomId} socket={socket} />
        </div>
    );
}