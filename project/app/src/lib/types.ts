interface Server {
    
    id: string;
    name: string;

    image: string;
    
    channels: Channel[];
}

interface Channel {
    id: string;
    name: string;

    messages: Message[];
}

interface Message {

    id: string;

    /**
     * The text content 
     */
    content: string;
}