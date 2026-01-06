import { DataSource } from "typeorm";

export const AppDataSource = new DataSource({
    type: "sqlite",
    database: "database.sqlite", // The file path for your database
    //entities: [Product], 
    entities: ["src/modules/**/**.entity.{ts,js}"], // List of entities
    synchronize: true, // Automatically create database schema (use migrations in production)
    logging: false, // Set to true to log SQL queries
    migrations: ["src/migrations/*.ts"]
});