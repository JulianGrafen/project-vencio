-- Smart-Fill email invites: one-click confirm token (replaces SMS reply flow)

ALTER TABLE "SmartFillInvite" ADD COLUMN "confirmToken" TEXT;

CREATE UNIQUE INDEX "SmartFillInvite_confirmToken_key" ON "SmartFillInvite"("confirmToken");
