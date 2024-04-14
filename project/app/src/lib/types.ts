export interface Server {

    id: string;
    name: string;

    image?: string;

    channels: Channel[];
}

type UserServerList = {
    [id: Server['id']]: Channel['id'];
}
export interface User {
    id: string;
    name: string;
    servers: UserServerList;
    lastServer: keyof User['servers'];
}

export interface Channel {
    id: string;
    name: string;

    server: Server['id'];

    messages: Message[];
}

export interface Message {

    id: string;

    /**
     * The text content 
     */
    content: string;
}