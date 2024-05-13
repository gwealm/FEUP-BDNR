import * as z from "zod";

const BaseObject = z.object({
    id: z.string(),
});

const MessageBaseImage = BaseObject.extend({
    content: z.string(),
    timestamp: z.number(),
});

const ServerPreviewSchema = BaseObject.extend({
    name: z.string(),
    image: z.string().url().optional(),
});


const ChannelPreviewSchema = BaseObject.extend({
    name: z.string(),
    server: ServerPreviewSchema.shape.id,
});

const UserPreviewSchema = BaseObject.extend({
    username: z.string(),
    online: z.coerce
        .string()
        .transform((val) => (val.toLowerCase() === "true" ? true : false))
        .pipe(z.boolean()),
    image: z.string().url().optional(),
});

const ChannelSchema = ChannelPreviewSchema.extend({
    messages: MessageBaseImage.shape.id.array(),
});

const ServerSchema = ServerPreviewSchema.extend({
    channels: z.record(ChannelSchema.shape.id, ChannelPreviewSchema),
    members: z.record(UserPreviewSchema.shape.id, UserPreviewSchema),
    description: z.string().optional(),
    // owner: UserPreviewSchema.pick({ id: true, username: true }),
});

const UserSchema = UserPreviewSchema.extend({
    email: z.string().email(),
    register_date: z.number().optional(),
    servers: z.record(ServerPreviewSchema.shape.id, ServerPreviewSchema.extend({
        joined_at: z.number().optional(),
    })),
});

const MessageSchema = MessageBaseImage.extend({
    senderId: UserPreviewSchema.shape.id,
    senderName: UserPreviewSchema.shape.username,
    senderImage: UserPreviewSchema.shape.image,
});

type Message = z.infer<typeof MessageSchema>;
type User = z.infer<typeof UserSchema>;
type Server = z.infer<typeof ServerSchema>;
type ServerPreview = z.infer<typeof ServerPreviewSchema>;
type Channel = z.infer<typeof ChannelSchema>;
type ChannelPreview = z.infer<typeof ChannelPreviewSchema>;

export {
    MessageSchema,
    type Message,
    ChannelSchema,
    type Channel,
    ChannelPreviewSchema,
    type ChannelPreview,
    ServerSchema,
    type Server,
    ServerPreviewSchema,
    type ServerPreview,
    UserSchema,
    type User,
};
