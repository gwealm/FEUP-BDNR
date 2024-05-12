import * as Aerospike from "aerospike";
import type Record from "record";

const config = new Aerospike.Config({
    hosts: [
        {
            addr: "127.0.0.1",
            port: 3000,
        },
    ],
});

const client = await Aerospike.connect(config);

const NAMESPACE = "test";

const get = async (set: string, recordKey: string): Promise<Record> => {
    const key = new Aerospike.Key(NAMESPACE, set, recordKey);

    const record: Record = await client.get(key);

    return {
        ...record,
        bins: {
            ...record.bins,
            id: key.key,
        },
    };
};

const remove = async (set: string, recordKey: string): Promise<Record> => {
    const key = new Aerospike.Key(NAMESPACE, set, recordKey);

    const record = await client.remove(key);

    return record;
};

const put = async (
    set: string,
    recordKey: string,
    bins: object,
): Promise<Record> => {
    const key = new Aerospike.Key(NAMESPACE, set, recordKey);

    const record = await client.put(key, bins);

    return record;
};

const shutdown = async () => {
    await client.close();
};

export {
    client, // FIXME: THIS IS WRONG ON SO MANY LEVELS GOD HELP ME
    get,
    put,
    remove,
    shutdown,
};
