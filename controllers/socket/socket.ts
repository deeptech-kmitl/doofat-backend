import { Server } from 'socket.io'

class Socket {
    private static instance: Server


    private constructor(server: any) {
        // kill(3001).then(console.log)
        //     .catch(console.log)
        Socket.instance = new Server(server, {
            path: '/',
            cors: {
                origin: '*',
            }
        })
    }

    static createInstance(server: any) {
        if (!Socket.instance) {
            new Socket(server)
            console.log('created');

            return Socket.instance
        }
        return Socket.instance
    }

    static getInstance() {
        if (!Socket.instance) {
            throw new Error('Socket instance not created')
        }
        return Socket.instance
    }

    // emit
    static emit(event: string, data: any) {
        Socket.instance.emit(event, data)
    }
}

export default Socket