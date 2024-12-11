import knex from "knex"

const db = knex ({
    client: 'mysql2',
    connection: {
        host: 'localhost',
        port: 3306,
        user: 'root',
        password: '',
        database: 'web',
    },
    pool: { min: 0, max: 7}
});

export default db