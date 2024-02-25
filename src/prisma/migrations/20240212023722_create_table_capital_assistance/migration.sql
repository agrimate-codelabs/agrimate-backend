-- CreateTable
CREATE TABLE "capital_assistance" (
    "id" TEXT NOT NULL,
    "farmerId" TEXT NOT NULL,
    "submission_title" TEXT NOT NULL,
    "total_land_area" DOUBLE PRECISION NOT NULL,
    "phone" TEXT NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "bank_name" TEXT NOT NULL,
    "account_number" TEXT NOT NULL,
    "account_name" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "capital_assistance_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "capital_assistance" ADD CONSTRAINT "capital_assistance_farmerId_fkey" FOREIGN KEY ("farmerId") REFERENCES "farmers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
