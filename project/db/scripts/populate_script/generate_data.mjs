import { faker } from '@faker-js/faker';
import { channel } from 'diagnostics_channel';
import * as fs from 'fs';

const users = [
    {
        PK: 'user1',
        username: 'user1',
        email: faker.internet.email(),
        password: faker.internet.password(),
        online: false,
        registerDate: Date.now(),
        image: faker.image.avatar(),
        deleted: false,
        servers: [],
        serverStrings: []
    },
    {
        PK: 'user2',
        username: 'user2',
        email: faker.internet.email(),
        password: faker.internet.password(),
        online: false,
        registerDate: Date.now(),
        image: faker.image.avatar(),
        deleted: false,
        servers: [],
        serverStrings: []
    },
    {
        PK: 'user3',
        username: 'user3',
        email: faker.internet.email(),
        password: faker.internet.password(),
        online: false,
        registerDate: Date.now(),
        image: faker.image.avatar(),
        deleted: false,
        servers: [],
        serverStrings: []
    },
    {
        PK: 'user4',
        username: 'user4',
        email: faker.internet.email(),
        password: faker.internet.password(),
        online: false,
        registerDate: Date.now(),
        image: faker.image.avatar(),
        deleted: false,
        servers: [],
        serverStrings: []
    },
    {
        PK: 'user5',
        username: 'user5',
        email: faker.internet.email(),
        password: faker.internet.password(),
        online: false,
        registerDate: Date.now(),
        image: faker.image.avatar(),
        deleted: false,
        servers: [],
        serverStrings: []
    },
    {
        PK: 'user6',
        username: 'user6',
        email: faker.internet.email(),
        password: faker.internet.password(),
        online: false,
        registerDate: Date.now(),
        image: faker.image.avatar(),
        deleted: false,
        servers: [],
        serverStrings: []
    },
    {
        PK: 'user7',
        username: 'user7',
        email: faker.internet.email(),
        password: faker.internet.password(),
        online: true,
        registerDate: Date.now(),
        image: faker.image.avatar(),
        deleted: false,
        servers: [],
        serverStrings: []
    },
    {
        PK: 'user8',
        username: 'user8',
        email: faker.internet.email(),
        password: faker.internet.password(),
        online: false,
        registerDate: Date.now(),
        image: faker.image.avatar(),
        deleted: false,
        servers: [],
        serverStrings: []
    },
    {
        PK: 'user9',
        username: 'user9',
        email: faker.internet.email(),
        password: faker.internet.password(),
        online: false,
        registerDate: Date.now(),
        image: faker.image.avatar(),
        deleted: false,
        servers: [],
        serverStrings: []
    },
    {
        PK: 'user10',
        username: 'user10',
        email: faker.internet.email(),
        password: faker.internet.password(),
        online: false,
        registerDate: Date.now(),
        image: faker.image.avatar(),
        deleted: false,
        servers: [],
        serverStrings: []
    },
    {
        PK: 'user11',
        username: 'user11',
        email: faker.internet.email(),
        password: faker.internet.password(),
        online: false,
        registerDate: Date.now(),
        image: faker.image.avatar(),
        deleted: false,
        servers: [],
        serverStrings: []
    },
    {
        PK: 'user12',
        username: 'user12',
        email: faker.internet.email(),
        password: faker.internet.password(),
        online: false,
        registerDate: Date.now(),
        image: faker.image.avatar(),
        deleted: false,
        servers: [],
        serverStrings: []
    },
    {
        PK: 'user13',
        username: 'user13',
        email: faker.internet.email(),
        password: faker.internet.password(),
        online: false,
        registerDate: Date.now(),
        image: faker.image.avatar(),
        deleted: false,
        servers: [],
        serverStrings: []
    },
    {
        PK: 'user14',
        username: 'user14',
        email: faker.internet.email(),
        password: faker.internet.password(),
        online: false,
        registerDate: Date.now(),
        image: faker.image.avatar(),
        deleted: false,
        servers: [],
        serverStrings: []
    },
    {
        PK: 'user15',
        username: 'user15',
        email: faker.internet.email(),
        password: faker.internet.password(),
        online: false,
        registerDate: Date.now(),
        image: faker.image.avatar(),
        deleted: false,
        servers: [],
        serverStrings: []
    },
    {
        PK: 'user16',
        username: 'user16',
        email: faker.internet.email(),
        password: faker.internet.password(),
        online: false,
        registerDate: Date.now(),
        image: faker.image.avatar(),
        deleted: false,
        servers: [],
        serverStrings: []
    },
    {
        PK: 'user17',
        username: 'user17',
        email: faker.internet.email(),
        password: faker.internet.password(),
        online: true,
        registerDate: Date.now(),
        image: faker.image.avatar(),
        deleted: false,
        servers: [],
        serverStrings: []
    },
    {
        PK: 'user18',
        username: 'user18',
        email: faker.internet.email(),
        password: faker.internet.password(),
        online: false,
        registerDate: Date.now(),
        image: faker.image.avatar(),
        deleted: false,
        servers: [],
        serverStrings: []
    },
    {
        PK: 'user19',
        username: 'user19',
        email: faker.internet.email(),
        password: faker.internet.password(),
        online: false,
        registerDate: Date.now(),
        image: faker.image.avatar(),
        deleted: false,
        servers: [],
        serverStrings: []
    },
    {
        PK: 'user20',
        username: 'user20',
        email: faker.internet.email(),
        password: faker.internet.password(),
        online: false,
        registerDate: Date.now(),
        image: faker.image.avatar(),
        deleted: false,
        servers: [],
        serverStrings: []
    }
];


const messages = [];
const keywords = {};
for (let i = 0; i <= 450; i++) {

    const message = {

        PK: `message${i + 1}`,
        senderId: users[i % 20].PK,
        senderName: users[i % 20].PK,
        senderImage: users[i % 20].image,
        content: faker.lorem.sentence({ min: 3, max: 8 }),
        timestamp: faker.date.recent().getTime(),
        deleted: faker.datatype.boolean(0.1)

    };

    messages.push(message);
    
    const curr_keywords = message.content.toLowerCase().split(' ');
    for (const keyword of curr_keywords) {

        if (keywords.hasOwnProperty(keyword)) {
            keywords[keyword].push(message.PK);
        } else {
            keywords[keyword] = [message.PK];
        }

    }

}

const channels = [];
let offset = 0;
for (let i = 0; i < 30; i++) {

    const serverMessages = [];
    for (let j = 0; j < 8; j++) {
        serverMessages.push(messages[offset + j]);
    }
    offset += 15;

    const channel = {
        PK: `channel${i + 1}`,
        name: faker.animal.type(),
        server: `server${i % 20 + 1}`,
        messages: serverMessages.map(message => {
            return message.PK;
        }),
        members: serverMessages.map(message => {
            return [message.senderId, message.senderName, message.senderImage];
        })
    };

    channel.messages = '["' + channel.messages.join('","') + '"]'
    channels.push(channel);

}

const servers = [];
for (let i = 1; i <= 10; i++) {

    let serverMembers = [];
    let serverChannels = [];

    let foundMembers = false;
    for (let j = 0; j < 30; j++) {

        const curr_channel = channels[j];
        if (curr_channel.server !== `server${i}`) continue;

        
        serverChannels.push([curr_channel.PK, curr_channel.name, curr_channel.server]);
        if (!foundMembers) {
            serverMembers.push(curr_channel.members);
            serverMembers = serverMembers.flat();
            foundMembers = true;
        }

    }

    const serverChannelStrings = [];
    const serverMemberStrings = [];

    for (const channel of serverChannels) {
        serverChannelStrings.push(
            `"${channel[0]}": { "id": "${channel[0]}", "name": "${channel[1]}", "server": "${channel[2]}" }`
        );
    };

    for (const member of serverMembers) {
        
        let online
        if (member === 'user7' || member === 'user17') {
            online = "true";
        } else {
            online = "false";
        }

        serverMemberStrings.push(
            `"${member[0]}": { "id": "${member[0]}", "username": "${member[1]}", "online": "${online}", "image": "${member[2]}" }`
        );

    }

    const server = {
        PK: `server${i}`,
        name: faker.color.human(),
        description: faker.word.words(5),
        image: faker.image.url(),
        channels: serverChannelStrings,
        members: serverMemberStrings,
        membersInfo: serverMembers
    }

    servers.push(server);

}

users.forEach(user => {

    for (const server of servers) {

        const serverMemberInfo = server.membersInfo;
        for (const memberInfo of serverMemberInfo) {

            if (memberInfo[0] === user.PK) {
                user.servers.push([
                    server.PK, server.name, server.image,
                    faker.date.past().getTime()
                ]);
                break;
            }

        }

    }
    
    for (const server of user.servers) {
        user.serverStrings.push(
            `"${server[0]}": { "id": "${server[0]}", "name": "${server[1]}", "image": "${server[2]}", "joined_at": ${server[3]} }`
        );
    }

});

let fileContent = "-- Users\n";
for (const user of users) {
    fileContent += `INSERT INTO test.users (PK, username, email, password, online, registerDate, image, deleted, servers) VALUES ("${user.PK}", "${user.username}", '${user.email}', "${user.password}", "${user.online}", ${user.registerDate}, "${user.image}", "${user.deleted}", JSON('${'{' + user.serverStrings.join(',') + '}'}'));\n`;
}

fileContent += '\n-- Servers\n';
for (const server of servers) {
    fileContent += `INSERT INTO test.servers (PK, name, description, image, owner, channels, members) VALUES ("${server.PK}", "${server.name}", "${server.description}", "${server.image}", JSON('{"id": "${server.membersInfo[0][0]}", "username": "${server.membersInfo[0][1]}"}'), JSON('${'{' + server.channels.join(',') + '}'}'), JSON('${'{' + server.members.join(',') + '}'}'));\n`
}

fileContent += '\n-- Channels\n';
for (const channel of channels) {
    fileContent += `INSERT INTO test.channels (PK, name, server, messages) VALUES ("${channel.PK}", "${channel.name}", "${channel.server}", LIST('${channel.messages}'));\n`;
}

fileContent += '\n-- Messages\n';
for (const message of messages) {
    fileContent += `INSERT INTO test.messages (PK, senderId, senderName, senderImage, content, timestamp, deleted) VALUES ("${message.PK}", "${message.senderId}", "${message.senderName}", "${message.senderImage}", "${message.content}", ${message.timestamp}, "${message.deleted}");\n`;
}

fileContent += '\n-- Keywords\n';
for (const [key, value] of Object.entries(keywords)) {
    fileContent += `INSERT INTO test.keywords (PK, messageIds) VALUES("${key}", LIST('${'["' + value.join('","') + '"]'}'));\n`;
}

fs.writeFileSync(
    'generated_data',
    fileContent,
    'utf8'
);