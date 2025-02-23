import { MigrationInterface, QueryRunner } from 'typeorm';

export class Schemas1740310588372 implements MigrationInterface {
  name = 'Schemas1740310588372';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "public"."users_role_enum" AS ENUM('admin', 'investor')`,
    );
    await queryRunner.query(
      `CREATE TABLE "users" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone, "updated_at" TIMESTAMP NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone, "deleted_at" TIMESTAMP DEFAULT NULL, "firstname" character varying NOT NULL, "lastname" character varying NOT NULL, "email" character varying NOT NULL, "password_hash" character varying NOT NULL, "role" "public"."users_role_enum" NOT NULL, CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."investors_role_enum" AS ENUM('admin', 'investor')`,
    );
    await queryRunner.query(
      `CREATE TABLE "investors" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone, "updated_at" TIMESTAMP NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone, "deleted_at" TIMESTAMP DEFAULT NULL, "firstname" character varying NOT NULL, "lastname" character varying NOT NULL, "email" character varying NOT NULL, "password_hash" character varying NOT NULL, "role" "public"."investors_role_enum" NOT NULL, CONSTRAINT "UQ_869251e348bc79fc96d8707ce5d" UNIQUE ("email"), CONSTRAINT "PK_7ab129212e4ce89e68d6a27ea4e" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "investments" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone, "updated_at" TIMESTAMP NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone, "deleted_at" TIMESTAMP DEFAULT NULL, "shares" integer NOT NULL, "amount" numeric NOT NULL, "estimated_monthly_return" numeric NOT NULL, "investorId" uuid, "projectId" uuid, CONSTRAINT "PK_a1263853f1a4fb8b849c1c9aff4" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."investment_projects_status_enum" AS ENUM('draft', 'published', 'closed')`,
    );
    await queryRunner.query(
      `CREATE TABLE "investment_projects" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone, "updated_at" TIMESTAMP NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone, "deleted_at" TIMESTAMP DEFAULT NULL, "name" character varying NOT NULL, "total_amount" numeric NOT NULL, "available_shares" integer NOT NULL, "share_price" numeric NOT NULL, "expected_return" numeric NOT NULL, "duration" integer NOT NULL, "status" "public"."investment_projects_status_enum" NOT NULL DEFAULT 'draft', CONSTRAINT "PK_bd982c86dab206df74552f513cb" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."payments_status_enum" AS ENUM('pending', 'completed', 'failed')`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."payments_type_enum" AS ENUM('investment', 'return')`,
    );
    await queryRunner.query(
      `CREATE TABLE "payments" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone, "updated_at" TIMESTAMP NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone, "deleted_at" TIMESTAMP DEFAULT NULL, "amount" numeric NOT NULL, "status" "public"."payments_status_enum" NOT NULL DEFAULT 'pending', "transaction_id" text, "type" "public"."payments_type_enum" NOT NULL DEFAULT 'investment', "project_id" uuid, "investor_id" uuid, CONSTRAINT "PK_197ab7af18c93fbb0c9b28b4a59" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "investments" ADD CONSTRAINT "FK_93332d5e49cd494527409e0be3d" FOREIGN KEY ("investorId") REFERENCES "investors"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "investments" ADD CONSTRAINT "FK_281e9a76a495935d6a404eea626" FOREIGN KEY ("projectId") REFERENCES "investment_projects"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "payments" ADD CONSTRAINT "FK_7679cab4a6968de68c2a1a8faf2" FOREIGN KEY ("project_id") REFERENCES "investment_projects"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "payments" ADD CONSTRAINT "FK_86dcfee36b1e5b52824601f4f7a" FOREIGN KEY ("investor_id") REFERENCES "investors"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "payments" DROP CONSTRAINT "FK_86dcfee36b1e5b52824601f4f7a"`,
    );
    await queryRunner.query(
      `ALTER TABLE "payments" DROP CONSTRAINT "FK_7679cab4a6968de68c2a1a8faf2"`,
    );
    await queryRunner.query(
      `ALTER TABLE "investments" DROP CONSTRAINT "FK_281e9a76a495935d6a404eea626"`,
    );
    await queryRunner.query(
      `ALTER TABLE "investments" DROP CONSTRAINT "FK_93332d5e49cd494527409e0be3d"`,
    );
    await queryRunner.query(`DROP TABLE "payments"`);
    await queryRunner.query(`DROP TYPE "public"."payments_type_enum"`);
    await queryRunner.query(`DROP TYPE "public"."payments_status_enum"`);
    await queryRunner.query(`DROP TABLE "investment_projects"`);
    await queryRunner.query(
      `DROP TYPE "public"."investment_projects_status_enum"`,
    );
    await queryRunner.query(`DROP TABLE "investments"`);
    await queryRunner.query(`DROP TABLE "investors"`);
    await queryRunner.query(`DROP TYPE "public"."investors_role_enum"`);
    await queryRunner.query(`DROP TABLE "users"`);
    await queryRunner.query(`DROP TYPE "public"."users_role_enum"`);
  }
}
