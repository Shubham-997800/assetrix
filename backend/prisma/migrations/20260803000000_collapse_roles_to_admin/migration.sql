-- Collapse all roles to a single ADMIN role.
-- Any existing non-ADMIN users are elevated to ADMIN.

-- Update existing rows first
UPDATE "User" SET "role" = 'ADMIN' WHERE "role" <> 'ADMIN';

-- Recreate the enum with only ADMIN
ALTER TYPE "UserRole" RENAME TO "UserRole_old";

CREATE TYPE "UserRole" AS ENUM ('ADMIN');

ALTER TABLE "User" ALTER COLUMN "role" DROP DEFAULT;
ALTER TABLE "User" ALTER COLUMN "role" TYPE "UserRole" USING ("role"::text)::"UserRole";
ALTER TABLE "User" ALTER COLUMN "role" SET DEFAULT 'ADMIN';

DROP TYPE "UserRole_old";
