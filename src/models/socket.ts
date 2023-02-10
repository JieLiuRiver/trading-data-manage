import { SOCKET_LISTEN_URL } from '@/constants';
import { useState } from 'react';
import { io, Socket } from 'socket.io-client';

const useSocket = () => {
  const [socket] = useState<Socket>(io(SOCKET_LISTEN_URL));
  return {
    socket,
  };
};

export default useSocket;
