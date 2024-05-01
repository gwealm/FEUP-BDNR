import * as z from "zod";

const MessageSchema = z.object({
    id: z.string(),
    content: z.string(),
});
type Message = z.infer<typeof MessageSchema>;

const _serverId = z.string();

const ChannelSchema = z.object({
    id: z.string(),
    name: z.string(),

    server: _serverId,

    messages: MessageSchema.array(),
});
type Channel = z.infer<typeof ChannelSchema>;

const ServerSchema = z.object({
    id: _serverId,
    name: z.string(),

    image: z.string().optional(),

    channels: ChannelSchema.array(),
});
type Server = z.infer<typeof ServerSchema>;

const UserServerListSchema = _serverId.array();
type UserServerList = z.infer<typeof UserServerListSchema>;

const UserSchema = z.object({
    id: z.string(),
    email: z.string().email(),
    username: z.string(),
    servers: UserServerListSchema,
    lastServer: UserServerListSchema.element,
});
type User = z.infer<typeof UserSchema>;

export {
    MessageSchema,
    type Message,
    ChannelSchema,
    type Channel,
    ServerSchema,
    type Server,
    UserServerListSchema,
    type UserServerList,
    UserSchema,
    type User,
};
