import { useEffect } from "react";
import socket from "../sockets/socket";

export const useSocketEvent = (eventName: string, handler: (data: any) => void) => {
  useEffect(() => {
    socket.on(eventName, handler);

    return () => {
      socket.off(eventName, handler);
    };
  }, [eventName, handler]);
};