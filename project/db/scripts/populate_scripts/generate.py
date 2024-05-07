import argparse
import random
import string
import lorem
import json

# Function to generate random string
def random_string(length):
    return ''.join(random.choices(string.ascii_letters + string.digits, k=length))

# Function to generate random server data
def generate_server_data(server_id):
    return {
        "PK": f"server{server_id}",
        "name": f"testserver{server_id}",
        "channels": {f"channel{ch_id}": {"id": f"channel{ch_id}", "name": f"testchannel{ch_id}", "server": f"server{server_id}"} for ch_id in range(1, random.randint(2, 5))},
        "members": [f"user{random.randint(1, 10)}" for _ in range(random.randint(1, 5))]
    }

# Function to generate random user data
def generate_user_data(user_id):
    return {
        "PK": f"user{user_id}",
        "username": f"user{user_id}",
        "email": f"user{user_id}@mail.com",
        "password": random_string(8),
        "servers": {f"server{random.randint(1, 5)}": {"id": f"server{random.randint(1, 5)}", "name": f"testserver{random.randint(1, 5)}", "image": f"https://picsum.photos/300/300"} for _ in range(random.randint(1, 3))}
    }

# Function to generate random message data with semi-credible conversation
def generate_message_data(msg_id, sender_id, receiver_id):
    sender_name = f"user{sender_id}"
    receiver_name = f"user{receiver_id}"
    if random.random() < 0.5:
        content = lorem.sentence()
    else:
        content = f"Hey {receiver_name}, how are you?"
    return f'INSERT INTO test.messages (PK, sender, receiver, content) VALUES ("message{msg_id}", "{sender_name}", "{receiver_name}", "{content}");\n'

# Main function to generate commands and write to file
def generate_aql_commands(output_file):
    with open(output_file, 'w') as file:

        file.write('-- Users\n')
        for user_id in range(1, 11):
            user_data = generate_user_data(user_id)
            file.write(f'INSERT INTO test.users (PK, username, email, password, servers) VALUES ("{user_data["PK"]}", "{user_data["username"]}", "{user_data["email"]}", "{user_data["password"]}", {json.dumps(user_data["servers"])});\n')

        file.write('\n\n\n-- Servers\n')
        for server_id in range(1, 6):
            server_data = generate_server_data(server_id)
            file.write(f'INSERT INTO test.servers (PK, name, channels, members) VALUES ("{server_data["PK"]}", "{server_data["name"]}", {json.dumps(server_data["channels"])}, {json.dumps(server_data["members"])});\n')


        # Insert the fixed user with email "testuser@mail.pt"
        fixed_user_data = {
            "PK": "fixed_user",
            "username": "testuser",
            "email": "testuser@mail.pt",
            "password": "password",
            "servers": {f"server{server_id}": {"id": f"server{server_id}", "name": f"testserver{server_id}", "image": f"https://picsum.photos/300/300"} for server_id in range(1, 6)}
        }
        file.write(f'INSERT INTO test.users (PK, username, email, password, servers) VALUES ("{fixed_user_data["PK"]}", "{fixed_user_data["username"]}", "{fixed_user_data["email"]}", "{fixed_user_data["password"]}", {json.dumps(fixed_user_data["servers"])});\n')

        file.write('\n\n\n-- Messages\n')
        msg_id = 1
        for sender_id in range(1, 11):
            for receiver_id in range(1, 11):
                if sender_id != receiver_id:
                    message_data = generate_message_data(msg_id, sender_id, receiver_id)
                    file.write(message_data)
                    msg_id += 1

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Generate AQL commands to populate Aerospike database with random data")
    parser.add_argument("--output-file", type=str, default="aerospike_populate_commands.aql", help="Output file name (default: aerospike_populate_commands.aql)")
    args = parser.parse_args()

    generate_aql_commands(args.output_file)
