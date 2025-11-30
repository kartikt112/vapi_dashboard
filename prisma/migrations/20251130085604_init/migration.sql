-- CreateTable
CREATE TABLE "Call" (
    "id" TEXT NOT NULL,
    "orgId" TEXT NOT NULL,
    "phoneNumberId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "endedReason" TEXT,
    "transcript" TEXT,
    "recordingUrl" TEXT,
    "stereoRecordingUrl" TEXT,
    "summary" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "startedAt" TIMESTAMP(3),
    "endedAt" TIMESTAMP(3),
    "cost" DOUBLE PRECISION,
    "duration" DOUBLE PRECISION,
    "customerNumber" TEXT,
    "customerName" TEXT,
    "metadata" TEXT,
    "analysis" TEXT,
    "costBreakdown" TEXT,

    CONSTRAINT "Call_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Call_createdAt_idx" ON "Call"("createdAt");

-- CreateIndex
CREATE INDEX "Call_status_idx" ON "Call"("status");
