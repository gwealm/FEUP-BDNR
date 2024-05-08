import * as z from "zod";

const MessageSchema = z.object({
    id: z.string(),
    sender: z.string(),
    content: z.string(),
});
type Message = z.infer<typeof MessageSchema>;

const _serverId = z.string();

const ChannelSchema = z.object({
    id: z.string(),
    name: z.string(),

    server: _serverId,

    messages: MessageSchema.shape.id.array(),
});
const ChannelPreviewSchema = ChannelSchema.omit({ messages: true });
type Channel = z.infer<typeof ChannelSchema>;
type ChannelPreview = z.infer<typeof ChannelPreviewSchema>;

const ServerChannelListSchema = z.record(ChannelSchema.shape.id, ChannelPreviewSchema);
type ServerChannelList = z.infer<typeof ServerChannelListSchema>;

const ServerSchema = z.object({
    id: _serverId,
    name: z.string(),

    image: z.string().optional(),

    channels: ServerChannelListSchema,
});
const ServerPreviewSchema = ServerSchema.omit({ channels: true });
type Server = z.infer<typeof ServerSchema>;
type ServerPreview = z.infer<typeof ServerPreviewSchema>;

const UserServerListSchema = z.record(_serverId, ServerPreviewSchema);
type UserServerList = z.infer<typeof UserServerListSchema>;

const UserSchema = z.object({
    id: z.string(),
    email: z.string().email(),
    username: z.string(),
    servers: UserServerListSchema,
});
type User = z.infer<typeof UserSchema>;

export {
    MessageSchema,
    type Message,
    ChannelSchema,
    type Channel,
    ChannelPreviewSchema,
    type ChannelPreview,
    ServerChannelListSchema,
    type ServerChannelList,
    ServerSchema,
    type Server,
    ServerPreviewSchema,
    type ServerPreview,
    UserServerListSchema,
    type UserServerList,
    UserSchema,
    type User,
};
