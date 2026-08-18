-- AlterTable
ALTER TABLE "BodyLog" ADD COLUMN     "bodyFatPercentageAvg" DOUBLE PRECISION;

-- CreateTable
CREATE TABLE "ActivityLog" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "googleHealthConnectionId" TEXT,
    "measuredOn" DATE NOT NULL,
    "stepsCountSum" INTEGER,
    "totalCaloriesKcalSum" DOUBLE PRECISION,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ActivityLog_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ActivityLog_userId_measuredOn_key" ON "ActivityLog"("userId", "measuredOn");

-- AddForeignKey
ALTER TABLE "ActivityLog" ADD CONSTRAINT "ActivityLog_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ActivityLog" ADD CONSTRAINT "ActivityLog_googleHealthConnectionId_fkey" FOREIGN KEY ("googleHealthConnectionId") REFERENCES "GoogleHealthConnection"("id") ON DELETE SET NULL ON UPDATE CASCADE;
