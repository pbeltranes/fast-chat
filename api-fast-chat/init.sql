

-- La creación de la base de datos la hice por comandos debería crearse un dockerfile con esto 
-- docker run -e POSTGRES_USER=docker -e POSTGRES_PASSWORD=docker -e POSTGRES_DB=docker library/postgres

-- FROM library/postgres
-- COPY init.sql /docker-entrypoint-initdb.d/

-- Posteriormente en el docker-compose el dockerfile del librerey/postgres
CREATE USER docker;
CREATE DATABASE docker;
GRANT ALL PRIVILEGES ON DATABASE docker TO docker;
DROP TABLE IF EXISTS "public"."messages";
-- This script only contains the table creation statements and does not fully represent the table in the database. It's still missing: indices, triggers. Do not use it as a backup.

-- Sequence and defined type
CREATE SEQUENCE IF NOT EXISTS messages_id_seq;

GRANT ALL PRIVILEGES ON SEQUENCE messages_id_seq TO docker;
-- Table Definition
CREATE TABLE "messages" (
    "id" int4 NOT NULL DEFAULT nextval('messages_id_seq'::regclass),
    "text" varchar(255) NOT NULL,
    "username" varchar(255) NOT NULL,
    "created_at" timestamp NOT NULL DEFAULT now(),
    "room" varchar(255),
    PRIMARY KEY ("id")
);

GRANT ALL PRIVILEGES ON TABLE messages TO docker;