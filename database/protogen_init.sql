-- ----------------------------
-- Postgres Database
-- ----------------------------
\c "protogen"

CREATE SEQUENCE "protocol_templates_protocol_id_seq";
CREATE SEQUENCE "protocol_types_id_seq";
CREATE SEQUENCE "protocols_id_seq";
CREATE SEQUENCE "protocol_roles_id_seq";

-- ----------------------------
-- Table structure for protocol_attendances
-- ----------------------------
DROP TABLE IF EXISTS "protocol_attendances";
CREATE TABLE "protocol_attendances" (
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
-- Table structure for protocol_roles
-- ----------------------------
DROP TABLE IF EXISTS "protocol_roles";
CREATE TABLE "protocol_roles" (
  "id" int4 NOT NULL DEFAULT nextval('protocol_roles_id_seq'::regclass),
  "role_name" varchar(255) COLLATE "pg_catalog"."default" NOT NULL,
  "description" varchar COLLATE "pg_catalog"."default"
)
;

-- ----------------------------
-- Records of protocol_roles
-- ----------------------------
BEGIN;
COMMIT;

-- ----------------------------
-- Table structure for protocol_templates
-- ----------------------------
DROP TABLE IF EXISTS "protocol_templates";
CREATE TABLE "protocol_templates" (
  "protocol_id" int4 NOT NULL DEFAULT nextval('protocol_templates_protocol_id_seq'::regclass),
  "template" varchar COLLATE "pg_catalog"."default"
)
;

-- ----------------------------
-- Records of protocol_templates
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
  "id" int4 NOT NULL DEFAULT nextval('protocol_types_id_seq'::regclass),
  "title" varchar COLLATE "pg_catalog"."default" NOT NULL
)
;

-- ----------------------------
-- Records of protocol_types
-- ----------------------------
BEGIN;
COMMIT;

-- ----------------------------
-- Table structure for protocols
-- ----------------------------
DROP TABLE IF EXISTS "protocols";
CREATE TABLE "protocols" (
  "id" int4 NOT NULL DEFAULT nextval('protocols_id_seq'::regclass),
  "protocol_type_id" int4 NOT NULL,
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
-- Primary Key structure for table protocol_attendances
-- ----------------------------
ALTER TABLE "protocol_attendances" ADD CONSTRAINT "protocol_attendances_pkey" PRIMARY KEY ("protocol_id", "user_name", "role_name");

-- ----------------------------
-- Primary Key structure for table protocol_roles
-- ----------------------------
ALTER TABLE "protocol_roles" ADD CONSTRAINT "protocol_roles_pkey" PRIMARY KEY ("id");

-- ----------------------------
-- Primary Key structure for table protocol_templates
-- ----------------------------
ALTER TABLE "protocol_templates" ADD CONSTRAINT "protocol_templates_pkey" PRIMARY KEY ("protocol_id");

-- ----------------------------
-- Primary Key structure for table protocol_topics
-- ----------------------------
ALTER TABLE "protocol_topics" ADD CONSTRAINT "protocol_topics_pkey" PRIMARY KEY ("protocol_id", "topic_name");

-- ----------------------------
-- Primary Key structure for table protocol_types
-- ----------------------------
ALTER TABLE "protocol_types" ADD CONSTRAINT "protocol_types_pkey" PRIMARY KEY ("id");

-- ----------------------------
-- Primary Key structure for table protocols
-- ----------------------------
ALTER TABLE "protocols" ADD CONSTRAINT "protocols_pkey" PRIMARY KEY ("id");

-- ----------------------------
-- Foreign Keys structure for table protocol_attendances
-- ----------------------------
ALTER TABLE "protocol_attendances" ADD CONSTRAINT "fk_protocol_id" FOREIGN KEY ("protocol_id") REFERENCES "protocols" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- ----------------------------
-- Foreign Keys structure for table protocol_templates
-- ----------------------------
ALTER TABLE "protocol_templates" ADD CONSTRAINT "fk_protocol_id" FOREIGN KEY ("protocol_id") REFERENCES "protocols" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- ----------------------------
-- Foreign Keys structure for table protocol_topics
-- ----------------------------
ALTER TABLE "protocol_topics" ADD CONSTRAINT "fk_protocol_id" FOREIGN KEY ("protocol_id") REFERENCES "protocols" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- ----------------------------
-- Foreign Keys structure for table protocols
-- ----------------------------
ALTER TABLE "protocols" ADD CONSTRAINT "fk_protocol_type_id" FOREIGN KEY ("protocol_type_id") REFERENCES "protocol_types" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION;