export interface Server {

    id: string;
    name: string;

    image: string;

    channels: Channel[];
}

export interface Channel {
    id: string;
    name: string;

    messages: Message[];
}

export interface Message {

    id: string;

    /**
     * The text content 
     */
    content: string;
}