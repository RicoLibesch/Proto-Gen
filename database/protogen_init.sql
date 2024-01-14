-- ----------------------------
-- Postgres Database
-- ----------------------------
\c "protogen"

CREATE SEQUENCE "protocol_templates_protocol_id_seq";
CREATE SEQUENCE "protocol_types_id_seq";
CREATE SEQUENCE "protocols_id_seq";
CREATE SEQUENCE "protocol_attendances_protocol_id_seq";

-- ----------------------------
-- Table structure for attendance_categories
-- ----------------------------
DROP TABLE IF EXISTS "attendance_categories";
CREATE TABLE "attendance_categories" (
  "title" varchar(255) COLLATE "pg_catalog"."default" NOT NULL,
  "order" int4 NOT NULL
)
;

-- ----------------------------
-- Records of attendance_categories
-- ----------------------------
BEGIN;
INSERT INTO "attendance_categories" ("title", "order") VALUES ('Vollmitglieder', 1);
INSERT INTO "attendance_categories" ("title", "order") VALUES ('Vertreter', 2);
INSERT INTO "attendance_categories" ("title", "order") VALUES ('Mitglieder', 3);
INSERT INTO "attendance_categories" ("title", "order") VALUES ('Gäste', 4);
INSERT INTO "attendance_categories" ("title", "order") VALUES ('Entschuldigt', 5);
INSERT INTO "attendance_categories" ("title", "order") VALUES ('Unentschuldigt', 6);
COMMIT;

-- ----------------------------
-- Table structure for legals
-- ----------------------------
DROP TABLE IF EXISTS "legals";
CREATE TABLE "legals" (
  "id" int4 NOT NULL,
  "title" varchar(255) COLLATE "pg_catalog"."default" NOT NULL,
  "value" varchar COLLATE "pg_catalog"."default"
)
;

-- ----------------------------
-- Records of legals
-- ----------------------------
BEGIN;
INSERT INTO "legals" ("id", "title", "value") VALUES (1, 'Impressum', NULL);
INSERT INTO "legals" ("id", "title", "value") VALUES (2, 'Datenschutz', NULL);
COMMIT;

-- ----------------------------
-- Table structure for legals
-- ----------------------------
DROP TABLE IF EXISTS "legals";
CREATE TABLE "legals" (
  "id" int4 NOT NULL,
  "title" varchar(255) COLLATE "pg_catalog"."default" NOT NULL,
  "value" varchar COLLATE "pg_catalog"."default"
)
;

-- ----------------------------
-- Records of legals
-- ----------------------------
BEGIN;
INSERT INTO "legals" ("id", "title", "value") VALUES (1, 'Impressum', NULL);
INSERT INTO "legals" ("id", "title", "value") VALUES (2, 'Datenschutz', NULL);
COMMIT;

-- ----------------------------
-- Table structure for logo
-- ----------------------------
DROP TABLE IF EXISTS "logo";
CREATE TABLE "logo" (
  "id" int4 NOT NULL,
  "image" bytea
)
;

-- ----------------------------
-- Records of logo
-- ----------------------------
BEGIN;
INSERT INTO "logo" ("id", "image") VALUES (1, NULL);
COMMIT;

-- ----------------------------
-- Table structure for mail_dispatch_settings
-- ----------------------------
DROP TABLE IF EXISTS "mail_dispatch_settings";
CREATE TABLE "mail_dispatch_settings" (
  "status" int2 NOT NULL
)
;

-- ----------------------------
-- Records of mail_dispatch_settings
-- ----------------------------
BEGIN;
INSERT INTO "mail_dispatch_settings" ("status") VALUES (1);
COMMIT;

-- ----------------------------
-- Table structure for mail_receiver
-- ----------------------------
DROP TABLE IF EXISTS "mail_receiver";
CREATE TABLE "mail_receiver" (
  "mail" varchar(255) COLLATE "pg_catalog"."default" NOT NULL
)
;

-- ----------------------------
-- Table structure for mail_templates
-- ----------------------------
DROP TABLE IF EXISTS "mail_templates";
CREATE TABLE "mail_templates" (
  "type" varchar(255) COLLATE "pg_catalog"."default" NOT NULL,
  "value" varchar COLLATE "pg_catalog"."default"
)
;

-- ----------------------------
-- Records of mail_templates
-- ----------------------------
BEGIN;
INSERT INTO "mail_templates" ("type", "value") VALUES ('subject', 'Protokoll der {{type}} vom {{date}} {{begin}}-{{end}}');
INSERT INTO "mail_templates" ("type", "value") VALUES ('body', 'Das Protokoll kann hier eingesehen werden: {{link}}.<br/><br/>Besprochene Themen: {{topics}}<br/><br/>Inhalt: {{content}}<br/><br/>Anwesende:<br/>{{attendees}}');
COMMIT;

-- ----------------------------
-- Table structure for protocol_attendances
-- ----------------------------
DROP TABLE IF EXISTS "protocol_attendances";
CREATE TABLE "protocol_attendances" (
  "id" int4 NOT NULL DEFAULT nextval('protocol_attendances_protocol_id_seq'::regclass),
  "protocol_id" int4 NOT NULL,
  "user_name" varchar(255) COLLATE "pg_catalog"."default" NOT NULL,
  "role_name" varchar(255) COLLATE "pg_catalog"."default" NOT NULL
)
;

-- ----------------------------
-- Records of protocol_attendances
-- ----------------------------
BEGIN;
COMMIT;

-- ----------------------------
-- Table structure for protocol_topics
-- ----------------------------
DROP TABLE IF EXISTS "protocol_topics";
CREATE TABLE "protocol_topics" (
  "protocol_id" int4 NOT NULL,
  "topic_name" varchar COLLATE "pg_catalog"."default" NOT NULL
)
;

-- ----------------------------
-- Records of protocol_topics
-- ----------------------------
BEGIN;
COMMIT;

-- ----------------------------
-- Table structure for protocol_types
-- ----------------------------
DROP TABLE IF EXISTS "protocol_types";
CREATE TABLE "protocol_types" (
  "title" varchar(255) COLLATE "pg_catalog"."default" NOT NULL,
  "template" varchar COLLATE "pg_catalog"."default"
)
;

-- ----------------------------
-- Records of protocol_types
-- ----------------------------
BEGIN;
INSERT INTO "protocol_types" ("title", "template") VALUES ('Konstituierende Sitzung', 'Eröffnung durch 

Protokoll geschrieben von 

# Top 0 Genehmigung des Protokolls der letzten Sitzung

# Top 1 Termine

# Top 2 Gäste

# Top 3 Post und E-Mails
- Post

- E-Mails

# Top 4 Mitteilungen

# Top 5 Rückblick

# Top 6 Gremien und Ausschüsse

# Top 7 Aufgaben
- Offen

- Erledigt

# Top 8 Finanzen

# Top 9 Sonstige Themen

');
INSERT INTO "protocol_types" ("title", "template") VALUES ('Fachschaftssitzung', 'Eröffnung durch 

Protokoll geschrieben von 

# Top 0 Genehmigung des Protokolls der letzten Sitzung

# Top 1 Termine

# Top 2 Gäste

# Top 3 Post und E-Mails
- Post

- E-Mails

# Top 4 Mitteilungen

# Top 5 Rückblick

# Top 6 Gremien und Ausschüsse

# Top 7 Aufgaben
- Offen

- Erledigt

# Top 8 Finanzen

# Top 9 Sonstige Themen

');
COMMIT;

-- ----------------------------
-- Table structure for protocols
-- ----------------------------
DROP TABLE IF EXISTS "protocols";
CREATE TABLE "protocols" (
  "id" int4 NOT NULL DEFAULT nextval('protocols_id_seq'::regclass),
  "protocol_type" varchar COLLATE "pg_catalog"."default",
  "start_timestamp" int4 NOT NULL,
  "end_timestamp" int4,
  "content" varchar COLLATE "pg_catalog"."default"
)
;

-- ----------------------------
-- Records of protocols
-- ----------------------------
BEGIN;
COMMIT;

-- ----------------------------
-- Table structure for roles
-- ----------------------------
DROP TABLE IF EXISTS "roles";
CREATE TABLE "roles" (
  "id" int4 NOT NULL,
  "title" varchar(255) COLLATE "pg_catalog"."default" NOT NULL
)
;

-- ----------------------------
-- Records of roles
-- ----------------------------
BEGIN;
INSERT INTO "roles" ("id", "title") VALUES (1, 'Administrator');
INSERT INTO "roles" ("id", "title") VALUES (2, 'Recorder');
COMMIT;

-- ----------------------------
-- Table structure for session
-- ----------------------------
DROP TABLE IF EXISTS "session";
CREATE TABLE "session" (
  "status" int2 NOT NULL
)
;

-- ----------------------------
-- Records of session
-- ----------------------------
BEGIN;
INSERT INTO "session" ("status") VALUES (0);
COMMIT;

-- ----------------------------
-- Table structure for session_attendees
-- ----------------------------
DROP TABLE IF EXISTS "session_attendees";
CREATE TABLE "session_attendees" (
  "attendee" varchar(255) COLLATE "pg_catalog"."default" NOT NULL
)
;

-- ----------------------------
-- Records of session_attendees
-- ----------------------------
BEGIN;
COMMIT;

-- ----------------------------
-- Table structure for socials
-- ----------------------------
DROP TABLE IF EXISTS "socials";
CREATE TABLE "socials" (
  "id" int4 NOT NULL,
  "title" varchar(255) COLLATE "pg_catalog"."default" NOT NULL,
  "value" varchar(255) COLLATE "pg_catalog"."default"
)
;

-- ----------------------------
-- Records of socials
-- ----------------------------
BEGIN;
INSERT INTO "socials" ("id", "title", "value") VALUES (1, 'webname', 'FS MNI');
INSERT INTO "socials" ("id", "title", "value") VALUES (2, 'facebook', NULL);
INSERT INTO "socials" ("id", "title", "value") VALUES (3, 'instagram', 'https://www.instagram.com/fachschaftmni/');
INSERT INTO "socials" ("id", "title", "value") VALUES (4, 'twitter', NULL);
INSERT INTO "socials" ("id", "title", "value") VALUES (5, 'git', NULL);
INSERT INTO "socials" ("id", "title", "value") VALUES (6, 'meeting-room', NULL);
COMMIT;

-- ----------------------------
-- Table structure for user_roles
-- ----------------------------
DROP TABLE IF EXISTS "user_roles";
CREATE TABLE "user_roles" (
  "user_id" varchar(50) COLLATE "pg_catalog"."default" NOT NULL,
  "role_id" int4 NOT NULL
)
;

-- ----------------------------
-- Records of user_roles
-- ----------------------------
BEGIN;
COMMIT;

-- ----------------------------
-- Table structure for users
-- ----------------------------
DROP TABLE IF EXISTS "users";
CREATE TABLE "users" (
  "id" varchar(50) COLLATE "pg_catalog"."default" NOT NULL,
  "first_name" varchar(255) COLLATE "pg_catalog"."default",
  "last_name" varchar(255) COLLATE "pg_catalog"."default",
  "display_name" varchar(255) COLLATE "pg_catalog"."default",
  "mail" varchar(255) COLLATE "pg_catalog"."default"
)
;

-- ----------------------------
-- Records of users
-- ----------------------------
BEGIN;
COMMIT;

-- ----------------------------
-- Primary Key structure for table legals
-- ----------------------------
ALTER TABLE "legals" ADD CONSTRAINT "legals_pkey" PRIMARY KEY ("id");

-- ----------------------------
-- Primary Key structure for table mail_dispatch_settings
-- ----------------------------
ALTER TABLE "mail_dispatch_settings" ADD CONSTRAINT "mail_dispatch_settings_pkey" PRIMARY KEY ("status");

-- ----------------------------
-- Primary Key structure for table mail_receiver
-- ----------------------------
ALTER TABLE "mail_receiver" ADD CONSTRAINT "mail_receiver_pkey" PRIMARY KEY ("mail");

-- ----------------------------
-- Primary Key structure for table mail_templates
-- ----------------------------
ALTER TABLE "mail_templates" ADD CONSTRAINT "mail_templates_pkey" PRIMARY KEY ("type");

-- ----------------------------
-- Primary Key structure for table protocol_attendances
-- ----------------------------
ALTER TABLE "protocol_attendances" ADD CONSTRAINT "protocol_attendances_pkey" PRIMARY KEY ("id");

-- ----------------------------
-- Primary Key structure for table protocol_topics
-- ----------------------------
ALTER TABLE "protocol_topics" ADD CONSTRAINT "protocol_topics_pkey" PRIMARY KEY ("protocol_id", "topic_name");

-- ----------------------------
-- Primary Key structure for table protocol_types
-- ----------------------------
ALTER TABLE "protocol_types" ADD CONSTRAINT "protocol_types_pkey" PRIMARY KEY ("title");

-- ----------------------------
-- Primary Key structure for table protocols
-- ----------------------------
ALTER TABLE "protocols" ADD CONSTRAINT "protocols_pkey" PRIMARY KEY ("id");

-- ----------------------------
-- Primary Key structure for table roles
-- ----------------------------
ALTER TABLE "roles" ADD CONSTRAINT "roles_pkey" PRIMARY KEY ("id");

-- ----------------------------
-- Primary Key structure for table session
-- ----------------------------
ALTER TABLE "session" ADD CONSTRAINT "session_pkey" PRIMARY KEY ("status");

-- ----------------------------
-- Primary Key structure for table user_roles
-- ----------------------------
ALTER TABLE "user_roles" ADD CONSTRAINT "user_roles_pkey" PRIMARY KEY ("user_id", "role_id");

-- ----------------------------
-- Primary Key structure for table users
-- ----------------------------
ALTER TABLE "users" ADD CONSTRAINT "users_pkey" PRIMARY KEY ("id");

-- ----------------------------
-- Foreign Keys structure for table protocol_attendances
-- ----------------------------
ALTER TABLE "protocol_attendances" ADD CONSTRAINT "fk_protocol_id" FOREIGN KEY ("protocol_id") REFERENCES "protocols" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- ----------------------------
-- Foreign Keys structure for table protocol_topics
-- ----------------------------
ALTER TABLE "protocol_topics" ADD CONSTRAINT "fk_protocol_id" FOREIGN KEY ("protocol_id") REFERENCES "protocols" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- ----------------------------
-- Foreign Keys structure for table user_roles
-- ----------------------------
ALTER TABLE "user_roles" ADD CONSTRAINT "fk_role_id" FOREIGN KEY ("role_id") REFERENCES "roles" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
ALTER TABLE "user_roles" ADD CONSTRAINT "fk_user_id" FOREIGN KEY ("user_id") REFERENCES "users" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION;