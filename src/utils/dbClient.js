require('dotenv').config();
const { Client } = require('pg');

class DBClient {
  constructor() {
    this.client = new Client({
      host: process.env.DB_HOST,
      port: process.env.DB_PORT,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME
    });
  }

  async connect() {
    await this.client.connect();
  }

  async query(sql, values = []) {
    return await this.client.query(sql, values);
  }

  async close() {
    await this.client.end();
  }
}

module.exports = DBClient;