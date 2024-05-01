import * as Aerospike from "aerospike";


const config = new Aerospike.Config({
    hosts: [
        {
            addr: "127.0.0.1",
            port: 3000
        }
    ]
});

const client = await Aerospike.connect(config);


let key = new Aerospike.Key('test', 'test', 'abcd')
let bins = {
    name: 'Norma',
    age: 31
}
await client.put(key, bins)
let record = await client.get(key)
console.info('Record:', record)
await client.remove(key)
await client.close();


