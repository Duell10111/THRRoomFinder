-- CreateExtension
CREATE EXTENSION IF NOT EXISTS "postgis" WITH VERSION "3.4.3";

-- CreateTable
CREATE TABLE "room" (
                        "id" UUID NOT NULL DEFAULT gen_random_uuid(),
                        "name" TEXT NOT NULL,
                        "uuid" TEXT NOT NULL,
                        "location" point NOT NULL,
                        "building_id" TEXT NOT NULL,

                        CONSTRAINT "room_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "building" (
                            "id" UUID NOT NULL DEFAULT gen_random_uuid(),
                            "name" TEXT NOT NULL,

                            CONSTRAINT "building_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "error_reports" (
                                 "id" UUID NOT NULL DEFAULT gen_random_uuid(),
                                 "description" TEXT NOT NULL,
                                 "room_id" UUID,

                                 CONSTRAINT "error_reports_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "room_name_key" ON "room"("name");

-- CreateIndex
CREATE UNIQUE INDEX "room_uuid_key" ON "room"("uuid");

-- CreateIndex
CREATE UNIQUE INDEX "building_name_key" ON "building"("name");

-- AddForeignKey
ALTER TABLE "room" ADD CONSTRAINT "room_building_id_fkey" FOREIGN KEY ("building_id") REFERENCES "building"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "error_reports" ADD CONSTRAINT "error_reports_room_id_fkey" FOREIGN KEY ("room_id") REFERENCES "room"("id") ON DELETE SET NULL ON UPDATE CASCADE;
