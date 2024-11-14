import knex from "knex"

const db = knex ({
    client: 'mysql2',
    connection: {
        host: '127.0.0.1',
        port: 3306,
        user: 'root',
        password: '',
        database: 'web-new',
    },
    pool: { min: 0, max: 7}
});

export default db
