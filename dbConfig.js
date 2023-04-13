import dotenv from "dotenv";
dotenv.config();

import pg from "pg"; // Update import statement to use the default export

const isProduction = process.env.NODE_ENV === "production";

const connectionString = `postgresql://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_DATABASE}`;

const pool = new pg.Pool({ // Update usage of 'pg' to use the default export
  connectionString: isProduction ? process.env.DATABASE_URL : connectionString,
  ssl: isProduction
});

export { pool };