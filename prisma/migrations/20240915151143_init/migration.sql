-- CreateTable
CREATE TABLE "Transaction" (
    "id" SERIAL NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "notes" TEXT,
    "code" TEXT NOT NULL,
    "bank" TEXT,

    CONSTRAINT "Transaction_pkey" PRIMARY KEY ("id")
);
