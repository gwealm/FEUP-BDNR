import type { Server } from "./types";

// place files you want to import through the `$lib` alias in this folder.
export const data: Server[] = [
    {
        id: "1",
        image: "https://picsum.photos/200/300",
        name: "Test Server",
        channels: [
            {
                id: "2",
                name: "Test Channel",
                messages: [
                    {
                        id: "3",
                        content: "Hello World!",
                    },
                ]
            }
        ]
    }
]