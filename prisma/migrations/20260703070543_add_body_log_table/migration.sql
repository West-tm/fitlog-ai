-- CreateTable
CREATE TABLE "BodyLog" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "googleHealthConnectionId" TEXT,
    "measuredOn" DATE NOT NULL,
    "weightGramsAvg" DOUBLE PRECISION,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BodyLog_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "BodyLog_userId_measuredOn_key" ON "BodyLog"("userId", "measuredOn");

-- AddForeignKey
ALTER TABLE "BodyLog" ADD CONSTRAINT "BodyLog_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BodyLog" ADD CONSTRAINT "BodyLog_googleHealthConnectionId_fkey" FOREIGN KEY ("googleHealthConnectionId") REFERENCES "GoogleHealthConnection"("id") ON DELETE SET NULL ON UPDATE CASCADE;
