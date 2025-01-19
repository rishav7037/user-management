import { MigrationInterface, QueryRunner } from 'typeorm';

export class InitialTableCreation1737223671113 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
    CREATE TYPE "users_role_enum" AS ENUM ('admin', 'editor', 'viewer');
  `);
    await queryRunner.query(`
      CREATE TABLE "users" (
        "id" SERIAL NOT NULL,
        "username" VARCHAR NOT NULL UNIQUE,
        "password" VARCHAR NOT NULL,
        "role" "public"."users_role_enum" NOT NULL DEFAULT 'viewer',
        CONSTRAINT "PK_users" PRIMARY KEY ("id")
      );
    `);

    await queryRunner.query(`
      CREATE TABLE "blacklisted_tokens" (
        "id" SERIAL NOT NULL,
        "token" TEXT NOT NULL,
        "blacklistedAt" TIMESTAMP NOT NULL DEFAULT now(),
        "expiry" TIMESTAMP NOT NULL,
        CONSTRAINT "PK_blacklisted_tokens" PRIMARY KEY ("id")
      );
    `);

    await queryRunner.query(`
      CREATE TABLE "documents" (
        "id" SERIAL NOT NULL,
        "title" VARCHAR NOT NULL,
        "content" TEXT NOT NULL,
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "PK_documents" PRIMARY KEY ("id")
      );
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "documents";`);
    await queryRunner.query(`DROP TABLE "blacklisted_tokens";`);
    await queryRunner.query(`DROP TABLE "users";`);
  }
}
