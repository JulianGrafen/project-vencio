-- PraxisTermin: complete Supabase setup (run once in SQL Editor)
-- Supabase → SQL Editor → New query → paste → Run

-- Supabase bootstrap: run once before Prisma migrations (idempotent).
-- Requires DATABASE_DIRECT_URL (port 5432, not transaction pooler).

CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Prisma migrations use gen_random_uuid() throughout the history.
-- pgcrypto is pre-enabled on most Supabase projects; this is a safety net.

-- Generated from schema.prisma — do not edit manually
-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "public";

-- CreateEnum
CREATE TYPE "public"."SchedulingType" AS ENUM ('roundRobin', 'collective', 'managed');

-- CreateEnum
CREATE TYPE "public"."PeriodType" AS ENUM ('unlimited', 'rolling', 'rolling_window', 'range');

-- CreateEnum
CREATE TYPE "public"."CreationSource" AS ENUM ('api_v1', 'api_v2', 'webapp');

-- CreateEnum
CREATE TYPE "public"."CancellationReasonRequirement" AS ENUM ('MANDATORY_BOTH', 'MANDATORY_HOST_ONLY', 'MANDATORY_ATTENDEE_ONLY', 'OPTIONAL_BOTH');

-- CreateEnum
CREATE TYPE "public"."IdentityProvider" AS ENUM ('CAL', 'GOOGLE', 'SAML', 'AZUREAD');

-- CreateEnum
CREATE TYPE "public"."UserPermissionRole" AS ENUM ('USER', 'ADMIN');

-- CreateEnum
CREATE TYPE "public"."TreatmentResourceType" AS ENUM ('CHAIR', 'ROOM', 'XRAY');

-- CreateEnum
CREATE TYPE "public"."InsuranceType" AS ENUM ('GESETZLICH', 'PRIVAT', 'SELBSTZAHLER');

-- CreateEnum
CREATE TYPE "public"."MedicalCategory" AS ENUM ('PROPHYLAXE', 'SCHMERZBEHANDLUNG', 'KONTROLLE', 'FUELLUNG', 'IMPLANTOLOGIE', 'KIEFERORTHOPAEDIE', 'SONSTIGES');

-- CreateEnum
CREATE TYPE "public"."SmartFillTaskStatus" AS ENUM ('PENDING', 'INVITED', 'CONFIRMED', 'DECLINED', 'EXPIRED', 'FAILED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "public"."SmartFillInviteStatus" AS ENUM ('SENT', 'DELIVERED', 'REPLIED_YES', 'REPLIED_NO', 'EXPIRED', 'FAILED');

-- CreateEnum
CREATE TYPE "public"."RecallChannel" AS ENUM ('EMAIL', 'SMS');

-- CreateEnum
CREATE TYPE "public"."RecallHistoryStatus" AS ENUM ('PENDING', 'SENT', 'FAILED', 'SKIPPED');

-- CreateEnum
CREATE TYPE "public"."PvsSyncOutboxStatus" AS ENUM ('PENDING', 'PROCESSING', 'COMPLETED', 'FAILED');

-- CreateEnum
CREATE TYPE "public"."PvsSyncOperation" AS ENUM ('CREATE_APPOINTMENT', 'UPDATE_APPOINTMENT', 'CANCEL_APPOINTMENT');

-- CreateEnum
CREATE TYPE "public"."CreditUsageType" AS ENUM ('SMS', 'CAL_AI_PHONE_CALL');

-- CreateEnum
CREATE TYPE "public"."CreditType" AS ENUM ('MONTHLY', 'ADDITIONAL');

-- CreateEnum
CREATE TYPE "public"."MembershipRole" AS ENUM ('MEMBER', 'ADMIN', 'OWNER');

-- CreateEnum
CREATE TYPE "public"."BookingStatus" AS ENUM ('cancelled', 'accepted', 'rejected', 'pending', 'awaiting_host');

-- CreateEnum
CREATE TYPE "public"."EventTypeCustomInputType" AS ENUM ('text', 'textLong', 'number', 'bool', 'radio', 'phone');

-- CreateEnum
CREATE TYPE "public"."ReminderType" AS ENUM ('PENDING_BOOKING_CONFIRMATION');

-- CreateEnum
CREATE TYPE "public"."PaymentOption" AS ENUM ('ON_BOOKING', 'HOLD');

-- CreateEnum
CREATE TYPE "public"."WebhookTriggerEvents" AS ENUM ('BOOKING_CREATED', 'BOOKING_PAYMENT_INITIATED', 'BOOKING_PAID', 'BOOKING_RESCHEDULED', 'BOOKING_REQUESTED', 'BOOKING_CANCELLED', 'BOOKING_REJECTED', 'BOOKING_NO_SHOW_UPDATED', 'FORM_SUBMITTED', 'MEETING_ENDED', 'MEETING_STARTED', 'RECORDING_READY', 'RECORDING_TRANSCRIPTION_GENERATED', 'OOO_CREATED', 'AFTER_HOSTS_CAL_VIDEO_NO_SHOW', 'AFTER_GUESTS_CAL_VIDEO_NO_SHOW', 'FORM_SUBMITTED_NO_EVENT', 'DELEGATION_CREDENTIAL_ERROR', 'WRONG_ASSIGNMENT_REPORT');

-- CreateEnum
CREATE TYPE "public"."AppCategories" AS ENUM ('calendar', 'messaging', 'other', 'payment', 'video', 'web3', 'automation', 'analytics', 'conferencing', 'crm');

-- CreateEnum
CREATE TYPE "public"."TimeUnit" AS ENUM ('day', 'hour', 'minute');

-- CreateEnum
CREATE TYPE "public"."FeatureType" AS ENUM ('RELEASE', 'EXPERIMENT', 'OPERATIONAL', 'KILL_SWITCH', 'PERMISSION');

-- CreateEnum
CREATE TYPE "public"."RRResetInterval" AS ENUM ('MONTH', 'DAY');

-- CreateEnum
CREATE TYPE "public"."RRTimestampBasis" AS ENUM ('CREATED_AT', 'START_TIME');

-- CreateEnum
CREATE TYPE "public"."OAuthClientType" AS ENUM ('confidential', 'public');

-- CreateEnum
CREATE TYPE "public"."OAuthClientStatus" AS ENUM ('pending', 'approved', 'rejected');

-- CreateEnum
CREATE TYPE "public"."AccessScope" AS ENUM ('READ_BOOKING', 'READ_PROFILE');

-- CreateEnum
CREATE TYPE "public"."RedirectType" AS ENUM ('user-event-type', 'team-event-type', 'user', 'team');

-- CreateEnum
CREATE TYPE "public"."SMSLockState" AS ENUM ('LOCKED', 'UNLOCKED', 'REVIEW_NEEDED');

-- CreateEnum
CREATE TYPE "public"."AttributeType" AS ENUM ('TEXT', 'NUMBER', 'SINGLE_SELECT', 'MULTI_SELECT');

-- CreateEnum
CREATE TYPE "public"."AssignmentReasonEnum" AS ENUM ('REASSIGNED', 'RR_REASSIGNED', 'REROUTED', 'SALESFORCE_ASSIGNMENT');

-- CreateEnum
CREATE TYPE "public"."EventTypeAutoTranslatedField" AS ENUM ('DESCRIPTION', 'TITLE');

-- CreateEnum
CREATE TYPE "public"."WatchlistType" AS ENUM ('EMAIL', 'DOMAIN', 'USERNAME');

-- CreateEnum
CREATE TYPE "public"."WatchlistAction" AS ENUM ('REPORT', 'BLOCK', 'ALERT');

-- CreateEnum
CREATE TYPE "public"."WatchlistSource" AS ENUM ('MANUAL', 'FREE_DOMAIN_POLICY', 'SIGNUP');

-- CreateEnum
CREATE TYPE "public"."BookingReportReason" AS ENUM ('SPAM', 'dont_know_person', 'OTHER');

-- CreateEnum
CREATE TYPE "public"."BookingReportStatus" AS ENUM ('PENDING', 'DISMISSED', 'BLOCKED');

-- CreateEnum
CREATE TYPE "public"."SystemReportStatus" AS ENUM ('PENDING', 'BLOCKED', 'DISMISSED');

-- CreateEnum
CREATE TYPE "public"."WrongAssignmentReportStatus" AS ENUM ('PENDING', 'REVIEWED', 'RESOLVED', 'DISMISSED');

-- CreateEnum
CREATE TYPE "public"."BillingPeriod" AS ENUM ('MONTHLY', 'ANNUALLY');

-- CreateEnum
CREATE TYPE "public"."BillingMode" AS ENUM ('SEATS', 'ACTIVE_USERS');

-- CreateEnum
CREATE TYPE "public"."FilterSegmentScope" AS ENUM ('USER', 'TEAM');

-- CreateEnum
CREATE TYPE "public"."RoleType" AS ENUM ('SYSTEM', 'CUSTOM');

-- CreateEnum
CREATE TYPE "public"."BookingAuditType" AS ENUM ('record_created', 'record_updated', 'record_deleted');

-- CreateEnum
CREATE TYPE "public"."BookingAuditAction" AS ENUM ('created', 'cancelled', 'accepted', 'rejected', 'pending', 'awaiting_host', 'rescheduled', 'attendee_added', 'attendee_removed', 'reassignment', 'location_changed', 'no_show_updated', 'reschedule_requested', 'seat_booked', 'seat_rescheduled');

-- CreateEnum
CREATE TYPE "public"."BookingAuditSource" AS ENUM ('api_v1', 'api_v2', 'webapp', 'webhook', 'system', 'magic_link', 'unknown');

-- CreateEnum
CREATE TYPE "public"."AuditActorType" AS ENUM ('user', 'guest', 'attendee', 'system', 'app');

-- CreateEnum
CREATE TYPE "public"."PhoneNumberSubscriptionStatus" AS ENUM ('ACTIVE', 'PAST_DUE', 'CANCELLED', 'INCOMPLETE', 'INCOMPLETE_EXPIRED', 'TRIALING', 'UNPAID');

-- CreateEnum
CREATE TYPE "public"."SeatChangeType" AS ENUM ('ADDITION', 'REMOVAL');

-- CreateEnum
CREATE TYPE "public"."ProrationStatus" AS ENUM ('PENDING', 'INVOICE_CREATED', 'CHARGED', 'FAILED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "public"."CalendarCacheEventStatus" AS ENUM ('confirmed', 'tentative', 'cancelled');

-- CreateTable
CREATE TABLE "public"."Host" (
    "userId" INTEGER NOT NULL,
    "eventTypeId" INTEGER NOT NULL,
    "isFixed" BOOLEAN NOT NULL DEFAULT false,
    "priority" INTEGER,
    "weight" INTEGER,
    "weightAdjustment" INTEGER,
    "scheduleId" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "groupId" TEXT,
    "memberId" INTEGER,

    CONSTRAINT "Host_pkey" PRIMARY KEY ("userId","eventTypeId")
);

-- CreateTable
CREATE TABLE "public"."HostGroup" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "eventTypeId" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "HostGroup_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."HostLocation" (
    "id" TEXT NOT NULL,
    "userId" INTEGER NOT NULL,
    "eventTypeId" INTEGER NOT NULL,
    "type" TEXT NOT NULL,
    "credentialId" INTEGER,
    "link" TEXT,
    "address" TEXT,
    "phoneNumber" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "HostLocation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."CalVideoSettings" (
    "eventTypeId" INTEGER NOT NULL,
    "disableRecordingForOrganizer" BOOLEAN NOT NULL DEFAULT false,
    "disableRecordingForGuests" BOOLEAN NOT NULL DEFAULT false,
    "enableAutomaticTranscription" BOOLEAN NOT NULL DEFAULT false,
    "enableAutomaticRecordingForOrganizer" BOOLEAN NOT NULL DEFAULT false,
    "redirectUrlOnExit" TEXT,
    "disableTranscriptionForGuests" BOOLEAN NOT NULL DEFAULT false,
    "disableTranscriptionForOrganizer" BOOLEAN NOT NULL DEFAULT false,
    "requireEmailForGuests" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CalVideoSettings_pkey" PRIMARY KEY ("eventTypeId")
);

-- CreateTable
CREATE TABLE "public"."VideoCallGuest" (
    "id" TEXT NOT NULL,
    "bookingUid" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "joinedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "VideoCallGuest_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."EventType" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT,
    "interfaceLanguage" TEXT,
    "position" INTEGER NOT NULL DEFAULT 0,
    "locations" JSONB,
    "length" INTEGER NOT NULL,
    "offsetStart" INTEGER NOT NULL DEFAULT 0,
    "hidden" BOOLEAN NOT NULL DEFAULT false,
    "userId" INTEGER,
    "profileId" INTEGER,
    "teamId" INTEGER,
    "useEventLevelSelectedCalendars" BOOLEAN NOT NULL DEFAULT false,
    "eventName" TEXT,
    "parentId" INTEGER,
    "bookingFields" JSONB,
    "timeZone" TEXT,
    "periodType" "public"."PeriodType" NOT NULL DEFAULT 'unlimited',
    "periodStartDate" TIMESTAMP(3),
    "periodEndDate" TIMESTAMP(3),
    "periodDays" INTEGER,
    "periodCountCalendarDays" BOOLEAN,
    "lockTimeZoneToggleOnBookingPage" BOOLEAN NOT NULL DEFAULT false,
    "lockedTimeZone" TEXT,
    "requiresConfirmation" BOOLEAN NOT NULL DEFAULT false,
    "requiresConfirmationWillBlockSlot" BOOLEAN NOT NULL DEFAULT false,
    "requiresConfirmationForFreeEmail" BOOLEAN NOT NULL DEFAULT false,
    "requiresBookerEmailVerification" BOOLEAN NOT NULL DEFAULT false,
    "canSendCalVideoTranscriptionEmails" BOOLEAN NOT NULL DEFAULT true,
    "autoTranslateDescriptionEnabled" BOOLEAN NOT NULL DEFAULT false,
    "autoTranslateInstantMeetingTitleEnabled" BOOLEAN NOT NULL DEFAULT true,
    "recurringEvent" JSONB,
    "disableGuests" BOOLEAN NOT NULL DEFAULT false,
    "hideCalendarNotes" BOOLEAN NOT NULL DEFAULT false,
    "hideCalendarEventDetails" BOOLEAN NOT NULL DEFAULT false,
    "minimumBookingNotice" INTEGER NOT NULL DEFAULT 120,
    "beforeEventBuffer" INTEGER NOT NULL DEFAULT 0,
    "afterEventBuffer" INTEGER NOT NULL DEFAULT 0,
    "seatsPerTimeSlot" INTEGER,
    "onlyShowFirstAvailableSlot" BOOLEAN NOT NULL DEFAULT false,
    "showOptimizedSlots" BOOLEAN DEFAULT false,
    "disableCancelling" BOOLEAN DEFAULT false,
    "disableRescheduling" BOOLEAN DEFAULT false,
    "minimumRescheduleNotice" INTEGER,
    "seatsShowAttendees" BOOLEAN DEFAULT false,
    "seatsShowAvailabilityCount" BOOLEAN DEFAULT true,
    "schedulingType" "public"."SchedulingType",
    "scheduleId" INTEGER,
    "allowReschedulingCancelledBookings" BOOLEAN DEFAULT false,
    "price" INTEGER NOT NULL DEFAULT 0,
    "currency" TEXT NOT NULL DEFAULT 'usd',
    "slotInterval" INTEGER,
    "metadata" JSONB,
    "successRedirectUrl" TEXT,
    "forwardParamsSuccessRedirect" BOOLEAN DEFAULT true,
    "bookingLimits" JSONB,
    "durationLimits" JSONB,
    "isInstantEvent" BOOLEAN NOT NULL DEFAULT false,
    "instantMeetingExpiryTimeOffsetInSeconds" INTEGER NOT NULL DEFAULT 90,
    "instantMeetingScheduleId" INTEGER,
    "instantMeetingParameters" TEXT[],
    "assignAllTeamMembers" BOOLEAN NOT NULL DEFAULT false,
    "assignRRMembersUsingSegment" BOOLEAN NOT NULL DEFAULT false,
    "rrSegmentQueryValue" JSONB,
    "useEventTypeDestinationCalendarEmail" BOOLEAN NOT NULL DEFAULT false,
    "isRRWeightsEnabled" BOOLEAN NOT NULL DEFAULT false,
    "maxLeadThreshold" INTEGER,
    "includeNoShowInRRCalculation" BOOLEAN NOT NULL DEFAULT false,
    "allowReschedulingPastBookings" BOOLEAN NOT NULL DEFAULT false,
    "hideOrganizerEmail" BOOLEAN NOT NULL DEFAULT false,
    "maxActiveBookingsPerBooker" INTEGER,
    "maxActiveBookingPerBookerOfferReschedule" BOOLEAN NOT NULL DEFAULT false,
    "customReplyToEmail" TEXT,
    "eventTypeColor" JSONB,
    "rescheduleWithSameRoundRobinHost" BOOLEAN NOT NULL DEFAULT false,
    "secondaryEmailId" INTEGER,
    "useBookerTimezone" BOOLEAN NOT NULL DEFAULT false,
    "restrictionScheduleId" INTEGER,
    "bookingRequiresAuthentication" BOOLEAN NOT NULL DEFAULT false,
    "rrHostSubsetEnabled" BOOLEAN NOT NULL DEFAULT false,
    "requiresCancellationReason" "public"."CancellationReasonRequirement" DEFAULT 'MANDATORY_HOST_ONLY',
    "enablePerHostLocations" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),

    CONSTRAINT "EventType_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Credential" (
    "id" SERIAL NOT NULL,
    "type" TEXT NOT NULL,
    "key" JSONB NOT NULL,
    "encryptedKey" TEXT,
    "userId" INTEGER,
    "teamId" INTEGER,
    "appId" TEXT,
    "subscriptionId" TEXT,
    "paymentStatus" TEXT,
    "billingCycleStart" INTEGER,
    "invalid" BOOLEAN DEFAULT false,
    "delegationCredentialId" TEXT,

    CONSTRAINT "Credential_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."DestinationCalendar" (
    "id" SERIAL NOT NULL,
    "integration" TEXT NOT NULL,
    "externalId" TEXT NOT NULL,
    "primaryEmail" TEXT,
    "userId" INTEGER,
    "eventTypeId" INTEGER,
    "credentialId" INTEGER,
    "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),
    "delegationCredentialId" TEXT,
    "customCalendarReminder" INTEGER,

    CONSTRAINT "DestinationCalendar_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."UserPassword" (
    "hash" TEXT NOT NULL,
    "userId" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "public"."TravelSchedule" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "timeZone" TEXT NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3),
    "prevTimeZone" TEXT,

    CONSTRAINT "TravelSchedule_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."users" (
    "id" SERIAL NOT NULL,
    "uuid" UUID NOT NULL,
    "username" TEXT,
    "name" TEXT,
    "email" TEXT NOT NULL,
    "emailVerified" TIMESTAMP(3),
    "bio" TEXT,
    "avatarUrl" TEXT,
    "timeZone" TEXT NOT NULL DEFAULT 'Europe/London',
    "weekStart" TEXT NOT NULL DEFAULT 'Sunday',
    "bufferTime" INTEGER NOT NULL DEFAULT 0,
    "hideBranding" BOOLEAN NOT NULL DEFAULT false,
    "theme" TEXT,
    "appTheme" TEXT,
    "created" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "trialEndsAt" TIMESTAMP(3),
    "lastActiveAt" TIMESTAMP(3),
    "defaultScheduleId" INTEGER,
    "completedOnboarding" BOOLEAN NOT NULL DEFAULT false,
    "locale" TEXT,
    "timeFormat" INTEGER DEFAULT 12,
    "twoFactorSecret" TEXT,
    "twoFactorEnabled" BOOLEAN NOT NULL DEFAULT false,
    "backupCodes" TEXT,
    "identityProvider" "public"."IdentityProvider" NOT NULL DEFAULT 'CAL',
    "identityProviderId" TEXT,
    "invitedTo" INTEGER,
    "brandColor" TEXT,
    "darkBrandColor" TEXT,
    "allowDynamicBooking" BOOLEAN DEFAULT true,
    "allowSEOIndexing" BOOLEAN DEFAULT true,
    "receiveMonthlyDigestEmail" BOOLEAN DEFAULT true,
    "requiresBookerEmailVerification" BOOLEAN DEFAULT false,
    "metadata" JSONB,
    "verified" BOOLEAN DEFAULT false,
    "role" "public"."UserPermissionRole" NOT NULL DEFAULT 'USER',
    "organizationId" INTEGER,
    "locked" BOOLEAN NOT NULL DEFAULT false,
    "movedToProfileId" INTEGER,
    "isPlatformManaged" BOOLEAN NOT NULL DEFAULT false,
    "smsLockState" "public"."SMSLockState" NOT NULL DEFAULT 'UNLOCKED',
    "smsLockReviewedByAdmin" BOOLEAN NOT NULL DEFAULT false,
    "referralLinkId" TEXT,
    "creationSource" "public"."CreationSource",
    "autoOptInFeatures" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."NotificationsSubscriptions" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "subscription" TEXT NOT NULL,

    CONSTRAINT "NotificationsSubscriptions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Profile" (
    "id" SERIAL NOT NULL,
    "uid" TEXT NOT NULL,
    "userId" INTEGER NOT NULL,
    "organizationId" INTEGER NOT NULL,
    "username" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Profile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Team" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT,
    "logoUrl" TEXT,
    "calVideoLogo" TEXT,
    "appLogo" TEXT,
    "appIconLogo" TEXT,
    "bio" TEXT,
    "hideBranding" BOOLEAN NOT NULL DEFAULT false,
    "hideTeamProfileLink" BOOLEAN NOT NULL DEFAULT false,
    "isPrivate" BOOLEAN NOT NULL DEFAULT false,
    "hideBookATeamMember" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "metadata" JSONB,
    "theme" TEXT,
    "rrResetInterval" "public"."RRResetInterval" DEFAULT 'MONTH',
    "rrTimestampBasis" "public"."RRTimestampBasis" NOT NULL DEFAULT 'CREATED_AT',
    "brandColor" TEXT,
    "darkBrandColor" TEXT,
    "bannerUrl" TEXT,
    "parentId" INTEGER,
    "timeFormat" INTEGER,
    "timeZone" TEXT NOT NULL DEFAULT 'Europe/London',
    "weekStart" TEXT NOT NULL DEFAULT 'Sunday',
    "isOrganization" BOOLEAN NOT NULL DEFAULT false,
    "pendingPayment" BOOLEAN NOT NULL DEFAULT false,
    "isPlatform" BOOLEAN NOT NULL DEFAULT false,
    "createdByOAuthClientId" TEXT,
    "smsLockState" "public"."SMSLockState" NOT NULL DEFAULT 'UNLOCKED',
    "smsLockReviewedByAdmin" BOOLEAN NOT NULL DEFAULT false,
    "bookingLimits" JSONB,
    "includeManagedEventsInLimits" BOOLEAN NOT NULL DEFAULT false,
    "autoOptInFeatures" BOOLEAN NOT NULL DEFAULT false,
    "trialStartedAt" TIMESTAMP(3),
    "trialEndedAt" TIMESTAMP(3),
    "isTrialActive" BOOLEAN NOT NULL DEFAULT true,
    "trialBookingsCount" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "Team_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."PracticeEncryptionKey" (
    "id" TEXT NOT NULL,
    "teamId" INTEGER NOT NULL,
    "keyVersion" INTEGER NOT NULL DEFAULT 1,
    "encryptedDek" TEXT NOT NULL,
    "kmsKeyId" TEXT,
    "algorithm" TEXT NOT NULL DEFAULT 'AES-256-GCM',
    "rotatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "isActive" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "PracticeEncryptionKey_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."TreatmentResource" (
    "id" TEXT NOT NULL,
    "teamId" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "type" "public"."TreatmentResourceType" NOT NULL DEFAULT 'CHAIR',
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "scheduleId" INTEGER,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TreatmentResource_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."BookingResource" (
    "bookingId" INTEGER NOT NULL,
    "resourceId" TEXT NOT NULL,

    CONSTRAINT "BookingResource_pkey" PRIMARY KEY ("bookingId","resourceId")
);

-- CreateTable
CREATE TABLE "public"."EventTypeMedicalProfile" (
    "id" TEXT NOT NULL,
    "eventTypeId" INTEGER NOT NULL,
    "category" "public"."MedicalCategory" NOT NULL DEFAULT 'SONSTIGES',
    "allowedInsuranceTypes" "public"."InsuranceType"[],
    "displayOrder" INTEGER NOT NULL DEFAULT 0,
    "isEmergency" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "EventTypeMedicalProfile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."SmartFillPatient" (
    "id" TEXT NOT NULL,
    "teamId" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phoneNumber" TEXT NOT NULL,
    "emailBlindIndex" TEXT,
    "phoneBlindIndex" TEXT NOT NULL,
    "waitlistEnabled" BOOLEAN NOT NULL DEFAULT false,
    "recallEnabled" BOOLEAN NOT NULL DEFAULT true,
    "lastVisitAt" TIMESTAMP(3),
    "priorityScore" INTEGER NOT NULL DEFAULT 0,
    "preferredEventTypeId" INTEGER,
    "locale" TEXT DEFAULT 'de',
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SmartFillPatient_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."SmartFillTask" (
    "id" TEXT NOT NULL,
    "teamId" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,
    "eventTypeId" INTEGER,
    "startTime" TIMESTAMP(3) NOT NULL,
    "endTime" TIMESTAMP(3) NOT NULL,
    "durationMinutes" INTEGER NOT NULL,
    "status" "public"."SmartFillTaskStatus" NOT NULL DEFAULT 'PENDING',
    "estimatedRevenueCents" INTEGER,
    "bookingUid" TEXT,
    "scanRunId" TEXT,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SmartFillTask_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."SmartFillInvite" (
    "id" TEXT NOT NULL,
    "taskId" TEXT NOT NULL,
    "patientId" TEXT NOT NULL,
    "status" "public"."SmartFillInviteStatus" NOT NULL DEFAULT 'SENT',
    "messageSid" TEXT,
    "confirmToken" TEXT,
    "sentAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "repliedAt" TIMESTAMP(3),
    "replyBody" TEXT,

    CONSTRAINT "SmartFillInvite_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."RecallSettings" (
    "id" TEXT NOT NULL,
    "teamId" INTEGER NOT NULL,
    "enabled" BOOLEAN NOT NULL DEFAULT true,
    "intervalMonths" INTEGER NOT NULL DEFAULT 6,
    "toleranceDays" INTEGER NOT NULL DEFAULT 3,
    "bookingSlug" TEXT,
    "eventTypeId" INTEGER,
    "practiceName" TEXT,
    "emailSubject" TEXT NOT NULL DEFAULT 'Zeit für Ihre Prophylaxe',
    "emailHtmlTemplate" TEXT NOT NULL,
    "emailTextTemplate" TEXT,
    "smsEnabled" BOOLEAN NOT NULL DEFAULT false,
    "smsTemplate" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "RecallSettings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."RecallHistory" (
    "id" TEXT NOT NULL,
    "teamId" INTEGER NOT NULL,
    "patientId" TEXT NOT NULL,
    "channel" "public"."RecallChannel" NOT NULL,
    "status" "public"."RecallHistoryStatus" NOT NULL DEFAULT 'PENDING',
    "recallDueDate" TIMESTAMP(3) NOT NULL,
    "sentAt" TIMESTAMP(3),
    "error" TEXT,
    "optOutToken" TEXT,
    "convertedBookingUid" TEXT,
    "convertedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "RecallHistory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."PvsSyncOutbox" (
    "id" TEXT NOT NULL,
    "teamId" INTEGER NOT NULL,
    "bookingUid" TEXT NOT NULL,
    "operation" "public"."PvsSyncOperation" NOT NULL DEFAULT 'CREATE_APPOINTMENT',
    "payload" JSONB NOT NULL,
    "status" "public"."PvsSyncOutboxStatus" NOT NULL DEFAULT 'PENDING',
    "attempts" INTEGER NOT NULL DEFAULT 0,
    "lastError" TEXT,
    "externalId" TEXT,
    "nextRetryAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PvsSyncOutbox_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."PvsConnectorCredential" (
    "id" TEXT NOT NULL,
    "teamId" INTEGER NOT NULL,
    "label" TEXT NOT NULL DEFAULT 'default',
    "hashedApiKey" TEXT NOT NULL,
    "keyPrefix" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "lastUsedAt" TIMESTAMP(3),
    "revokedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PvsConnectorCredential_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."CreditBalance" (
    "id" TEXT NOT NULL,
    "teamId" INTEGER,
    "userId" INTEGER,
    "additionalCredits" INTEGER NOT NULL DEFAULT 0,
    "limitReachedAt" TIMESTAMP(3),
    "warningSentAt" TIMESTAMP(3),

    CONSTRAINT "CreditBalance_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."CreditPurchaseLog" (
    "id" TEXT NOT NULL,
    "creditBalanceId" TEXT NOT NULL,
    "credits" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CreditPurchaseLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."CreditExpenseLog" (
    "id" TEXT NOT NULL,
    "creditBalanceId" TEXT NOT NULL,
    "bookingUid" TEXT,
    "credits" INTEGER,
    "creditType" "public"."CreditType" NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "smsSid" TEXT,
    "smsSegments" INTEGER,
    "phoneNumber" TEXT,
    "email" TEXT,
    "callDuration" INTEGER,
    "creditFor" "public"."CreditUsageType",
    "externalRef" TEXT,

    CONSTRAINT "CreditExpenseLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."OrganizationSettings" (
    "id" SERIAL NOT NULL,
    "organizationId" INTEGER NOT NULL,
    "isOrganizationConfigured" BOOLEAN NOT NULL DEFAULT false,
    "isOrganizationVerified" BOOLEAN NOT NULL DEFAULT false,
    "orgAutoAcceptEmail" TEXT NOT NULL,
    "lockEventTypeCreationForUsers" BOOLEAN NOT NULL DEFAULT false,
    "adminGetsNoSlotsNotification" BOOLEAN NOT NULL DEFAULT false,
    "isAdminReviewed" BOOLEAN NOT NULL DEFAULT false,
    "isAdminAPIEnabled" BOOLEAN NOT NULL DEFAULT false,
    "allowSEOIndexing" BOOLEAN NOT NULL DEFAULT false,
    "orgProfileRedirectsToVerifiedDomain" BOOLEAN NOT NULL DEFAULT false,
    "disablePhoneOnlySMSNotifications" BOOLEAN NOT NULL DEFAULT false,
    "disableAutofillOnBookingPage" BOOLEAN NOT NULL DEFAULT false,
    "orgAutoJoinOnSignup" BOOLEAN NOT NULL DEFAULT true,
    "disableAttendeeConfirmationEmail" BOOLEAN NOT NULL DEFAULT false,
    "disableAttendeeCancellationEmail" BOOLEAN NOT NULL DEFAULT false,
    "disableAttendeeRescheduledEmail" BOOLEAN NOT NULL DEFAULT false,
    "disableAttendeeRequestEmail" BOOLEAN NOT NULL DEFAULT false,
    "disableAttendeeReassignedEmail" BOOLEAN NOT NULL DEFAULT false,
    "disableAttendeeAwaitingPaymentEmail" BOOLEAN NOT NULL DEFAULT false,
    "disableAttendeeRescheduleRequestEmail" BOOLEAN NOT NULL DEFAULT false,
    "disableAttendeeLocationChangeEmail" BOOLEAN NOT NULL DEFAULT false,
    "disableAttendeeNewEventEmail" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "OrganizationSettings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Membership" (
    "id" SERIAL NOT NULL,
    "teamId" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,
    "accepted" BOOLEAN NOT NULL DEFAULT false,
    "role" "public"."MembershipRole" NOT NULL,
    "customRoleId" TEXT,
    "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),

    CONSTRAINT "Membership_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."VerificationToken" (
    "id" SERIAL NOT NULL,
    "identifier" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL,
    "expiresInDays" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "teamId" INTEGER,
    "secondaryEmailId" INTEGER,

    CONSTRAINT "VerificationToken_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."InstantMeetingToken" (
    "id" SERIAL NOT NULL,
    "token" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL,
    "teamId" INTEGER NOT NULL,
    "bookingId" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "InstantMeetingToken_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."BookingReference" (
    "id" SERIAL NOT NULL,
    "type" TEXT NOT NULL,
    "uid" TEXT NOT NULL,
    "meetingId" TEXT,
    "thirdPartyRecurringEventId" TEXT,
    "meetingPassword" TEXT,
    "meetingUrl" TEXT,
    "bookingId" INTEGER,
    "externalCalendarId" TEXT,
    "deleted" BOOLEAN,
    "credentialId" INTEGER,
    "delegationCredentialId" TEXT,

    CONSTRAINT "BookingReference_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Attendee" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "timeZone" TEXT NOT NULL,
    "phoneNumber" TEXT,
    "locale" TEXT DEFAULT 'en',
    "bookingId" INTEGER,
    "noShow" BOOLEAN DEFAULT false,
    "emailBlindIndex" TEXT,
    "phoneBlindIndex" TEXT,

    CONSTRAINT "Attendee_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Booking" (
    "id" SERIAL NOT NULL,
    "uid" TEXT NOT NULL,
    "idempotencyKey" TEXT,
    "userId" INTEGER,
    "userPrimaryEmail" TEXT,
    "userPrimaryEmailBlindIndex" TEXT,
    "eventTypeId" INTEGER,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "customInputs" JSONB,
    "responses" JSONB,
    "startTime" TIMESTAMP(3) NOT NULL,
    "endTime" TIMESTAMP(3) NOT NULL,
    "location" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),
    "status" "public"."BookingStatus" NOT NULL DEFAULT 'accepted',
    "paid" BOOLEAN NOT NULL DEFAULT false,
    "destinationCalendarId" INTEGER,
    "cancellationReason" TEXT,
    "rejectionReason" TEXT,
    "reassignReason" TEXT,
    "reassignById" INTEGER,
    "dynamicEventSlugRef" TEXT,
    "dynamicGroupSlugRef" TEXT,
    "rescheduled" BOOLEAN,
    "fromReschedule" TEXT,
    "recurringEventId" TEXT,
    "smsReminderNumber" TEXT,
    "scheduledJobs" TEXT[],
    "metadata" JSONB,
    "isRecorded" BOOLEAN NOT NULL DEFAULT false,
    "iCalUID" TEXT DEFAULT '',
    "iCalSequence" INTEGER NOT NULL DEFAULT 0,
    "rating" INTEGER,
    "ratingFeedback" TEXT,
    "noShowHost" BOOLEAN DEFAULT false,
    "oneTimePassword" TEXT,
    "cancelledBy" TEXT,
    "rescheduledBy" TEXT,
    "creationSource" "public"."CreationSource",
    "insuranceType" "public"."InsuranceType",

    CONSTRAINT "Booking_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Tracking" (
    "id" SERIAL NOT NULL,
    "bookingId" INTEGER NOT NULL,
    "utm_source" TEXT,
    "utm_medium" TEXT,
    "utm_campaign" TEXT,
    "utm_term" TEXT,
    "utm_content" TEXT,

    CONSTRAINT "Tracking_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Schedule" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "timeZone" TEXT,

    CONSTRAINT "Schedule_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Availability" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER,
    "eventTypeId" INTEGER,
    "days" INTEGER[],
    "startTime" TIME NOT NULL,
    "endTime" TIME NOT NULL,
    "date" DATE,
    "scheduleId" INTEGER,

    CONSTRAINT "Availability_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."SelectedCalendar" (
    "id" TEXT NOT NULL,
    "userId" INTEGER NOT NULL,
    "integration" TEXT NOT NULL,
    "externalId" TEXT NOT NULL,
    "credentialId" INTEGER,
    "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),
    "googleChannelId" TEXT,
    "googleChannelKind" TEXT,
    "googleChannelResourceId" TEXT,
    "googleChannelResourceUri" TEXT,
    "googleChannelExpiration" TEXT,
    "channelId" TEXT,
    "channelKind" TEXT,
    "channelResourceId" TEXT,
    "channelResourceUri" TEXT,
    "channelExpiration" TIMESTAMP(3),
    "syncSubscribedAt" TIMESTAMP(3),
    "syncSubscribedErrorAt" TIMESTAMP(3),
    "syncSubscribedErrorCount" INTEGER NOT NULL DEFAULT 0,
    "syncToken" TEXT,
    "syncedAt" TIMESTAMP(3),
    "syncErrorAt" TIMESTAMP(3),
    "syncErrorCount" INTEGER DEFAULT 0,
    "delegationCredentialId" TEXT,
    "error" TEXT,
    "lastErrorAt" TIMESTAMP(3),
    "watchAttempts" INTEGER NOT NULL DEFAULT 0,
    "unwatchAttempts" INTEGER NOT NULL DEFAULT 0,
    "maxAttempts" INTEGER NOT NULL DEFAULT 3,
    "eventTypeId" INTEGER,

    CONSTRAINT "SelectedCalendar_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."EventTypeCustomInput" (
    "id" SERIAL NOT NULL,
    "eventTypeId" INTEGER NOT NULL,
    "label" TEXT NOT NULL,
    "type" "public"."EventTypeCustomInputType" NOT NULL,
    "options" JSONB,
    "required" BOOLEAN NOT NULL,
    "placeholder" TEXT NOT NULL DEFAULT '',

    CONSTRAINT "EventTypeCustomInput_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."ResetPasswordRequest" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "email" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ResetPasswordRequest_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."ReminderMail" (
    "id" SERIAL NOT NULL,
    "referenceId" INTEGER NOT NULL,
    "reminderType" "public"."ReminderType" NOT NULL,
    "elapsedMinutes" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ReminderMail_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Payment" (
    "id" SERIAL NOT NULL,
    "uid" TEXT NOT NULL,
    "appId" TEXT,
    "bookingId" INTEGER NOT NULL,
    "amount" INTEGER NOT NULL,
    "fee" INTEGER NOT NULL,
    "currency" TEXT NOT NULL,
    "success" BOOLEAN NOT NULL,
    "refunded" BOOLEAN NOT NULL,
    "data" JSONB NOT NULL,
    "externalId" TEXT NOT NULL,
    "paymentOption" "public"."PaymentOption" DEFAULT 'ON_BOOKING',

    CONSTRAINT "Payment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Webhook" (
    "id" TEXT NOT NULL,
    "userId" INTEGER,
    "teamId" INTEGER,
    "eventTypeId" INTEGER,
    "platformOAuthClientId" TEXT,
    "subscriberUrl" TEXT NOT NULL,
    "payloadTemplate" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "eventTriggers" "public"."WebhookTriggerEvents"[],
    "appId" TEXT,
    "secret" TEXT,
    "platform" BOOLEAN NOT NULL DEFAULT false,
    "time" INTEGER,
    "timeUnit" "public"."TimeUnit",
    "version" TEXT NOT NULL DEFAULT '2021-10-20',

    CONSTRAINT "Webhook_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."ApiKey" (
    "id" TEXT NOT NULL,
    "userId" INTEGER NOT NULL,
    "teamId" INTEGER,
    "note" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expiresAt" TIMESTAMP(3),
    "lastUsedAt" TIMESTAMP(3),
    "hashedKey" TEXT NOT NULL,
    "appId" TEXT,

    CONSTRAINT "ApiKey_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."RateLimit" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "apiKeyId" TEXT NOT NULL,
    "ttl" INTEGER NOT NULL,
    "limit" INTEGER NOT NULL,
    "blockDuration" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "RateLimit_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."HashedLink" (
    "id" SERIAL NOT NULL,
    "link" TEXT NOT NULL,
    "eventTypeId" INTEGER NOT NULL,
    "expiresAt" TIMESTAMP(3),
    "maxUsageCount" INTEGER NOT NULL DEFAULT 1,
    "usageCount" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "HashedLink_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Account" (
    "id" TEXT NOT NULL,
    "userId" INTEGER NOT NULL,
    "type" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "providerAccountId" TEXT NOT NULL,
    "providerEmail" TEXT,
    "refresh_token" TEXT,
    "access_token" TEXT,
    "expires_at" INTEGER,
    "token_type" TEXT,
    "scope" TEXT,
    "id_token" TEXT,
    "session_state" TEXT,

    CONSTRAINT "Account_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Session" (
    "id" TEXT NOT NULL,
    "sessionToken" TEXT NOT NULL,
    "userId" INTEGER NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Session_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."App" (
    "slug" TEXT NOT NULL,
    "dirName" TEXT NOT NULL,
    "keys" JSONB,
    "categories" "public"."AppCategories"[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "enabled" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "App_pkey" PRIMARY KEY ("slug")
);

-- CreateTable
CREATE TABLE "public"."Feedback" (
    "id" SERIAL NOT NULL,
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" INTEGER NOT NULL,
    "rating" TEXT NOT NULL,
    "comment" TEXT,

    CONSTRAINT "Feedback_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Deployment" (
    "id" INTEGER NOT NULL DEFAULT 1,
    "logo" TEXT,
    "theme" JSONB,
    "licenseKey" TEXT,
    "signatureTokenEncrypted" TEXT,
    "agreedLicenseAt" TIMESTAMP(3),

    CONSTRAINT "Deployment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."WebhookScheduledTriggers" (
    "id" SERIAL NOT NULL,
    "jobName" TEXT,
    "subscriberUrl" TEXT NOT NULL,
    "payload" TEXT NOT NULL,
    "startAfter" TIMESTAMP(3) NOT NULL,
    "retryCount" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "appId" TEXT,
    "webhookId" TEXT,
    "bookingId" INTEGER,

    CONSTRAINT "WebhookScheduledTriggers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."BookingSeat" (
    "id" SERIAL NOT NULL,
    "referenceUid" TEXT NOT NULL,
    "bookingId" INTEGER NOT NULL,
    "attendeeId" INTEGER NOT NULL,
    "data" JSONB,
    "metadata" JSONB,

    CONSTRAINT "BookingSeat_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."VerifiedNumber" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER,
    "teamId" INTEGER,
    "phoneNumber" TEXT NOT NULL,

    CONSTRAINT "VerifiedNumber_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."VerifiedEmail" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER,
    "teamId" INTEGER,
    "email" TEXT NOT NULL,

    CONSTRAINT "VerifiedEmail_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Feature" (
    "slug" TEXT NOT NULL,
    "enabled" BOOLEAN NOT NULL DEFAULT false,
    "description" TEXT,
    "type" "public"."FeatureType" DEFAULT 'RELEASE',
    "stale" BOOLEAN DEFAULT false,
    "lastUsedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updatedBy" INTEGER,

    CONSTRAINT "Feature_pkey" PRIMARY KEY ("slug")
);

-- CreateTable
CREATE TABLE "public"."UserFeatures" (
    "userId" INTEGER NOT NULL,
    "featureId" TEXT NOT NULL,
    "enabled" BOOLEAN NOT NULL,
    "assignedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "assignedBy" TEXT NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UserFeatures_pkey" PRIMARY KEY ("userId","featureId")
);

-- CreateTable
CREATE TABLE "public"."TeamFeatures" (
    "teamId" INTEGER NOT NULL,
    "featureId" TEXT NOT NULL,
    "enabled" BOOLEAN NOT NULL,
    "assignedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "assignedBy" TEXT NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TeamFeatures_pkey" PRIMARY KEY ("teamId","featureId")
);

-- CreateTable
CREATE TABLE "public"."SelectedSlots" (
    "id" SERIAL NOT NULL,
    "eventTypeId" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,
    "slotUtcStartDate" TIMESTAMP(3) NOT NULL,
    "slotUtcEndDate" TIMESTAMP(3) NOT NULL,
    "uid" TEXT NOT NULL,
    "releaseAt" TIMESTAMP(3) NOT NULL,
    "isSeat" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "SelectedSlots_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."OAuthClient" (
    "clientId" TEXT NOT NULL,
    "redirectUri" TEXT NOT NULL,
    "clientSecret" TEXT,
    "clientType" "public"."OAuthClientType" NOT NULL DEFAULT 'confidential',
    "name" TEXT NOT NULL,
    "purpose" TEXT,
    "logo" TEXT,
    "websiteUrl" TEXT,
    "rejectionReason" TEXT,
    "isTrusted" BOOLEAN NOT NULL DEFAULT false,
    "status" "public"."OAuthClientStatus" NOT NULL DEFAULT 'approved',
    "userId" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "OAuthClient_pkey" PRIMARY KEY ("clientId")
);

-- CreateTable
CREATE TABLE "public"."AccessCode" (
    "id" SERIAL NOT NULL,
    "code" TEXT NOT NULL,
    "clientId" TEXT,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "scopes" "public"."AccessScope"[],
    "userId" INTEGER,
    "teamId" INTEGER,
    "codeChallenge" TEXT,
    "codeChallengeMethod" TEXT DEFAULT 'S256',

    CONSTRAINT "AccessCode_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."BookingDenormalized" (
    "id" INTEGER NOT NULL,
    "uid" TEXT NOT NULL,
    "eventTypeId" INTEGER,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "startTime" TIMESTAMP(3) NOT NULL,
    "endTime" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL,
    "updatedAt" TIMESTAMP(3),
    "location" TEXT,
    "paid" BOOLEAN NOT NULL,
    "status" "public"."BookingStatus" NOT NULL,
    "rescheduled" BOOLEAN,
    "userId" INTEGER,
    "teamId" INTEGER,
    "eventLength" INTEGER,
    "eventParentId" INTEGER,
    "userEmail" TEXT,
    "userName" TEXT,
    "userUsername" TEXT,
    "ratingFeedback" TEXT,
    "rating" INTEGER,
    "noShowHost" BOOLEAN,
    "isTeamBooking" BOOLEAN NOT NULL,

    CONSTRAINT "BookingDenormalized_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."CalendarCache" (
    "id" TEXT,
    "key" TEXT NOT NULL,
    "value" JSONB NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "credentialId" INTEGER NOT NULL,
    "userId" INTEGER,

    CONSTRAINT "CalendarCache_pkey" PRIMARY KEY ("credentialId","key")
);

-- CreateTable
CREATE TABLE "public"."TempOrgRedirect" (
    "id" SERIAL NOT NULL,
    "from" TEXT NOT NULL,
    "fromOrgId" INTEGER NOT NULL,
    "type" "public"."RedirectType" NOT NULL,
    "toUrl" TEXT NOT NULL,
    "enabled" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TempOrgRedirect_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."avatars" (
    "teamId" INTEGER NOT NULL DEFAULT 0,
    "userId" INTEGER NOT NULL DEFAULT 0,
    "data" TEXT NOT NULL,
    "objectKey" TEXT NOT NULL,
    "isBanner" BOOLEAN NOT NULL DEFAULT false
);

-- CreateTable
CREATE TABLE "public"."OutOfOfficeEntry" (
    "id" SERIAL NOT NULL,
    "uuid" TEXT NOT NULL,
    "start" TIMESTAMP(3) NOT NULL,
    "end" TIMESTAMP(3) NOT NULL,
    "notes" TEXT,
    "showNotePublicly" BOOLEAN NOT NULL DEFAULT false,
    "userId" INTEGER NOT NULL,
    "toUserId" INTEGER,
    "reasonId" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "OutOfOfficeEntry_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."OutOfOfficeReason" (
    "id" SERIAL NOT NULL,
    "emoji" TEXT NOT NULL,
    "reason" TEXT NOT NULL,
    "enabled" BOOLEAN NOT NULL DEFAULT true,
    "userId" INTEGER,

    CONSTRAINT "OutOfOfficeReason_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."UserHolidaySettings" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "countryCode" TEXT,
    "disabledIds" TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UserHolidaySettings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."HolidayCache" (
    "id" TEXT NOT NULL,
    "countryCode" TEXT NOT NULL,
    "calendarId" TEXT NOT NULL,
    "eventId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "year" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "HolidayCache_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."PlatformOAuthClient" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "secret" TEXT NOT NULL,
    "permissions" INTEGER NOT NULL,
    "logo" TEXT,
    "redirectUris" TEXT[],
    "organizationId" INTEGER NOT NULL,
    "bookingRedirectUri" TEXT,
    "bookingCancelRedirectUri" TEXT,
    "bookingRescheduleRedirectUri" TEXT,
    "areEmailsEnabled" BOOLEAN NOT NULL DEFAULT false,
    "areDefaultEventTypesEnabled" BOOLEAN NOT NULL DEFAULT true,
    "areCalendarEventsEnabled" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PlatformOAuthClient_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."PlatformAuthorizationToken" (
    "id" TEXT NOT NULL,
    "platformOAuthClientId" TEXT NOT NULL,
    "userId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PlatformAuthorizationToken_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."AccessToken" (
    "id" SERIAL NOT NULL,
    "secret" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "platformOAuthClientId" TEXT NOT NULL,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "AccessToken_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."RefreshToken" (
    "id" SERIAL NOT NULL,
    "secret" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "platformOAuthClientId" TEXT NOT NULL,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "RefreshToken_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."DSyncData" (
    "id" SERIAL NOT NULL,
    "directoryId" TEXT NOT NULL,
    "tenant" TEXT NOT NULL,
    "organizationId" INTEGER,

    CONSTRAINT "DSyncData_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."DSyncTeamGroupMapping" (
    "id" SERIAL NOT NULL,
    "organizationId" INTEGER NOT NULL,
    "teamId" INTEGER NOT NULL,
    "directoryId" TEXT NOT NULL,
    "groupName" TEXT NOT NULL,

    CONSTRAINT "DSyncTeamGroupMapping_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."SecondaryEmail" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "email" TEXT NOT NULL,
    "emailVerified" TIMESTAMP(3),

    CONSTRAINT "SecondaryEmail_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Task" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "scheduledAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "succeededAt" TIMESTAMP(3),
    "type" TEXT NOT NULL,
    "payload" TEXT NOT NULL,
    "attempts" INTEGER NOT NULL DEFAULT 0,
    "maxAttempts" INTEGER NOT NULL DEFAULT 3,
    "lastError" TEXT,
    "lastFailedAttemptAt" TIMESTAMP(3),
    "referenceUid" TEXT,

    CONSTRAINT "Task_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."ManagedOrganization" (
    "managedOrganizationId" INTEGER NOT NULL,
    "managerOrganizationId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "public"."PlatformBilling" (
    "id" INTEGER NOT NULL,
    "customerId" TEXT NOT NULL,
    "subscriptionId" TEXT,
    "priceId" TEXT,
    "plan" TEXT NOT NULL DEFAULT 'none',
    "billingCycleStart" INTEGER,
    "billingCycleEnd" INTEGER,
    "overdue" BOOLEAN DEFAULT false,
    "managerBillingId" INTEGER,

    CONSTRAINT "PlatformBilling_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."AttributeOption" (
    "id" TEXT NOT NULL,
    "attributeId" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "isGroup" BOOLEAN NOT NULL DEFAULT false,
    "contains" TEXT[],

    CONSTRAINT "AttributeOption_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Attribute" (
    "id" TEXT NOT NULL,
    "teamId" INTEGER NOT NULL,
    "type" "public"."AttributeType" NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "enabled" BOOLEAN NOT NULL DEFAULT true,
    "usersCanEditRelation" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "isWeightsEnabled" BOOLEAN NOT NULL DEFAULT false,
    "isLocked" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Attribute_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."AttributeToUser" (
    "id" TEXT NOT NULL,
    "memberId" INTEGER NOT NULL,
    "attributeOptionId" TEXT NOT NULL,
    "weight" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdById" INTEGER,
    "createdByDSyncId" TEXT,
    "updatedAt" TIMESTAMP(3),
    "updatedById" INTEGER,
    "updatedByDSyncId" TEXT,

    CONSTRAINT "AttributeToUser_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."AssignmentReason" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "bookingId" INTEGER NOT NULL,
    "reasonEnum" "public"."AssignmentReasonEnum" NOT NULL,
    "reasonString" TEXT NOT NULL,

    CONSTRAINT "AssignmentReason_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."DelegationCredential" (
    "id" TEXT NOT NULL,
    "workspacePlatformId" INTEGER NOT NULL,
    "serviceAccountKey" JSONB NOT NULL,
    "enabled" BOOLEAN NOT NULL DEFAULT false,
    "lastEnabledAt" TIMESTAMP(3),
    "lastDisabledAt" TIMESTAMP(3),
    "organizationId" INTEGER NOT NULL,
    "domain" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DelegationCredential_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."WorkspacePlatform" (
    "id" SERIAL NOT NULL,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "defaultServiceAccountKey" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "enabled" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "WorkspacePlatform_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."EventTypeTranslation" (
    "uid" TEXT NOT NULL,
    "eventTypeId" INTEGER NOT NULL,
    "field" "public"."EventTypeAutoTranslatedField" NOT NULL,
    "sourceLocale" TEXT NOT NULL,
    "targetLocale" TEXT NOT NULL,
    "translatedText" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdBy" INTEGER NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "updatedBy" INTEGER,

    CONSTRAINT "EventTypeTranslation_pkey" PRIMARY KEY ("uid")
);

-- CreateTable
CREATE TABLE "public"."Watchlist" (
    "id" UUID NOT NULL,
    "type" "public"."WatchlistType" NOT NULL,
    "value" TEXT NOT NULL,
    "description" TEXT,
    "isGlobal" BOOLEAN NOT NULL DEFAULT false,
    "organizationId" INTEGER,
    "action" "public"."WatchlistAction" NOT NULL DEFAULT 'REPORT',
    "source" "public"."WatchlistSource" NOT NULL DEFAULT 'MANUAL',
    "lastUpdatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Watchlist_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."WatchlistAudit" (
    "id" UUID NOT NULL,
    "type" "public"."WatchlistType" NOT NULL,
    "value" TEXT NOT NULL,
    "description" TEXT,
    "action" "public"."WatchlistAction" NOT NULL DEFAULT 'REPORT',
    "changedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "changedByUserId" INTEGER,
    "watchlistId" UUID,

    CONSTRAINT "WatchlistAudit_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."WatchlistEventAudit" (
    "id" UUID NOT NULL,
    "watchlistId" UUID NOT NULL,
    "eventTypeId" INTEGER NOT NULL,
    "actionTaken" "public"."WatchlistAction" NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "WatchlistEventAudit_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."BookingReport" (
    "id" UUID NOT NULL,
    "bookingUid" TEXT NOT NULL,
    "bookerEmail" TEXT NOT NULL,
    "reportedById" INTEGER,
    "organizationId" INTEGER,
    "reason" "public"."BookingReportReason" NOT NULL,
    "description" TEXT,
    "cancelled" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "status" "public"."BookingReportStatus" NOT NULL DEFAULT 'PENDING',
    "systemStatus" "public"."SystemReportStatus" NOT NULL DEFAULT 'PENDING',
    "watchlistId" UUID,
    "globalWatchlistId" UUID,

    CONSTRAINT "BookingReport_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."WrongAssignmentReport" (
    "id" UUID NOT NULL,
    "bookingUid" TEXT NOT NULL,
    "reportedById" INTEGER,
    "correctAssignee" TEXT,
    "additionalNotes" TEXT NOT NULL,
    "teamId" INTEGER,
    "status" "public"."WrongAssignmentReportStatus" NOT NULL DEFAULT 'PENDING',
    "reviewedById" INTEGER,
    "reviewedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "WrongAssignmentReport_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."OrganizationOnboarding" (
    "id" TEXT NOT NULL,
    "createdById" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "orgOwnerEmail" TEXT NOT NULL,
    "error" TEXT,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "organizationId" INTEGER,
    "billingPeriod" "public"."BillingPeriod" NOT NULL,
    "pricePerSeat" DOUBLE PRECISION NOT NULL,
    "seats" INTEGER NOT NULL,
    "isPlatform" BOOLEAN NOT NULL DEFAULT false,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "logo" TEXT,
    "bio" TEXT,
    "brandColor" TEXT,
    "bannerUrl" TEXT,
    "isDomainConfigured" BOOLEAN NOT NULL DEFAULT false,
    "stripeCustomerId" TEXT,
    "stripeSubscriptionId" TEXT,
    "stripeSubscriptionItemId" TEXT,
    "invitedMembers" JSONB NOT NULL DEFAULT '[]',
    "teams" JSONB NOT NULL DEFAULT '[]',
    "isComplete" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "OrganizationOnboarding_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."InternalNotePreset" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "cancellationReason" TEXT,
    "teamId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "InternalNotePreset_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."FilterSegment" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "tableIdentifier" TEXT NOT NULL,
    "scope" "public"."FilterSegmentScope" NOT NULL,
    "activeFilters" JSONB,
    "sorting" JSONB,
    "columnVisibility" JSONB,
    "columnSizing" JSONB,
    "perPage" INTEGER NOT NULL,
    "searchTerm" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "userId" INTEGER NOT NULL,
    "teamId" INTEGER,

    CONSTRAINT "FilterSegment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."UserFilterSegmentPreference" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "tableIdentifier" TEXT NOT NULL,
    "segmentId" INTEGER,
    "systemSegmentId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UserFilterSegmentPreference_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."BookingInternalNote" (
    "id" SERIAL NOT NULL,
    "notePresetId" INTEGER,
    "text" TEXT,
    "bookingId" INTEGER NOT NULL,
    "createdById" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "BookingInternalNote_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Role" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "color" TEXT,
    "description" TEXT,
    "teamId" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "type" "public"."RoleType" NOT NULL DEFAULT 'CUSTOM',

    CONSTRAINT "Role_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."RolePermission" (
    "id" TEXT NOT NULL,
    "roleId" TEXT NOT NULL,
    "resource" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "RolePermission_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."AuditActor" (
    "id" UUID NOT NULL,
    "type" "public"."AuditActorType" NOT NULL,
    "userUuid" UUID,
    "attendeeId" INTEGER,
    "credentialId" INTEGER,
    "email" TEXT,
    "phone" TEXT,
    "name" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AuditActor_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."BookingAudit" (
    "id" UUID NOT NULL,
    "bookingUid" TEXT NOT NULL,
    "actorId" UUID NOT NULL,
    "type" "public"."BookingAuditType" NOT NULL,
    "action" "public"."BookingAuditAction" NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "source" "public"."BookingAuditSource" NOT NULL,
    "operationId" TEXT NOT NULL,
    "data" JSONB,
    "context" JSONB,

    CONSTRAINT "BookingAudit_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Agent" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "userId" INTEGER,
    "teamId" INTEGER,
    "providerAgentId" TEXT NOT NULL,
    "inboundEventTypeId" INTEGER,
    "outboundEventTypeId" INTEGER,
    "enabled" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Agent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."CalAiPhoneNumber" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER,
    "teamId" INTEGER,
    "phoneNumber" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "providerPhoneNumberId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "stripeCustomerId" TEXT,
    "stripeSubscriptionId" TEXT,
    "subscriptionStatus" "public"."PhoneNumberSubscriptionStatus",
    "inboundAgentId" TEXT,
    "outboundAgentId" TEXT,

    CONSTRAINT "CalAiPhoneNumber_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."TeamBilling" (
    "id" TEXT NOT NULL,
    "teamId" INTEGER NOT NULL,
    "subscriptionId" TEXT NOT NULL,
    "subscriptionItemId" TEXT NOT NULL,
    "customerId" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "planName" TEXT NOT NULL,
    "subscriptionStart" TIMESTAMP(3),
    "subscriptionTrialEnd" TIMESTAMP(3),
    "subscriptionEnd" TIMESTAMP(3),
    "billingPeriod" "public"."BillingPeriod",
    "billingMode" "public"."BillingMode" NOT NULL DEFAULT 'SEATS',
    "pricePerSeat" INTEGER,
    "paidSeats" INTEGER,
    "highWaterMark" INTEGER,
    "highWaterMarkPeriodStart" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TeamBilling_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."OrganizationBilling" (
    "id" TEXT NOT NULL,
    "teamId" INTEGER NOT NULL,
    "subscriptionId" TEXT NOT NULL,
    "subscriptionItemId" TEXT NOT NULL,
    "customerId" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "planName" TEXT NOT NULL,
    "subscriptionStart" TIMESTAMP(3),
    "subscriptionTrialEnd" TIMESTAMP(3),
    "subscriptionEnd" TIMESTAMP(3),
    "billingPeriod" "public"."BillingPeriod",
    "billingMode" "public"."BillingMode" NOT NULL DEFAULT 'SEATS',
    "pricePerSeat" INTEGER,
    "paidSeats" INTEGER,
    "highWaterMark" INTEGER,
    "highWaterMarkPeriodStart" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "OrganizationBilling_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."SeatChangeLog" (
    "id" TEXT NOT NULL,
    "teamId" INTEGER NOT NULL,
    "changeType" "public"."SeatChangeType" NOT NULL,
    "seatCount" INTEGER NOT NULL,
    "userId" INTEGER,
    "triggeredBy" INTEGER,
    "changeDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "monthKey" TEXT NOT NULL,
    "operationId" TEXT,
    "processedInProrationId" TEXT,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "teamBillingId" TEXT,
    "organizationBillingId" TEXT,

    CONSTRAINT "SeatChangeLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."MonthlyProration" (
    "id" TEXT NOT NULL,
    "teamId" INTEGER NOT NULL,
    "monthKey" TEXT NOT NULL,
    "periodStart" TIMESTAMP(3) NOT NULL,
    "periodEnd" TIMESTAMP(3) NOT NULL,
    "seatsAtStart" INTEGER NOT NULL,
    "seatsAdded" INTEGER NOT NULL,
    "seatsRemoved" INTEGER NOT NULL,
    "netSeatIncrease" INTEGER NOT NULL,
    "seatsAtEnd" INTEGER NOT NULL,
    "subscriptionId" TEXT NOT NULL,
    "subscriptionItemId" TEXT NOT NULL,
    "customerId" TEXT NOT NULL,
    "subscriptionStart" TIMESTAMP(3) NOT NULL,
    "subscriptionEnd" TIMESTAMP(3) NOT NULL,
    "remainingDays" INTEGER NOT NULL,
    "pricePerSeat" INTEGER NOT NULL,
    "proratedAmount" INTEGER NOT NULL,
    "invoiceItemId" TEXT,
    "invoiceId" TEXT,
    "invoiceUrl" TEXT,
    "status" "public"."ProrationStatus" NOT NULL DEFAULT 'PENDING',
    "chargedAt" TIMESTAMP(3),
    "failedAt" TIMESTAMP(3),
    "failureReason" TEXT,
    "retryCount" INTEGER NOT NULL DEFAULT 0,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "teamBillingId" TEXT,
    "organizationBillingId" TEXT,

    CONSTRAINT "MonthlyProration_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."CalendarCacheEvent" (
    "id" TEXT NOT NULL,
    "selectedCalendarId" TEXT NOT NULL,
    "externalId" TEXT NOT NULL,
    "externalEtag" TEXT NOT NULL,
    "iCalUID" TEXT,
    "iCalSequence" INTEGER NOT NULL DEFAULT 0,
    "summary" TEXT,
    "description" TEXT,
    "location" TEXT,
    "start" TIMESTAMP(3) NOT NULL,
    "end" TIMESTAMP(3) NOT NULL,
    "isAllDay" BOOLEAN NOT NULL DEFAULT false,
    "timeZone" TEXT,
    "status" "public"."CalendarCacheEventStatus" NOT NULL DEFAULT 'confirmed',
    "recurringEventId" TEXT,
    "originalStartTime" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "externalCreatedAt" TIMESTAMP(3),
    "externalUpdatedAt" TIMESTAMP(3),

    CONSTRAINT "CalendarCacheEvent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."IntegrationAttributeSync" (
    "id" TEXT NOT NULL,
    "organizationId" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "integration" TEXT NOT NULL,
    "credentialId" INTEGER,
    "enabled" BOOLEAN NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "IntegrationAttributeSync_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."AttributeSyncRule" (
    "id" TEXT NOT NULL,
    "integrationAttributeSyncId" TEXT NOT NULL,
    "rule" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AttributeSyncRule_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."AttributeSyncFieldMapping" (
    "id" TEXT NOT NULL,
    "integrationFieldName" TEXT NOT NULL,
    "attributeId" TEXT NOT NULL,
    "enabled" BOOLEAN NOT NULL,
    "integrationAttributeSyncId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AttributeSyncFieldMapping_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."_user_eventtype" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_user_eventtype_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "public"."_PlatformOAuthClientToUser" (
    "A" TEXT NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_PlatformOAuthClientToUser_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "Host_memberId_idx" ON "public"."Host"("memberId");

-- CreateIndex
CREATE INDEX "Host_userId_idx" ON "public"."Host"("userId");

-- CreateIndex
CREATE INDEX "Host_eventTypeId_idx" ON "public"."Host"("eventTypeId");

-- CreateIndex
CREATE INDEX "Host_scheduleId_idx" ON "public"."Host"("scheduleId");

-- CreateIndex
CREATE INDEX "HostGroup_name_idx" ON "public"."HostGroup"("name");

-- CreateIndex
CREATE INDEX "HostGroup_eventTypeId_idx" ON "public"."HostGroup"("eventTypeId");

-- CreateIndex
CREATE INDEX "HostLocation_credentialId_idx" ON "public"."HostLocation"("credentialId");

-- CreateIndex
CREATE INDEX "HostLocation_eventTypeId_idx" ON "public"."HostLocation"("eventTypeId");

-- CreateIndex
CREATE UNIQUE INDEX "HostLocation_userId_eventTypeId_key" ON "public"."HostLocation"("userId", "eventTypeId");

-- CreateIndex
CREATE INDEX "VideoCallGuest_bookingUid_idx" ON "public"."VideoCallGuest"("bookingUid");

-- CreateIndex
CREATE INDEX "VideoCallGuest_email_idx" ON "public"."VideoCallGuest"("email");

-- CreateIndex
CREATE UNIQUE INDEX "VideoCallGuest_bookingUid_email_key" ON "public"."VideoCallGuest"("bookingUid", "email");

-- CreateIndex
CREATE INDEX "EventType_userId_idx" ON "public"."EventType"("userId");

-- CreateIndex
CREATE INDEX "EventType_teamId_idx" ON "public"."EventType"("teamId");

-- CreateIndex
CREATE INDEX "EventType_profileId_idx" ON "public"."EventType"("profileId");

-- CreateIndex
CREATE INDEX "EventType_scheduleId_idx" ON "public"."EventType"("scheduleId");

-- CreateIndex
CREATE INDEX "EventType_secondaryEmailId_idx" ON "public"."EventType"("secondaryEmailId");

-- CreateIndex
CREATE INDEX "EventType_parentId_idx" ON "public"."EventType"("parentId");

-- CreateIndex
CREATE INDEX "EventType_parentId_teamId_idx" ON "public"."EventType"("parentId", "teamId");

-- CreateIndex
CREATE INDEX "EventType_restrictionScheduleId_idx" ON "public"."EventType"("restrictionScheduleId");

-- CreateIndex
CREATE UNIQUE INDEX "EventType_userId_slug_key" ON "public"."EventType"("userId", "slug");

-- CreateIndex
CREATE UNIQUE INDEX "EventType_teamId_slug_key" ON "public"."EventType"("teamId", "slug");

-- CreateIndex
CREATE UNIQUE INDEX "EventType_userId_parentId_key" ON "public"."EventType"("userId", "parentId");

-- CreateIndex
CREATE INDEX "Credential_appId_idx" ON "public"."Credential"("appId");

-- CreateIndex
CREATE INDEX "Credential_subscriptionId_idx" ON "public"."Credential"("subscriptionId");

-- CreateIndex
CREATE INDEX "Credential_invalid_idx" ON "public"."Credential"("invalid");

-- CreateIndex
CREATE INDEX "Credential_userId_delegationCredentialId_idx" ON "public"."Credential"("userId", "delegationCredentialId");

-- CreateIndex
CREATE INDEX "Credential_teamId_idx" ON "public"."Credential"("teamId");

-- CreateIndex
CREATE UNIQUE INDEX "DestinationCalendar_userId_key" ON "public"."DestinationCalendar"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "DestinationCalendar_eventTypeId_key" ON "public"."DestinationCalendar"("eventTypeId");

-- CreateIndex
CREATE INDEX "DestinationCalendar_userId_idx" ON "public"."DestinationCalendar"("userId");

-- CreateIndex
CREATE INDEX "DestinationCalendar_eventTypeId_idx" ON "public"."DestinationCalendar"("eventTypeId");

-- CreateIndex
CREATE INDEX "DestinationCalendar_credentialId_idx" ON "public"."DestinationCalendar"("credentialId");

-- CreateIndex
CREATE UNIQUE INDEX "UserPassword_userId_key" ON "public"."UserPassword"("userId");

-- CreateIndex
CREATE INDEX "TravelSchedule_startDate_idx" ON "public"."TravelSchedule"("startDate");

-- CreateIndex
CREATE INDEX "TravelSchedule_endDate_idx" ON "public"."TravelSchedule"("endDate");

-- CreateIndex
CREATE UNIQUE INDEX "users_uuid_key" ON "public"."users"("uuid");

-- CreateIndex
CREATE INDEX "users_username_idx" ON "public"."users"("username");

-- CreateIndex
CREATE INDEX "users_emailVerified_idx" ON "public"."users"("emailVerified");

-- CreateIndex
CREATE INDEX "users_identityProvider_idx" ON "public"."users"("identityProvider");

-- CreateIndex
CREATE INDEX "users_identityProviderId_idx" ON "public"."users"("identityProviderId");

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "public"."users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "users_email_username_key" ON "public"."users"("email", "username");

-- CreateIndex
CREATE UNIQUE INDEX "users_username_organizationId_key" ON "public"."users"("username", "organizationId");

-- CreateIndex
CREATE UNIQUE INDEX "users_movedToProfileId_key" ON "public"."users"("movedToProfileId");

-- CreateIndex
CREATE INDEX "NotificationsSubscriptions_userId_subscription_idx" ON "public"."NotificationsSubscriptions"("userId", "subscription");

-- CreateIndex
CREATE INDEX "Profile_uid_idx" ON "public"."Profile"("uid");

-- CreateIndex
CREATE INDEX "Profile_userId_idx" ON "public"."Profile"("userId");

-- CreateIndex
CREATE INDEX "Profile_organizationId_idx" ON "public"."Profile"("organizationId");

-- CreateIndex
CREATE UNIQUE INDEX "Profile_userId_organizationId_key" ON "public"."Profile"("userId", "organizationId");

-- CreateIndex
CREATE UNIQUE INDEX "Profile_username_organizationId_key" ON "public"."Profile"("username", "organizationId");

-- CreateIndex
CREATE INDEX "Team_parentId_idx" ON "public"."Team"("parentId");

-- CreateIndex
CREATE UNIQUE INDEX "Team_slug_parentId_key" ON "public"."Team"("slug", "parentId");

-- CreateIndex
CREATE UNIQUE INDEX "PracticeEncryptionKey_teamId_key" ON "public"."PracticeEncryptionKey"("teamId");

-- CreateIndex
CREATE INDEX "PracticeEncryptionKey_teamId_isActive_idx" ON "public"."PracticeEncryptionKey"("teamId", "isActive");

-- CreateIndex
CREATE INDEX "TreatmentResource_teamId_isActive_idx" ON "public"."TreatmentResource"("teamId", "isActive");

-- CreateIndex
CREATE UNIQUE INDEX "TreatmentResource_teamId_slug_key" ON "public"."TreatmentResource"("teamId", "slug");

-- CreateIndex
CREATE INDEX "BookingResource_resourceId_idx" ON "public"."BookingResource"("resourceId");

-- CreateIndex
CREATE UNIQUE INDEX "EventTypeMedicalProfile_eventTypeId_key" ON "public"."EventTypeMedicalProfile"("eventTypeId");

-- CreateIndex
CREATE INDEX "EventTypeMedicalProfile_category_idx" ON "public"."EventTypeMedicalProfile"("category");

-- CreateIndex
CREATE INDEX "SmartFillPatient_teamId_waitlistEnabled_lastVisitAt_idx" ON "public"."SmartFillPatient"("teamId", "waitlistEnabled", "lastVisitAt");

-- CreateIndex
CREATE INDEX "SmartFillPatient_teamId_recallEnabled_lastVisitAt_idx" ON "public"."SmartFillPatient"("teamId", "recallEnabled", "lastVisitAt");

-- CreateIndex
CREATE INDEX "SmartFillPatient_emailBlindIndex_idx" ON "public"."SmartFillPatient"("emailBlindIndex");

-- CreateIndex
CREATE UNIQUE INDEX "SmartFillPatient_teamId_phoneBlindIndex_key" ON "public"."SmartFillPatient"("teamId", "phoneBlindIndex");

-- CreateIndex
CREATE INDEX "SmartFillTask_teamId_status_startTime_idx" ON "public"."SmartFillTask"("teamId", "status", "startTime");

-- CreateIndex
CREATE INDEX "SmartFillTask_userId_startTime_idx" ON "public"."SmartFillTask"("userId", "startTime");

-- CreateIndex
CREATE UNIQUE INDEX "SmartFillTask_teamId_userId_startTime_endTime_key" ON "public"."SmartFillTask"("teamId", "userId", "startTime", "endTime");

-- CreateIndex
CREATE UNIQUE INDEX "SmartFillInvite_confirmToken_key" ON "public"."SmartFillInvite"("confirmToken");

-- CreateIndex
CREATE INDEX "SmartFillInvite_taskId_idx" ON "public"."SmartFillInvite"("taskId");

-- CreateIndex
CREATE INDEX "SmartFillInvite_messageSid_idx" ON "public"."SmartFillInvite"("messageSid");

-- CreateIndex
CREATE INDEX "SmartFillInvite_patientId_status_idx" ON "public"."SmartFillInvite"("patientId", "status");

-- CreateIndex
CREATE UNIQUE INDEX "RecallSettings_teamId_key" ON "public"."RecallSettings"("teamId");

-- CreateIndex
CREATE UNIQUE INDEX "RecallHistory_optOutToken_key" ON "public"."RecallHistory"("optOutToken");

-- CreateIndex
CREATE INDEX "RecallHistory_teamId_status_recallDueDate_idx" ON "public"."RecallHistory"("teamId", "status", "recallDueDate");

-- CreateIndex
CREATE INDEX "RecallHistory_teamId_createdAt_idx" ON "public"."RecallHistory"("teamId", "createdAt");

-- CreateIndex
CREATE INDEX "RecallHistory_teamId_convertedAt_idx" ON "public"."RecallHistory"("teamId", "convertedAt");

-- CreateIndex
CREATE UNIQUE INDEX "RecallHistory_patientId_recallDueDate_channel_key" ON "public"."RecallHistory"("patientId", "recallDueDate", "channel");

-- CreateIndex
CREATE INDEX "PvsSyncOutbox_status_nextRetryAt_idx" ON "public"."PvsSyncOutbox"("status", "nextRetryAt");

-- CreateIndex
CREATE INDEX "PvsSyncOutbox_teamId_bookingUid_idx" ON "public"."PvsSyncOutbox"("teamId", "bookingUid");

-- CreateIndex
CREATE UNIQUE INDEX "PvsConnectorCredential_hashedApiKey_key" ON "public"."PvsConnectorCredential"("hashedApiKey");

-- CreateIndex
CREATE INDEX "PvsConnectorCredential_teamId_isActive_idx" ON "public"."PvsConnectorCredential"("teamId", "isActive");

-- CreateIndex
CREATE UNIQUE INDEX "CreditBalance_teamId_key" ON "public"."CreditBalance"("teamId");

-- CreateIndex
CREATE UNIQUE INDEX "CreditBalance_userId_key" ON "public"."CreditBalance"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "CreditExpenseLog_externalRef_key" ON "public"."CreditExpenseLog"("externalRef");

-- CreateIndex
CREATE UNIQUE INDEX "OrganizationSettings_organizationId_key" ON "public"."OrganizationSettings"("organizationId");

-- CreateIndex
CREATE INDEX "Membership_teamId_idx" ON "public"."Membership"("teamId");

-- CreateIndex
CREATE INDEX "Membership_userId_idx" ON "public"."Membership"("userId");

-- CreateIndex
CREATE INDEX "Membership_accepted_idx" ON "public"."Membership"("accepted");

-- CreateIndex
CREATE INDEX "Membership_role_idx" ON "public"."Membership"("role");

-- CreateIndex
CREATE INDEX "Membership_customRoleId_idx" ON "public"."Membership"("customRoleId");

-- CreateIndex
CREATE UNIQUE INDEX "Membership_userId_teamId_key" ON "public"."Membership"("userId", "teamId");

-- CreateIndex
CREATE UNIQUE INDEX "VerificationToken_token_key" ON "public"."VerificationToken"("token");

-- CreateIndex
CREATE INDEX "VerificationToken_token_idx" ON "public"."VerificationToken"("token");

-- CreateIndex
CREATE INDEX "VerificationToken_teamId_idx" ON "public"."VerificationToken"("teamId");

-- CreateIndex
CREATE INDEX "VerificationToken_secondaryEmailId_idx" ON "public"."VerificationToken"("secondaryEmailId");

-- CreateIndex
CREATE UNIQUE INDEX "VerificationToken_identifier_token_key" ON "public"."VerificationToken"("identifier", "token");

-- CreateIndex
CREATE UNIQUE INDEX "InstantMeetingToken_token_key" ON "public"."InstantMeetingToken"("token");

-- CreateIndex
CREATE UNIQUE INDEX "InstantMeetingToken_bookingId_key" ON "public"."InstantMeetingToken"("bookingId");

-- CreateIndex
CREATE INDEX "InstantMeetingToken_token_idx" ON "public"."InstantMeetingToken"("token");

-- CreateIndex
CREATE INDEX "BookingReference_bookingId_idx" ON "public"."BookingReference"("bookingId");

-- CreateIndex
CREATE INDEX "BookingReference_type_idx" ON "public"."BookingReference"("type");

-- CreateIndex
CREATE INDEX "BookingReference_uid_idx" ON "public"."BookingReference"("uid");

-- CreateIndex
CREATE INDEX "Attendee_email_idx" ON "public"."Attendee"("email");

-- CreateIndex
CREATE INDEX "Attendee_emailBlindIndex_idx" ON "public"."Attendee"("emailBlindIndex");

-- CreateIndex
CREATE INDEX "Attendee_bookingId_idx" ON "public"."Attendee"("bookingId");

-- CreateIndex
CREATE INDEX "Attendee_email_bookingId_idx" ON "public"."Attendee"("email", "bookingId");

-- CreateIndex
CREATE INDEX "Attendee_emailBlindIndex_bookingId_idx" ON "public"."Attendee"("emailBlindIndex", "bookingId");

-- CreateIndex
CREATE UNIQUE INDEX "Booking_uid_key" ON "public"."Booking"("uid");

-- CreateIndex
CREATE UNIQUE INDEX "Booking_idempotencyKey_key" ON "public"."Booking"("idempotencyKey");

-- CreateIndex
CREATE UNIQUE INDEX "Booking_oneTimePassword_key" ON "public"."Booking"("oneTimePassword");

-- CreateIndex
CREATE INDEX "Booking_eventTypeId_idx" ON "public"."Booking"("eventTypeId");

-- CreateIndex
CREATE INDEX "Booking_userId_idx" ON "public"."Booking"("userId");

-- CreateIndex
CREATE INDEX "Booking_destinationCalendarId_idx" ON "public"."Booking"("destinationCalendarId");

-- CreateIndex
CREATE INDEX "Booking_recurringEventId_idx" ON "public"."Booking"("recurringEventId");

-- CreateIndex
CREATE INDEX "Booking_uid_idx" ON "public"."Booking"("uid");

-- CreateIndex
CREATE INDEX "Booking_status_idx" ON "public"."Booking"("status");

-- CreateIndex
CREATE INDEX "Booking_startTime_endTime_status_idx" ON "public"."Booking"("startTime", "endTime", "status");

-- CreateIndex
CREATE INDEX "Booking_fromReschedule_idx" ON "public"."Booking"("fromReschedule");

-- CreateIndex
CREATE INDEX "Booking_userId_endTime_idx" ON "public"."Booking"("userId", "endTime");

-- CreateIndex
CREATE INDEX "Booking_userId_status_startTime_idx" ON "public"."Booking"("userId", "status", "startTime");

-- CreateIndex
CREATE INDEX "Booking_eventTypeId_status_idx" ON "public"."Booking"("eventTypeId", "status");

-- CreateIndex
CREATE INDEX "Booking_userId_createdAt_idx" ON "public"."Booking"("userId", "createdAt");

-- CreateIndex
CREATE INDEX "Booking_userPrimaryEmailBlindIndex_idx" ON "public"."Booking"("userPrimaryEmailBlindIndex");

-- CreateIndex
CREATE INDEX "Booking_eventTypeId_insuranceType_idx" ON "public"."Booking"("eventTypeId", "insuranceType");

-- CreateIndex
CREATE UNIQUE INDEX "Tracking_bookingId_key" ON "public"."Tracking"("bookingId");

-- CreateIndex
CREATE INDEX "Schedule_userId_idx" ON "public"."Schedule"("userId");

-- CreateIndex
CREATE INDEX "Availability_userId_idx" ON "public"."Availability"("userId");

-- CreateIndex
CREATE INDEX "Availability_eventTypeId_idx" ON "public"."Availability"("eventTypeId");

-- CreateIndex
CREATE INDEX "Availability_scheduleId_idx" ON "public"."Availability"("scheduleId");

-- CreateIndex
CREATE INDEX "SelectedCalendar_userId_idx" ON "public"."SelectedCalendar"("userId");

-- CreateIndex
CREATE INDEX "SelectedCalendar_externalId_idx" ON "public"."SelectedCalendar"("externalId");

-- CreateIndex
CREATE INDEX "SelectedCalendar_eventTypeId_idx" ON "public"."SelectedCalendar"("eventTypeId");

-- CreateIndex
CREATE INDEX "SelectedCalendar_credentialId_idx" ON "public"."SelectedCalendar"("credentialId");

-- CreateIndex
CREATE INDEX "SelectedCalendar_channelId_idx" ON "public"."SelectedCalendar"("channelId");

-- CreateIndex
CREATE INDEX "SelectedCalendar_watch_idx" ON "public"."SelectedCalendar"("integration", "googleChannelExpiration", "error", "watchAttempts", "maxAttempts");

-- CreateIndex
CREATE INDEX "SelectedCalendar_unwatch_idx" ON "public"."SelectedCalendar"("integration", "googleChannelExpiration", "error", "unwatchAttempts", "maxAttempts");

-- CreateIndex
CREATE UNIQUE INDEX "SelectedCalendar_userId_integration_externalId_eventTypeId_key" ON "public"."SelectedCalendar"("userId", "integration", "externalId", "eventTypeId");

-- CreateIndex
CREATE UNIQUE INDEX "SelectedCalendar_googleChannelId_eventTypeId_key" ON "public"."SelectedCalendar"("googleChannelId", "eventTypeId");

-- CreateIndex
CREATE INDEX "EventTypeCustomInput_eventTypeId_idx" ON "public"."EventTypeCustomInput"("eventTypeId");

-- CreateIndex
CREATE INDEX "ReminderMail_referenceId_idx" ON "public"."ReminderMail"("referenceId");

-- CreateIndex
CREATE INDEX "ReminderMail_reminderType_idx" ON "public"."ReminderMail"("reminderType");

-- CreateIndex
CREATE UNIQUE INDEX "Payment_uid_key" ON "public"."Payment"("uid");

-- CreateIndex
CREATE UNIQUE INDEX "Payment_externalId_key" ON "public"."Payment"("externalId");

-- CreateIndex
CREATE INDEX "Payment_bookingId_idx" ON "public"."Payment"("bookingId");

-- CreateIndex
CREATE INDEX "Payment_externalId_idx" ON "public"."Payment"("externalId");

-- CreateIndex
CREATE UNIQUE INDEX "Webhook_id_key" ON "public"."Webhook"("id");

-- CreateIndex
CREATE INDEX "Webhook_active_idx" ON "public"."Webhook"("active");

-- CreateIndex
CREATE UNIQUE INDEX "Webhook_userId_subscriberUrl_key" ON "public"."Webhook"("userId", "subscriberUrl");

-- CreateIndex
CREATE UNIQUE INDEX "Webhook_platformOAuthClientId_subscriberUrl_key" ON "public"."Webhook"("platformOAuthClientId", "subscriberUrl");

-- CreateIndex
CREATE UNIQUE INDEX "ApiKey_id_key" ON "public"."ApiKey"("id");

-- CreateIndex
CREATE UNIQUE INDEX "ApiKey_hashedKey_key" ON "public"."ApiKey"("hashedKey");

-- CreateIndex
CREATE INDEX "ApiKey_userId_idx" ON "public"."ApiKey"("userId");

-- CreateIndex
CREATE INDEX "RateLimit_apiKeyId_idx" ON "public"."RateLimit"("apiKeyId");

-- CreateIndex
CREATE UNIQUE INDEX "HashedLink_link_key" ON "public"."HashedLink"("link");

-- CreateIndex
CREATE INDEX "HashedLink_eventTypeId_idx" ON "public"."HashedLink"("eventTypeId");

-- CreateIndex
CREATE INDEX "Account_userId_idx" ON "public"."Account"("userId");

-- CreateIndex
CREATE INDEX "Account_type_idx" ON "public"."Account"("type");

-- CreateIndex
CREATE UNIQUE INDEX "Account_provider_providerAccountId_key" ON "public"."Account"("provider", "providerAccountId");

-- CreateIndex
CREATE UNIQUE INDEX "Session_sessionToken_key" ON "public"."Session"("sessionToken");

-- CreateIndex
CREATE INDEX "Session_userId_idx" ON "public"."Session"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "App_slug_key" ON "public"."App"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "App_dirName_key" ON "public"."App"("dirName");

-- CreateIndex
CREATE INDEX "App_enabled_idx" ON "public"."App"("enabled");

-- CreateIndex
CREATE INDEX "Feedback_userId_idx" ON "public"."Feedback"("userId");

-- CreateIndex
CREATE INDEX "Feedback_rating_idx" ON "public"."Feedback"("rating");

-- CreateIndex
CREATE UNIQUE INDEX "BookingSeat_referenceUid_key" ON "public"."BookingSeat"("referenceUid");

-- CreateIndex
CREATE UNIQUE INDEX "BookingSeat_attendeeId_key" ON "public"."BookingSeat"("attendeeId");

-- CreateIndex
CREATE INDEX "BookingSeat_bookingId_idx" ON "public"."BookingSeat"("bookingId");

-- CreateIndex
CREATE INDEX "BookingSeat_attendeeId_idx" ON "public"."BookingSeat"("attendeeId");

-- CreateIndex
CREATE INDEX "VerifiedNumber_userId_idx" ON "public"."VerifiedNumber"("userId");

-- CreateIndex
CREATE INDEX "VerifiedNumber_teamId_idx" ON "public"."VerifiedNumber"("teamId");

-- CreateIndex
CREATE INDEX "VerifiedEmail_userId_idx" ON "public"."VerifiedEmail"("userId");

-- CreateIndex
CREATE INDEX "VerifiedEmail_teamId_idx" ON "public"."VerifiedEmail"("teamId");

-- CreateIndex
CREATE UNIQUE INDEX "Feature_slug_key" ON "public"."Feature"("slug");

-- CreateIndex
CREATE INDEX "Feature_enabled_idx" ON "public"."Feature"("enabled");

-- CreateIndex
CREATE INDEX "Feature_stale_idx" ON "public"."Feature"("stale");

-- CreateIndex
CREATE INDEX "UserFeatures_userId_featureId_idx" ON "public"."UserFeatures"("userId", "featureId");

-- CreateIndex
CREATE INDEX "TeamFeatures_teamId_featureId_idx" ON "public"."TeamFeatures"("teamId", "featureId");

-- CreateIndex
CREATE UNIQUE INDEX "SelectedSlots_userId_slotUtcStartDate_slotUtcEndDate_uid_key" ON "public"."SelectedSlots"("userId", "slotUtcStartDate", "slotUtcEndDate", "uid");

-- CreateIndex
CREATE UNIQUE INDEX "OAuthClient_clientId_key" ON "public"."OAuthClient"("clientId");

-- CreateIndex
CREATE INDEX "OAuthClient_userId_idx" ON "public"."OAuthClient"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "BookingDenormalized_id_key" ON "public"."BookingDenormalized"("id");

-- CreateIndex
CREATE INDEX "BookingDenormalized_userId_idx" ON "public"."BookingDenormalized"("userId");

-- CreateIndex
CREATE INDEX "BookingDenormalized_createdAt_idx" ON "public"."BookingDenormalized"("createdAt");

-- CreateIndex
CREATE INDEX "BookingDenormalized_eventTypeId_idx" ON "public"."BookingDenormalized"("eventTypeId");

-- CreateIndex
CREATE INDEX "BookingDenormalized_eventParentId_idx" ON "public"."BookingDenormalized"("eventParentId");

-- CreateIndex
CREATE INDEX "BookingDenormalized_teamId_idx" ON "public"."BookingDenormalized"("teamId");

-- CreateIndex
CREATE INDEX "BookingDenormalized_startTime_idx" ON "public"."BookingDenormalized"("startTime");

-- CreateIndex
CREATE INDEX "BookingDenormalized_endTime_idx" ON "public"."BookingDenormalized"("endTime");

-- CreateIndex
CREATE INDEX "BookingDenormalized_status_idx" ON "public"."BookingDenormalized"("status");

-- CreateIndex
CREATE INDEX "BookingDenormalized_teamId_isTeamBooking_idx" ON "public"."BookingDenormalized"("teamId", "isTeamBooking");

-- CreateIndex
CREATE INDEX "BookingDenormalized_userId_isTeamBooking_idx" ON "public"."BookingDenormalized"("userId", "isTeamBooking");

-- CreateIndex
CREATE INDEX "BookingDenormalized_startTime_endTime_idx" ON "public"."BookingDenormalized"("startTime", "endTime");

-- CreateIndex
CREATE INDEX "CalendarCache_userId_key_idx" ON "public"."CalendarCache"("userId", "key");

-- CreateIndex
CREATE UNIQUE INDEX "CalendarCache_credentialId_key_key" ON "public"."CalendarCache"("credentialId", "key");

-- CreateIndex
CREATE UNIQUE INDEX "TempOrgRedirect_from_type_fromOrgId_key" ON "public"."TempOrgRedirect"("from", "type", "fromOrgId");

-- CreateIndex
CREATE UNIQUE INDEX "avatars_objectKey_key" ON "public"."avatars"("objectKey");

-- CreateIndex
CREATE UNIQUE INDEX "avatars_teamId_userId_isBanner_key" ON "public"."avatars"("teamId", "userId", "isBanner");

-- CreateIndex
CREATE UNIQUE INDEX "OutOfOfficeEntry_uuid_key" ON "public"."OutOfOfficeEntry"("uuid");

-- CreateIndex
CREATE INDEX "OutOfOfficeEntry_uuid_idx" ON "public"."OutOfOfficeEntry"("uuid");

-- CreateIndex
CREATE INDEX "OutOfOfficeEntry_userId_idx" ON "public"."OutOfOfficeEntry"("userId");

-- CreateIndex
CREATE INDEX "OutOfOfficeEntry_toUserId_idx" ON "public"."OutOfOfficeEntry"("toUserId");

-- CreateIndex
CREATE INDEX "OutOfOfficeEntry_start_end_idx" ON "public"."OutOfOfficeEntry"("start", "end");

-- CreateIndex
CREATE UNIQUE INDEX "OutOfOfficeReason_reason_key" ON "public"."OutOfOfficeReason"("reason");

-- CreateIndex
CREATE UNIQUE INDEX "UserHolidaySettings_userId_key" ON "public"."UserHolidaySettings"("userId");

-- CreateIndex
CREATE INDEX "HolidayCache_countryCode_year_idx" ON "public"."HolidayCache"("countryCode", "year");

-- CreateIndex
CREATE INDEX "HolidayCache_countryCode_date_idx" ON "public"."HolidayCache"("countryCode", "date");

-- CreateIndex
CREATE UNIQUE INDEX "HolidayCache_countryCode_eventId_key" ON "public"."HolidayCache"("countryCode", "eventId");

-- CreateIndex
CREATE UNIQUE INDEX "PlatformAuthorizationToken_userId_platformOAuthClientId_key" ON "public"."PlatformAuthorizationToken"("userId", "platformOAuthClientId");

-- CreateIndex
CREATE UNIQUE INDEX "AccessToken_secret_key" ON "public"."AccessToken"("secret");

-- CreateIndex
CREATE UNIQUE INDEX "RefreshToken_secret_key" ON "public"."RefreshToken"("secret");

-- CreateIndex
CREATE UNIQUE INDEX "DSyncData_directoryId_key" ON "public"."DSyncData"("directoryId");

-- CreateIndex
CREATE UNIQUE INDEX "DSyncData_organizationId_key" ON "public"."DSyncData"("organizationId");

-- CreateIndex
CREATE UNIQUE INDEX "DSyncTeamGroupMapping_teamId_groupName_key" ON "public"."DSyncTeamGroupMapping"("teamId", "groupName");

-- CreateIndex
CREATE INDEX "SecondaryEmail_userId_idx" ON "public"."SecondaryEmail"("userId");

-- CreateIndex
CREATE INDEX "SecondaryEmail_email_emailVerified_idx" ON "public"."SecondaryEmail"("email", "emailVerified");

-- CreateIndex
CREATE UNIQUE INDEX "SecondaryEmail_email_key" ON "public"."SecondaryEmail"("email");

-- CreateIndex
CREATE UNIQUE INDEX "SecondaryEmail_userId_email_key" ON "public"."SecondaryEmail"("userId", "email");

-- CreateIndex
CREATE UNIQUE INDEX "Task_id_key" ON "public"."Task"("id");

-- CreateIndex
CREATE INDEX "Task_succeededAt_idx" ON "public"."Task"("succeededAt");

-- CreateIndex
CREATE INDEX "Task_scheduledAt_succeededAt_idx" ON "public"."Task"("scheduledAt", "succeededAt");

-- CreateIndex
CREATE UNIQUE INDEX "Task_referenceUid_type_key" ON "public"."Task"("referenceUid", "type");

-- CreateIndex
CREATE UNIQUE INDEX "ManagedOrganization_managedOrganizationId_key" ON "public"."ManagedOrganization"("managedOrganizationId");

-- CreateIndex
CREATE INDEX "ManagedOrganization_managerOrganizationId_idx" ON "public"."ManagedOrganization"("managerOrganizationId");

-- CreateIndex
CREATE UNIQUE INDEX "ManagedOrganization_managerOrganizationId_managedOrganizati_key" ON "public"."ManagedOrganization"("managerOrganizationId", "managedOrganizationId");

-- CreateIndex
CREATE UNIQUE INDEX "PlatformBilling_id_key" ON "public"."PlatformBilling"("id");

-- CreateIndex
CREATE INDEX "Attribute_teamId_idx" ON "public"."Attribute"("teamId");

-- CreateIndex
CREATE UNIQUE INDEX "Attribute_teamId_slug_key" ON "public"."Attribute"("teamId", "slug");

-- CreateIndex
CREATE UNIQUE INDEX "AttributeToUser_memberId_attributeOptionId_key" ON "public"."AttributeToUser"("memberId", "attributeOptionId");

-- CreateIndex
CREATE UNIQUE INDEX "AssignmentReason_id_key" ON "public"."AssignmentReason"("id");

-- CreateIndex
CREATE INDEX "AssignmentReason_bookingId_idx" ON "public"."AssignmentReason"("bookingId");

-- CreateIndex
CREATE INDEX "DelegationCredential_enabled_idx" ON "public"."DelegationCredential"("enabled");

-- CreateIndex
CREATE UNIQUE INDEX "DelegationCredential_organizationId_domain_key" ON "public"."DelegationCredential"("organizationId", "domain");

-- CreateIndex
CREATE UNIQUE INDEX "WorkspacePlatform_slug_key" ON "public"."WorkspacePlatform"("slug");

-- CreateIndex
CREATE INDEX "EventTypeTranslation_eventTypeId_field_targetLocale_idx" ON "public"."EventTypeTranslation"("eventTypeId", "field", "targetLocale");

-- CreateIndex
CREATE UNIQUE INDEX "EventTypeTranslation_eventTypeId_field_targetLocale_key" ON "public"."EventTypeTranslation"("eventTypeId", "field", "targetLocale");

-- CreateIndex
CREATE INDEX "Watchlist_isGlobal_action_organizationId_type_value_idx" ON "public"."Watchlist"("isGlobal", "action", "organizationId", "type", "value");

-- CreateIndex
CREATE UNIQUE INDEX "Watchlist_type_value_organizationId_key" ON "public"."Watchlist"("type", "value", "organizationId");

-- CreateIndex
CREATE INDEX "WatchlistAudit_watchlistId_changedAt_idx" ON "public"."WatchlistAudit"("watchlistId", "changedAt");

-- CreateIndex
CREATE UNIQUE INDEX "BookingReport_bookingUid_key" ON "public"."BookingReport"("bookingUid");

-- CreateIndex
CREATE INDEX "BookingReport_bookerEmail_idx" ON "public"."BookingReport"("bookerEmail");

-- CreateIndex
CREATE INDEX "BookingReport_reportedById_idx" ON "public"."BookingReport"("reportedById");

-- CreateIndex
CREATE INDEX "BookingReport_organizationId_idx" ON "public"."BookingReport"("organizationId");

-- CreateIndex
CREATE INDEX "BookingReport_watchlistId_idx" ON "public"."BookingReport"("watchlistId");

-- CreateIndex
CREATE INDEX "BookingReport_globalWatchlistId_idx" ON "public"."BookingReport"("globalWatchlistId");

-- CreateIndex
CREATE INDEX "BookingReport_systemStatus_idx" ON "public"."BookingReport"("systemStatus");

-- CreateIndex
CREATE INDEX "BookingReport_createdAt_idx" ON "public"."BookingReport"("createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "WrongAssignmentReport_bookingUid_key" ON "public"."WrongAssignmentReport"("bookingUid");

-- CreateIndex
CREATE INDEX "WrongAssignmentReport_reportedById_idx" ON "public"."WrongAssignmentReport"("reportedById");

-- CreateIndex
CREATE INDEX "WrongAssignmentReport_teamId_idx" ON "public"."WrongAssignmentReport"("teamId");

-- CreateIndex
CREATE INDEX "WrongAssignmentReport_status_idx" ON "public"."WrongAssignmentReport"("status");

-- CreateIndex
CREATE INDEX "WrongAssignmentReport_reviewedById_idx" ON "public"."WrongAssignmentReport"("reviewedById");

-- CreateIndex
CREATE INDEX "WrongAssignmentReport_createdAt_idx" ON "public"."WrongAssignmentReport"("createdAt");

-- CreateIndex
CREATE INDEX "WrongAssignmentReport_teamId_status_createdAt_idx" ON "public"."WrongAssignmentReport"("teamId", "status", "createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "OrganizationOnboarding_orgOwnerEmail_key" ON "public"."OrganizationOnboarding"("orgOwnerEmail");

-- CreateIndex
CREATE UNIQUE INDEX "OrganizationOnboarding_organizationId_key" ON "public"."OrganizationOnboarding"("organizationId");

-- CreateIndex
CREATE UNIQUE INDEX "OrganizationOnboarding_stripeCustomerId_key" ON "public"."OrganizationOnboarding"("stripeCustomerId");

-- CreateIndex
CREATE INDEX "OrganizationOnboarding_orgOwnerEmail_idx" ON "public"."OrganizationOnboarding"("orgOwnerEmail");

-- CreateIndex
CREATE INDEX "OrganizationOnboarding_stripeCustomerId_idx" ON "public"."OrganizationOnboarding"("stripeCustomerId");

-- CreateIndex
CREATE INDEX "InternalNotePreset_teamId_idx" ON "public"."InternalNotePreset"("teamId");

-- CreateIndex
CREATE UNIQUE INDEX "InternalNotePreset_teamId_name_key" ON "public"."InternalNotePreset"("teamId", "name");

-- CreateIndex
CREATE INDEX "FilterSegment_scope_userId_tableIdentifier_idx" ON "public"."FilterSegment"("scope", "userId", "tableIdentifier");

-- CreateIndex
CREATE INDEX "FilterSegment_scope_teamId_tableIdentifier_idx" ON "public"."FilterSegment"("scope", "teamId", "tableIdentifier");

-- CreateIndex
CREATE INDEX "UserFilterSegmentPreference_userId_idx" ON "public"."UserFilterSegmentPreference"("userId");

-- CreateIndex
CREATE INDEX "UserFilterSegmentPreference_segmentId_idx" ON "public"."UserFilterSegmentPreference"("segmentId");

-- CreateIndex
CREATE UNIQUE INDEX "UserFilterSegmentPreference_userId_tableIdentifier_key" ON "public"."UserFilterSegmentPreference"("userId", "tableIdentifier");

-- CreateIndex
CREATE INDEX "BookingInternalNote_bookingId_idx" ON "public"."BookingInternalNote"("bookingId");

-- CreateIndex
CREATE UNIQUE INDEX "BookingInternalNote_bookingId_notePresetId_key" ON "public"."BookingInternalNote"("bookingId", "notePresetId");

-- CreateIndex
CREATE INDEX "Role_teamId_idx" ON "public"."Role"("teamId");

-- CreateIndex
CREATE UNIQUE INDEX "Role_name_teamId_key" ON "public"."Role"("name", "teamId");

-- CreateIndex
CREATE INDEX "RolePermission_roleId_idx" ON "public"."RolePermission"("roleId");

-- CreateIndex
CREATE INDEX "RolePermission_action_idx" ON "public"."RolePermission"("action");

-- CreateIndex
CREATE UNIQUE INDEX "RolePermission_roleId_resource_action_key" ON "public"."RolePermission"("roleId", "resource", "action");

-- CreateIndex
CREATE INDEX "AuditActor_email_idx" ON "public"."AuditActor"("email");

-- CreateIndex
CREATE INDEX "AuditActor_userUuid_idx" ON "public"."AuditActor"("userUuid");

-- CreateIndex
CREATE INDEX "AuditActor_attendeeId_idx" ON "public"."AuditActor"("attendeeId");

-- CreateIndex
CREATE INDEX "AuditActor_credentialId_idx" ON "public"."AuditActor"("credentialId");

-- CreateIndex
CREATE UNIQUE INDEX "AuditActor_userUuid_key" ON "public"."AuditActor"("userUuid");

-- CreateIndex
CREATE UNIQUE INDEX "AuditActor_attendeeId_key" ON "public"."AuditActor"("attendeeId");

-- CreateIndex
CREATE UNIQUE INDEX "AuditActor_credentialId_key" ON "public"."AuditActor"("credentialId");

-- CreateIndex
CREATE UNIQUE INDEX "AuditActor_email_key" ON "public"."AuditActor"("email");

-- CreateIndex
CREATE UNIQUE INDEX "AuditActor_phone_key" ON "public"."AuditActor"("phone");

-- CreateIndex
CREATE INDEX "BookingAudit_actorId_idx" ON "public"."BookingAudit"("actorId");

-- CreateIndex
CREATE INDEX "BookingAudit_bookingUid_idx" ON "public"."BookingAudit"("bookingUid");

-- CreateIndex
CREATE INDEX "BookingAudit_timestamp_idx" ON "public"."BookingAudit"("timestamp");

-- CreateIndex
CREATE INDEX "BookingAudit_operationId_idx" ON "public"."BookingAudit"("operationId");

-- CreateIndex
CREATE UNIQUE INDEX "Agent_providerAgentId_key" ON "public"."Agent"("providerAgentId");

-- CreateIndex
CREATE INDEX "Agent_userId_idx" ON "public"."Agent"("userId");

-- CreateIndex
CREATE INDEX "Agent_teamId_idx" ON "public"."Agent"("teamId");

-- CreateIndex
CREATE INDEX "Agent_inboundEventTypeId_idx" ON "public"."Agent"("inboundEventTypeId");

-- CreateIndex
CREATE INDEX "Agent_outboundEventTypeId_idx" ON "public"."Agent"("outboundEventTypeId");

-- CreateIndex
CREATE UNIQUE INDEX "CalAiPhoneNumber_phoneNumber_key" ON "public"."CalAiPhoneNumber"("phoneNumber");

-- CreateIndex
CREATE UNIQUE INDEX "CalAiPhoneNumber_providerPhoneNumberId_key" ON "public"."CalAiPhoneNumber"("providerPhoneNumberId");

-- CreateIndex
CREATE UNIQUE INDEX "CalAiPhoneNumber_stripeSubscriptionId_key" ON "public"."CalAiPhoneNumber"("stripeSubscriptionId");

-- CreateIndex
CREATE INDEX "CalAiPhoneNumber_userId_idx" ON "public"."CalAiPhoneNumber"("userId");

-- CreateIndex
CREATE INDEX "CalAiPhoneNumber_teamId_idx" ON "public"."CalAiPhoneNumber"("teamId");

-- CreateIndex
CREATE INDEX "CalAiPhoneNumber_inboundAgentId_idx" ON "public"."CalAiPhoneNumber"("inboundAgentId");

-- CreateIndex
CREATE INDEX "CalAiPhoneNumber_outboundAgentId_idx" ON "public"."CalAiPhoneNumber"("outboundAgentId");

-- CreateIndex
CREATE UNIQUE INDEX "TeamBilling_teamId_key" ON "public"."TeamBilling"("teamId");

-- CreateIndex
CREATE UNIQUE INDEX "TeamBilling_subscriptionId_key" ON "public"."TeamBilling"("subscriptionId");

-- CreateIndex
CREATE UNIQUE INDEX "OrganizationBilling_teamId_key" ON "public"."OrganizationBilling"("teamId");

-- CreateIndex
CREATE UNIQUE INDEX "OrganizationBilling_subscriptionId_key" ON "public"."OrganizationBilling"("subscriptionId");

-- CreateIndex
CREATE INDEX "SeatChangeLog_teamId_monthKey_idx" ON "public"."SeatChangeLog"("teamId", "monthKey");

-- CreateIndex
CREATE INDEX "SeatChangeLog_teamId_processedInProrationId_idx" ON "public"."SeatChangeLog"("teamId", "processedInProrationId");

-- CreateIndex
CREATE INDEX "SeatChangeLog_monthKey_idx" ON "public"."SeatChangeLog"("monthKey");

-- CreateIndex
CREATE UNIQUE INDEX "SeatChangeLog_teamId_operationId_key" ON "public"."SeatChangeLog"("teamId", "operationId");

-- CreateIndex
CREATE INDEX "MonthlyProration_monthKey_status_idx" ON "public"."MonthlyProration"("monthKey", "status");

-- CreateIndex
CREATE INDEX "MonthlyProration_status_idx" ON "public"."MonthlyProration"("status");

-- CreateIndex
CREATE INDEX "MonthlyProration_teamId_idx" ON "public"."MonthlyProration"("teamId");

-- CreateIndex
CREATE UNIQUE INDEX "MonthlyProration_teamId_monthKey_key" ON "public"."MonthlyProration"("teamId", "monthKey");

-- CreateIndex
CREATE INDEX "CalendarCacheEvent_start_end_status_idx" ON "public"."CalendarCacheEvent"("start", "end", "status");

-- CreateIndex
CREATE INDEX "CalendarCacheEvent_selectedCalendarId_iCalUID_idx" ON "public"."CalendarCacheEvent"("selectedCalendarId", "iCalUID");

-- CreateIndex
CREATE UNIQUE INDEX "CalendarCacheEvent_selectedCalendarId_externalId_key" ON "public"."CalendarCacheEvent"("selectedCalendarId", "externalId");

-- CreateIndex
CREATE INDEX "IntegrationAttributeSync_organizationId_idx" ON "public"."IntegrationAttributeSync"("organizationId");

-- CreateIndex
CREATE INDEX "IntegrationAttributeSync_credentialId_idx" ON "public"."IntegrationAttributeSync"("credentialId");

-- CreateIndex
CREATE UNIQUE INDEX "AttributeSyncRule_integrationAttributeSyncId_key" ON "public"."AttributeSyncRule"("integrationAttributeSyncId");

-- CreateIndex
CREATE INDEX "AttributeSyncFieldMapping_integrationAttributeSyncId_idx" ON "public"."AttributeSyncFieldMapping"("integrationAttributeSyncId");

-- CreateIndex
CREATE UNIQUE INDEX "AttributeSyncFieldMapping_integrationAttributeSyncId_attrib_key" ON "public"."AttributeSyncFieldMapping"("integrationAttributeSyncId", "attributeId");

-- CreateIndex
CREATE INDEX "_user_eventtype_B_index" ON "public"."_user_eventtype"("B");

-- CreateIndex
CREATE INDEX "_PlatformOAuthClientToUser_B_index" ON "public"."_PlatformOAuthClientToUser"("B");

-- AddForeignKey
ALTER TABLE "public"."Host" ADD CONSTRAINT "Host_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Host" ADD CONSTRAINT "Host_eventTypeId_fkey" FOREIGN KEY ("eventTypeId") REFERENCES "public"."EventType"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Host" ADD CONSTRAINT "Host_scheduleId_fkey" FOREIGN KEY ("scheduleId") REFERENCES "public"."Schedule"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Host" ADD CONSTRAINT "Host_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "public"."HostGroup"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Host" ADD CONSTRAINT "Host_memberId_fkey" FOREIGN KEY ("memberId") REFERENCES "public"."Membership"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."HostGroup" ADD CONSTRAINT "HostGroup_eventTypeId_fkey" FOREIGN KEY ("eventTypeId") REFERENCES "public"."EventType"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."HostLocation" ADD CONSTRAINT "HostLocation_userId_eventTypeId_fkey" FOREIGN KEY ("userId", "eventTypeId") REFERENCES "public"."Host"("userId", "eventTypeId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."HostLocation" ADD CONSTRAINT "HostLocation_credentialId_fkey" FOREIGN KEY ("credentialId") REFERENCES "public"."Credential"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."CalVideoSettings" ADD CONSTRAINT "CalVideoSettings_eventTypeId_fkey" FOREIGN KEY ("eventTypeId") REFERENCES "public"."EventType"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."EventType" ADD CONSTRAINT "EventType_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."EventType" ADD CONSTRAINT "EventType_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "public"."Profile"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."EventType" ADD CONSTRAINT "EventType_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "public"."Team"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."EventType" ADD CONSTRAINT "EventType_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "public"."EventType"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."EventType" ADD CONSTRAINT "EventType_scheduleId_fkey" FOREIGN KEY ("scheduleId") REFERENCES "public"."Schedule"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."EventType" ADD CONSTRAINT "EventType_instantMeetingScheduleId_fkey" FOREIGN KEY ("instantMeetingScheduleId") REFERENCES "public"."Schedule"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."EventType" ADD CONSTRAINT "EventType_secondaryEmailId_fkey" FOREIGN KEY ("secondaryEmailId") REFERENCES "public"."SecondaryEmail"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."EventType" ADD CONSTRAINT "EventType_restrictionScheduleId_fkey" FOREIGN KEY ("restrictionScheduleId") REFERENCES "public"."Schedule"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Credential" ADD CONSTRAINT "Credential_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Credential" ADD CONSTRAINT "Credential_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "public"."Team"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Credential" ADD CONSTRAINT "Credential_appId_fkey" FOREIGN KEY ("appId") REFERENCES "public"."App"("slug") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Credential" ADD CONSTRAINT "Credential_delegationCredentialId_fkey" FOREIGN KEY ("delegationCredentialId") REFERENCES "public"."DelegationCredential"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."DestinationCalendar" ADD CONSTRAINT "DestinationCalendar_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."DestinationCalendar" ADD CONSTRAINT "DestinationCalendar_eventTypeId_fkey" FOREIGN KEY ("eventTypeId") REFERENCES "public"."EventType"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."DestinationCalendar" ADD CONSTRAINT "DestinationCalendar_credentialId_fkey" FOREIGN KEY ("credentialId") REFERENCES "public"."Credential"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."DestinationCalendar" ADD CONSTRAINT "DestinationCalendar_delegationCredentialId_fkey" FOREIGN KEY ("delegationCredentialId") REFERENCES "public"."DelegationCredential"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."UserPassword" ADD CONSTRAINT "UserPassword_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."TravelSchedule" ADD CONSTRAINT "TravelSchedule_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."users" ADD CONSTRAINT "users_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "public"."Team"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."users" ADD CONSTRAINT "users_movedToProfileId_fkey" FOREIGN KEY ("movedToProfileId") REFERENCES "public"."Profile"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."NotificationsSubscriptions" ADD CONSTRAINT "NotificationsSubscriptions_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Profile" ADD CONSTRAINT "Profile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Profile" ADD CONSTRAINT "Profile_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "public"."Team"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Team" ADD CONSTRAINT "Team_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "public"."Team"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Team" ADD CONSTRAINT "Team_createdByOAuthClientId_fkey" FOREIGN KEY ("createdByOAuthClientId") REFERENCES "public"."PlatformOAuthClient"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."PracticeEncryptionKey" ADD CONSTRAINT "PracticeEncryptionKey_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "public"."Team"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."TreatmentResource" ADD CONSTRAINT "TreatmentResource_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "public"."Team"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."TreatmentResource" ADD CONSTRAINT "TreatmentResource_scheduleId_fkey" FOREIGN KEY ("scheduleId") REFERENCES "public"."Schedule"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."BookingResource" ADD CONSTRAINT "BookingResource_bookingId_fkey" FOREIGN KEY ("bookingId") REFERENCES "public"."Booking"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."BookingResource" ADD CONSTRAINT "BookingResource_resourceId_fkey" FOREIGN KEY ("resourceId") REFERENCES "public"."TreatmentResource"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."EventTypeMedicalProfile" ADD CONSTRAINT "EventTypeMedicalProfile_eventTypeId_fkey" FOREIGN KEY ("eventTypeId") REFERENCES "public"."EventType"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."SmartFillPatient" ADD CONSTRAINT "SmartFillPatient_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "public"."Team"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."SmartFillTask" ADD CONSTRAINT "SmartFillTask_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "public"."Team"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."SmartFillTask" ADD CONSTRAINT "SmartFillTask_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."SmartFillTask" ADD CONSTRAINT "SmartFillTask_eventTypeId_fkey" FOREIGN KEY ("eventTypeId") REFERENCES "public"."EventType"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."SmartFillInvite" ADD CONSTRAINT "SmartFillInvite_taskId_fkey" FOREIGN KEY ("taskId") REFERENCES "public"."SmartFillTask"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."SmartFillInvite" ADD CONSTRAINT "SmartFillInvite_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "public"."SmartFillPatient"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."RecallSettings" ADD CONSTRAINT "RecallSettings_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "public"."Team"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."RecallSettings" ADD CONSTRAINT "RecallSettings_eventTypeId_fkey" FOREIGN KEY ("eventTypeId") REFERENCES "public"."EventType"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."RecallHistory" ADD CONSTRAINT "RecallHistory_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "public"."Team"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."RecallHistory" ADD CONSTRAINT "RecallHistory_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "public"."SmartFillPatient"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."PvsSyncOutbox" ADD CONSTRAINT "PvsSyncOutbox_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "public"."Team"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."PvsConnectorCredential" ADD CONSTRAINT "PvsConnectorCredential_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "public"."Team"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."CreditBalance" ADD CONSTRAINT "CreditBalance_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "public"."Team"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."CreditBalance" ADD CONSTRAINT "CreditBalance_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."CreditPurchaseLog" ADD CONSTRAINT "CreditPurchaseLog_creditBalanceId_fkey" FOREIGN KEY ("creditBalanceId") REFERENCES "public"."CreditBalance"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."CreditExpenseLog" ADD CONSTRAINT "CreditExpenseLog_creditBalanceId_fkey" FOREIGN KEY ("creditBalanceId") REFERENCES "public"."CreditBalance"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."CreditExpenseLog" ADD CONSTRAINT "CreditExpenseLog_bookingUid_fkey" FOREIGN KEY ("bookingUid") REFERENCES "public"."Booking"("uid") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."OrganizationSettings" ADD CONSTRAINT "OrganizationSettings_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "public"."Team"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Membership" ADD CONSTRAINT "Membership_customRoleId_fkey" FOREIGN KEY ("customRoleId") REFERENCES "public"."Role"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Membership" ADD CONSTRAINT "Membership_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "public"."Team"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Membership" ADD CONSTRAINT "Membership_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."VerificationToken" ADD CONSTRAINT "VerificationToken_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "public"."Team"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."VerificationToken" ADD CONSTRAINT "VerificationToken_secondaryEmailId_fkey" FOREIGN KEY ("secondaryEmailId") REFERENCES "public"."SecondaryEmail"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."InstantMeetingToken" ADD CONSTRAINT "InstantMeetingToken_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "public"."Team"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."InstantMeetingToken" ADD CONSTRAINT "InstantMeetingToken_bookingId_fkey" FOREIGN KEY ("bookingId") REFERENCES "public"."Booking"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."BookingReference" ADD CONSTRAINT "BookingReference_bookingId_fkey" FOREIGN KEY ("bookingId") REFERENCES "public"."Booking"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."BookingReference" ADD CONSTRAINT "BookingReference_credentialId_fkey" FOREIGN KEY ("credentialId") REFERENCES "public"."Credential"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."BookingReference" ADD CONSTRAINT "BookingReference_delegationCredentialId_fkey" FOREIGN KEY ("delegationCredentialId") REFERENCES "public"."DelegationCredential"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Attendee" ADD CONSTRAINT "Attendee_bookingId_fkey" FOREIGN KEY ("bookingId") REFERENCES "public"."Booking"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Booking" ADD CONSTRAINT "Booking_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Booking" ADD CONSTRAINT "Booking_eventTypeId_fkey" FOREIGN KEY ("eventTypeId") REFERENCES "public"."EventType"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Booking" ADD CONSTRAINT "Booking_destinationCalendarId_fkey" FOREIGN KEY ("destinationCalendarId") REFERENCES "public"."DestinationCalendar"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Booking" ADD CONSTRAINT "Booking_reassignById_fkey" FOREIGN KEY ("reassignById") REFERENCES "public"."users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Tracking" ADD CONSTRAINT "Tracking_bookingId_fkey" FOREIGN KEY ("bookingId") REFERENCES "public"."Booking"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Schedule" ADD CONSTRAINT "Schedule_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Availability" ADD CONSTRAINT "Availability_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Availability" ADD CONSTRAINT "Availability_eventTypeId_fkey" FOREIGN KEY ("eventTypeId") REFERENCES "public"."EventType"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Availability" ADD CONSTRAINT "Availability_scheduleId_fkey" FOREIGN KEY ("scheduleId") REFERENCES "public"."Schedule"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."SelectedCalendar" ADD CONSTRAINT "SelectedCalendar_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."SelectedCalendar" ADD CONSTRAINT "SelectedCalendar_credentialId_fkey" FOREIGN KEY ("credentialId") REFERENCES "public"."Credential"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."SelectedCalendar" ADD CONSTRAINT "SelectedCalendar_delegationCredentialId_fkey" FOREIGN KEY ("delegationCredentialId") REFERENCES "public"."DelegationCredential"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."SelectedCalendar" ADD CONSTRAINT "SelectedCalendar_eventTypeId_fkey" FOREIGN KEY ("eventTypeId") REFERENCES "public"."EventType"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."EventTypeCustomInput" ADD CONSTRAINT "EventTypeCustomInput_eventTypeId_fkey" FOREIGN KEY ("eventTypeId") REFERENCES "public"."EventType"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Payment" ADD CONSTRAINT "Payment_appId_fkey" FOREIGN KEY ("appId") REFERENCES "public"."App"("slug") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Payment" ADD CONSTRAINT "Payment_bookingId_fkey" FOREIGN KEY ("bookingId") REFERENCES "public"."Booking"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Webhook" ADD CONSTRAINT "Webhook_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Webhook" ADD CONSTRAINT "Webhook_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "public"."Team"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Webhook" ADD CONSTRAINT "Webhook_eventTypeId_fkey" FOREIGN KEY ("eventTypeId") REFERENCES "public"."EventType"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Webhook" ADD CONSTRAINT "Webhook_platformOAuthClientId_fkey" FOREIGN KEY ("platformOAuthClientId") REFERENCES "public"."PlatformOAuthClient"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Webhook" ADD CONSTRAINT "Webhook_appId_fkey" FOREIGN KEY ("appId") REFERENCES "public"."App"("slug") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ApiKey" ADD CONSTRAINT "ApiKey_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ApiKey" ADD CONSTRAINT "ApiKey_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "public"."Team"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ApiKey" ADD CONSTRAINT "ApiKey_appId_fkey" FOREIGN KEY ("appId") REFERENCES "public"."App"("slug") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."RateLimit" ADD CONSTRAINT "RateLimit_apiKeyId_fkey" FOREIGN KEY ("apiKeyId") REFERENCES "public"."ApiKey"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."HashedLink" ADD CONSTRAINT "HashedLink_eventTypeId_fkey" FOREIGN KEY ("eventTypeId") REFERENCES "public"."EventType"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Account" ADD CONSTRAINT "Account_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Session" ADD CONSTRAINT "Session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Feedback" ADD CONSTRAINT "Feedback_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."WebhookScheduledTriggers" ADD CONSTRAINT "WebhookScheduledTriggers_webhookId_fkey" FOREIGN KEY ("webhookId") REFERENCES "public"."Webhook"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."WebhookScheduledTriggers" ADD CONSTRAINT "WebhookScheduledTriggers_bookingId_fkey" FOREIGN KEY ("bookingId") REFERENCES "public"."Booking"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."BookingSeat" ADD CONSTRAINT "BookingSeat_bookingId_fkey" FOREIGN KEY ("bookingId") REFERENCES "public"."Booking"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."BookingSeat" ADD CONSTRAINT "BookingSeat_attendeeId_fkey" FOREIGN KEY ("attendeeId") REFERENCES "public"."Attendee"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."VerifiedNumber" ADD CONSTRAINT "VerifiedNumber_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."VerifiedNumber" ADD CONSTRAINT "VerifiedNumber_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "public"."Team"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."VerifiedEmail" ADD CONSTRAINT "VerifiedEmail_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."VerifiedEmail" ADD CONSTRAINT "VerifiedEmail_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "public"."Team"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."UserFeatures" ADD CONSTRAINT "UserFeatures_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."UserFeatures" ADD CONSTRAINT "UserFeatures_featureId_fkey" FOREIGN KEY ("featureId") REFERENCES "public"."Feature"("slug") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."TeamFeatures" ADD CONSTRAINT "TeamFeatures_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "public"."Team"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."TeamFeatures" ADD CONSTRAINT "TeamFeatures_featureId_fkey" FOREIGN KEY ("featureId") REFERENCES "public"."Feature"("slug") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."OAuthClient" ADD CONSTRAINT "OAuthClient_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."AccessCode" ADD CONSTRAINT "AccessCode_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "public"."OAuthClient"("clientId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."AccessCode" ADD CONSTRAINT "AccessCode_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."AccessCode" ADD CONSTRAINT "AccessCode_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "public"."Team"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."CalendarCache" ADD CONSTRAINT "CalendarCache_credentialId_fkey" FOREIGN KEY ("credentialId") REFERENCES "public"."Credential"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."OutOfOfficeEntry" ADD CONSTRAINT "OutOfOfficeEntry_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."OutOfOfficeEntry" ADD CONSTRAINT "OutOfOfficeEntry_toUserId_fkey" FOREIGN KEY ("toUserId") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."OutOfOfficeEntry" ADD CONSTRAINT "OutOfOfficeEntry_reasonId_fkey" FOREIGN KEY ("reasonId") REFERENCES "public"."OutOfOfficeReason"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."OutOfOfficeReason" ADD CONSTRAINT "OutOfOfficeReason_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."UserHolidaySettings" ADD CONSTRAINT "UserHolidaySettings_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."PlatformOAuthClient" ADD CONSTRAINT "PlatformOAuthClient_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "public"."Team"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."PlatformAuthorizationToken" ADD CONSTRAINT "PlatformAuthorizationToken_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."PlatformAuthorizationToken" ADD CONSTRAINT "PlatformAuthorizationToken_platformOAuthClientId_fkey" FOREIGN KEY ("platformOAuthClientId") REFERENCES "public"."PlatformOAuthClient"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."AccessToken" ADD CONSTRAINT "AccessToken_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."AccessToken" ADD CONSTRAINT "AccessToken_platformOAuthClientId_fkey" FOREIGN KEY ("platformOAuthClientId") REFERENCES "public"."PlatformOAuthClient"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."RefreshToken" ADD CONSTRAINT "RefreshToken_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."RefreshToken" ADD CONSTRAINT "RefreshToken_platformOAuthClientId_fkey" FOREIGN KEY ("platformOAuthClientId") REFERENCES "public"."PlatformOAuthClient"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."DSyncData" ADD CONSTRAINT "DSyncData_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "public"."OrganizationSettings"("organizationId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."DSyncTeamGroupMapping" ADD CONSTRAINT "DSyncTeamGroupMapping_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "public"."Team"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."DSyncTeamGroupMapping" ADD CONSTRAINT "DSyncTeamGroupMapping_directoryId_fkey" FOREIGN KEY ("directoryId") REFERENCES "public"."DSyncData"("directoryId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."SecondaryEmail" ADD CONSTRAINT "SecondaryEmail_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ManagedOrganization" ADD CONSTRAINT "ManagedOrganization_managedOrganizationId_fkey" FOREIGN KEY ("managedOrganizationId") REFERENCES "public"."Team"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ManagedOrganization" ADD CONSTRAINT "ManagedOrganization_managerOrganizationId_fkey" FOREIGN KEY ("managerOrganizationId") REFERENCES "public"."Team"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."PlatformBilling" ADD CONSTRAINT "PlatformBilling_managerBillingId_fkey" FOREIGN KEY ("managerBillingId") REFERENCES "public"."PlatformBilling"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."PlatformBilling" ADD CONSTRAINT "PlatformBilling_id_fkey" FOREIGN KEY ("id") REFERENCES "public"."Team"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."AttributeOption" ADD CONSTRAINT "AttributeOption_attributeId_fkey" FOREIGN KEY ("attributeId") REFERENCES "public"."Attribute"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Attribute" ADD CONSTRAINT "Attribute_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "public"."Team"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."AttributeToUser" ADD CONSTRAINT "AttributeToUser_memberId_fkey" FOREIGN KEY ("memberId") REFERENCES "public"."Membership"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."AttributeToUser" ADD CONSTRAINT "AttributeToUser_attributeOptionId_fkey" FOREIGN KEY ("attributeOptionId") REFERENCES "public"."AttributeOption"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."AttributeToUser" ADD CONSTRAINT "AttributeToUser_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "public"."users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."AttributeToUser" ADD CONSTRAINT "AttributeToUser_createdByDSyncId_fkey" FOREIGN KEY ("createdByDSyncId") REFERENCES "public"."DSyncData"("directoryId") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."AttributeToUser" ADD CONSTRAINT "AttributeToUser_updatedById_fkey" FOREIGN KEY ("updatedById") REFERENCES "public"."users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."AttributeToUser" ADD CONSTRAINT "AttributeToUser_updatedByDSyncId_fkey" FOREIGN KEY ("updatedByDSyncId") REFERENCES "public"."DSyncData"("directoryId") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."AssignmentReason" ADD CONSTRAINT "AssignmentReason_bookingId_fkey" FOREIGN KEY ("bookingId") REFERENCES "public"."Booking"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."DelegationCredential" ADD CONSTRAINT "DelegationCredential_workspacePlatformId_fkey" FOREIGN KEY ("workspacePlatformId") REFERENCES "public"."WorkspacePlatform"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."DelegationCredential" ADD CONSTRAINT "DelegationCredential_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "public"."Team"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."EventTypeTranslation" ADD CONSTRAINT "EventTypeTranslation_eventTypeId_fkey" FOREIGN KEY ("eventTypeId") REFERENCES "public"."EventType"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."EventTypeTranslation" ADD CONSTRAINT "EventTypeTranslation_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES "public"."users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."EventTypeTranslation" ADD CONSTRAINT "EventTypeTranslation_updatedBy_fkey" FOREIGN KEY ("updatedBy") REFERENCES "public"."users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."WatchlistAudit" ADD CONSTRAINT "WatchlistAudit_watchlistId_fkey" FOREIGN KEY ("watchlistId") REFERENCES "public"."Watchlist"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."BookingReport" ADD CONSTRAINT "BookingReport_bookingUid_fkey" FOREIGN KEY ("bookingUid") REFERENCES "public"."Booking"("uid") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."BookingReport" ADD CONSTRAINT "BookingReport_reportedById_fkey" FOREIGN KEY ("reportedById") REFERENCES "public"."users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."BookingReport" ADD CONSTRAINT "BookingReport_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "public"."Team"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."BookingReport" ADD CONSTRAINT "BookingReport_watchlistId_fkey" FOREIGN KEY ("watchlistId") REFERENCES "public"."Watchlist"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."BookingReport" ADD CONSTRAINT "BookingReport_globalWatchlistId_fkey" FOREIGN KEY ("globalWatchlistId") REFERENCES "public"."Watchlist"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."WrongAssignmentReport" ADD CONSTRAINT "WrongAssignmentReport_bookingUid_fkey" FOREIGN KEY ("bookingUid") REFERENCES "public"."Booking"("uid") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."WrongAssignmentReport" ADD CONSTRAINT "WrongAssignmentReport_reportedById_fkey" FOREIGN KEY ("reportedById") REFERENCES "public"."users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."WrongAssignmentReport" ADD CONSTRAINT "WrongAssignmentReport_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "public"."Team"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."WrongAssignmentReport" ADD CONSTRAINT "WrongAssignmentReport_reviewedById_fkey" FOREIGN KEY ("reviewedById") REFERENCES "public"."users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."OrganizationOnboarding" ADD CONSTRAINT "OrganizationOnboarding_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."OrganizationOnboarding" ADD CONSTRAINT "OrganizationOnboarding_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "public"."Team"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."InternalNotePreset" ADD CONSTRAINT "InternalNotePreset_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "public"."Team"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."FilterSegment" ADD CONSTRAINT "FilterSegment_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."FilterSegment" ADD CONSTRAINT "FilterSegment_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "public"."Team"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."UserFilterSegmentPreference" ADD CONSTRAINT "UserFilterSegmentPreference_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."UserFilterSegmentPreference" ADD CONSTRAINT "UserFilterSegmentPreference_segmentId_fkey" FOREIGN KEY ("segmentId") REFERENCES "public"."FilterSegment"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."BookingInternalNote" ADD CONSTRAINT "BookingInternalNote_notePresetId_fkey" FOREIGN KEY ("notePresetId") REFERENCES "public"."InternalNotePreset"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."BookingInternalNote" ADD CONSTRAINT "BookingInternalNote_bookingId_fkey" FOREIGN KEY ("bookingId") REFERENCES "public"."Booking"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."BookingInternalNote" ADD CONSTRAINT "BookingInternalNote_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "public"."users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Role" ADD CONSTRAINT "Role_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "public"."Team"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."RolePermission" ADD CONSTRAINT "RolePermission_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "public"."Role"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."BookingAudit" ADD CONSTRAINT "BookingAudit_actorId_fkey" FOREIGN KEY ("actorId") REFERENCES "public"."AuditActor"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Agent" ADD CONSTRAINT "Agent_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Agent" ADD CONSTRAINT "Agent_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "public"."Team"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."CalAiPhoneNumber" ADD CONSTRAINT "CalAiPhoneNumber_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."CalAiPhoneNumber" ADD CONSTRAINT "CalAiPhoneNumber_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "public"."Team"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."CalAiPhoneNumber" ADD CONSTRAINT "CalAiPhoneNumber_inboundAgentId_fkey" FOREIGN KEY ("inboundAgentId") REFERENCES "public"."Agent"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."CalAiPhoneNumber" ADD CONSTRAINT "CalAiPhoneNumber_outboundAgentId_fkey" FOREIGN KEY ("outboundAgentId") REFERENCES "public"."Agent"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."TeamBilling" ADD CONSTRAINT "TeamBilling_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "public"."Team"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."OrganizationBilling" ADD CONSTRAINT "OrganizationBilling_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "public"."Team"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."SeatChangeLog" ADD CONSTRAINT "SeatChangeLog_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "public"."Team"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."SeatChangeLog" ADD CONSTRAINT "SeatChangeLog_processedInProrationId_fkey" FOREIGN KEY ("processedInProrationId") REFERENCES "public"."MonthlyProration"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."SeatChangeLog" ADD CONSTRAINT "SeatChangeLog_teamBillingId_fkey" FOREIGN KEY ("teamBillingId") REFERENCES "public"."TeamBilling"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."SeatChangeLog" ADD CONSTRAINT "SeatChangeLog_organizationBillingId_fkey" FOREIGN KEY ("organizationBillingId") REFERENCES "public"."OrganizationBilling"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."MonthlyProration" ADD CONSTRAINT "MonthlyProration_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "public"."Team"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."MonthlyProration" ADD CONSTRAINT "MonthlyProration_teamBillingId_fkey" FOREIGN KEY ("teamBillingId") REFERENCES "public"."TeamBilling"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."MonthlyProration" ADD CONSTRAINT "MonthlyProration_organizationBillingId_fkey" FOREIGN KEY ("organizationBillingId") REFERENCES "public"."OrganizationBilling"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."CalendarCacheEvent" ADD CONSTRAINT "CalendarCacheEvent_selectedCalendarId_fkey" FOREIGN KEY ("selectedCalendarId") REFERENCES "public"."SelectedCalendar"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."IntegrationAttributeSync" ADD CONSTRAINT "IntegrationAttributeSync_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "public"."Team"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."IntegrationAttributeSync" ADD CONSTRAINT "IntegrationAttributeSync_credentialId_fkey" FOREIGN KEY ("credentialId") REFERENCES "public"."Credential"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."AttributeSyncRule" ADD CONSTRAINT "AttributeSyncRule_integrationAttributeSyncId_fkey" FOREIGN KEY ("integrationAttributeSyncId") REFERENCES "public"."IntegrationAttributeSync"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."AttributeSyncFieldMapping" ADD CONSTRAINT "AttributeSyncFieldMapping_attributeId_fkey" FOREIGN KEY ("attributeId") REFERENCES "public"."Attribute"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."AttributeSyncFieldMapping" ADD CONSTRAINT "AttributeSyncFieldMapping_integrationAttributeSyncId_fkey" FOREIGN KEY ("integrationAttributeSyncId") REFERENCES "public"."IntegrationAttributeSync"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."_user_eventtype" ADD CONSTRAINT "_user_eventtype_A_fkey" FOREIGN KEY ("A") REFERENCES "public"."EventType"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."_user_eventtype" ADD CONSTRAINT "_user_eventtype_B_fkey" FOREIGN KEY ("B") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."_PlatformOAuthClientToUser" ADD CONSTRAINT "_PlatformOAuthClientToUser_A_fkey" FOREIGN KEY ("A") REFERENCES "public"."PlatformOAuthClient"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."_PlatformOAuthClientToUser" ADD CONSTRAINT "_PlatformOAuthClientToUser_B_fkey" FOREIGN KEY ("B") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;


-- Baseline Prisma migration history
CREATE TABLE IF NOT EXISTS "_prisma_migrations" (
    "id" VARCHAR(36) PRIMARY KEY,
    "checksum" VARCHAR(64) NOT NULL,
    "finished_at" TIMESTAMPTZ,
    "migration_name" VARCHAR(255) NOT NULL,
    "logs" TEXT,
    "rolled_back_at" TIMESTAMPTZ,
    "started_at" TIMESTAMPTZ NOT NULL DEFAULT now(),
    "applied_steps_count" INTEGER NOT NULL DEFAULT 0
);

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT '2eebac0e-2971-43e1-a24a-b4b32e3781c1', 'e943b277074ff79ecedf452cca9e2123e0f889a762c148190492bd3bd3f4e617', NOW(), '20210605225044_init', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20210605225044_init');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT '733953c6-b185-452c-b1a3-784ec091a41c', 'cd548ab5297379acc8c074c5b0dc4240a6d14886dc1df2a5f61a75db135d661e', NOW(), '20210605225507_added_bookings', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20210605225507_added_bookings');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT 'af832bce-e7ce-4a9b-a8ee-3d31310b0d4e', 'fe081a902ad4b5ab0d6e23f19fe50faefb824f3ec5645e16ccfdfc87141a25e1', NOW(), '20210606013704_made_booking_uid_unique', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20210606013704_made_booking_uid_unique');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT '898effcc-17c8-4edc-8046-d92abe7f8dba', 'c4dea6e6cd8e16ccc8263f1e2e36b80497552c3a8516894314f1cbc3a5f6e550', NOW(), '20210613133618_add_team_membership_verification', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20210613133618_add_team_membership_verification');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT 'f113e8e2-4456-4b7d-84d9-bed053d9a359', 'ea7646068dab402c17537cce3c03909551246923f3d1d37f420612a6717e428a', NOW(), '20210615140247_added_selected_calendar', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20210615140247_added_selected_calendar');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT 'af748e3e-9619-4f19-bf09-11b18c5e7756', 'bd9f9370a1d0cad7e6d5038fa318812e7e7554df8efbc470e48355fb2b82a8a1', NOW(), '20210615142134_added_custom_event_name', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20210615142134_added_custom_event_name');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT '4d42a131-2c97-4a43-87f4-e89c9b336b40', '2142e2a0e5675d8be719d7bdd5893f6e2368737e8500c6ebdb4f4505d3a7578f', NOW(), '20210615153546_added_buffer_time', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20210615153546_added_buffer_time');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT '7bc39de6-d1dc-426b-8175-afc27de9cb2a', 'ea6c64c18f05b8b871a518de6c7a0eefd31cf04ae43047e2fd8956a7b0423468', NOW(), '20210615153759_add_email_verification_column', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20210615153759_add_email_verification_column');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT '9ae93730-ac11-4c52-a428-42b8f5e88731', '23c29b6e264d2a8c73c7842e2454334ad6f51e00415089f3d6a8bc4eabcdbbde', NOW(), '20210618140954_added_event_type_custom', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20210618140954_added_event_type_custom');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT '32f796b6-659a-43a7-8784-048c99777312', 'c6df245d6b1b967ce00be1bf3160724fe628e1b75c15e426b533e6d25a6de17f', NOW(), '20210628153550_password_reset_request', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20210628153550_password_reset_request');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT '39e80fa1-0f59-4c84-bfba-a521ccff0d8a', '935b9a25880cab758dd26af73ce2beb17ab34459e080dcab0e3caffeee6badae', NOW(), '20210629160507_hide_branding', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20210629160507_hide_branding');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT 'b248e546-309d-4d2d-a966-28edda1c3777', '71ee70b60e8c94c674bee5926da662aa96c2a325f82e1e7249c43d0958c49f7b', NOW(), '20210630014738_schedule_availability', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20210630014738_schedule_availability');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT 'a4e5f28b-906c-430c-b752-bea7a60c6026', 'd97c97032a70c58163024becb4c69ab43c1e6fd0916ae2e971ecc82abe683cd4', NOW(), '20210709231256_add_user_theme', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20210709231256_add_user_theme');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT 'd9032818-1ab2-4cb2-a0be-b3e49d59f846', '2d31657f49643c2248cf4472a0c389de929340350cdf853017684a3de146be36', NOW(), '20210714151216_event_type_period_settings', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20210714151216_event_type_period_settings');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT '16675e55-2a49-4847-882c-71cf42aebcce', 'cd5ab82bd8491dd19d9c7a3a25ddc78302c688bb2618c5796c79205019b43bb1', NOW(), '20210717120159_booking_confirmation', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20210717120159_booking_confirmation');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT '2708a7b3-d97b-423d-b720-2e8026bd4052', '4668eb7fd8eb60d26161ef42ae3e4948ec260111b03f92a03c0e4f53e1c6bdb5', NOW(), '20210718184017_reminder_mails', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20210718184017_reminder_mails');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT '1aba2556-6822-4adf-92eb-51e9ab90534e', 'ff22b8a74c0bc885d134d28fa0a38a4706008b268abc888eaa92a90e78004c56', NOW(), '20210722225431_minimum_booking_notice', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20210722225431_minimum_booking_notice');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT '1abd5452-94c8-44e0-9bc6-5485cb5979e4', '11aba67d15c03b9276d07af6a161d7f657c6b41f452eb8633e492c23b676b6f7', NOW(), '20210725123357_add_location_to_booking', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20210725123357_add_location_to_booking');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT 'cf9536e8-b81c-406c-9a82-c3362218c8fe', '6b85d2c7bdbd2dcfc3dec8110046dd80e3db581befbd7dd70e019e20372ad1c7', NOW(), '20210813142905_event_payment', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20210813142905_event_payment');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT '59e959e8-a622-4092-a855-7ecd566b9577', 'e2457d7ed2a788768c13c66c51b47481e1e310b03e5bc785d76bacf78cd69f57', NOW(), '20210813194355_add_slug_to_team', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20210813194355_add_slug_to_team');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT '4802854a-e8b1-4163-8a17-abb7fa391a18', '79f39193fec9947daa547c057572d7996188219cbe8425ac9fc1122f45263ed8', NOW(), '20210814175645_custom_inputs_type_enum', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20210814175645_custom_inputs_type_enum');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT '2e96332d-a208-494f-993f-9ffcbea8cced', 'e7a2a7fa8c60c1cf50ee1edba5897df9b4e8cc8f547c75402fb325ce5284588c', NOW(), '20210820130519_add_placeholder_to_custom_event_types', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20210820130519_add_placeholder_to_custom_event_types');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT 'e32ebca3-253d-4ea8-82f4-d4395dcbdfaf', 'e06d3a1bea3d17abd09db94f51d5c123a37c33ceaddf249dc9fa21aaab5ac60c', NOW(), '20210824054220_add_bio_branding_logo_to_team', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20210824054220_add_bio_branding_logo_to_team');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT '73db83d0-623e-4bd2-b3e3-4c001bdde3bc', '4b9697e3bebd63164bffd35ddb973c6112e830420351dd9d2dec409b1f327934', NOW(), '20210825004801_schedule_schema', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20210825004801_schedule_schema');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT '74fb1b51-f027-41c5-9f3f-1b9eef64d914', '8ee37158e9e822f3f266241a4fd5de53ec3448f891069c309c6a788cd5cca33d', NOW(), '20210830064354_add_unique_to_team_slug', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20210830064354_add_unique_to_team_slug');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT 'f5808738-86ed-48cb-8ac9-e6b4acfbb9b0', 'ad6f53508aada9f7680bc4a17823719f3508b26955d26762285d0f8536b5db0e', NOW(), '20210902112455_event_type_unique_user_id_slug', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20210902112455_event_type_unique_user_id_slug');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT 'c83d3212-2ae2-4de6-ac15-c0f19bbc009b', 'f137d0f6c5f097ef9bd841c11b4874273e4c67794c504016b55172cb0e79e5ee', NOW(), '20210902121313_user_plan', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20210902121313_user_plan');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT 'c932bcb7-05ea-4062-91a7-16281cc54701', 'c51dd74614855fa749dad1f6df452d7050821a1af38f83e0ccea8135eab4ceb9', NOW(), '20210902125945_user_username_unique', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20210902125945_user_username_unique');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT '47fae5f5-d6f4-4c82-88d0-10f307dfea6a', 'a7b26bed96bd0ea5de0d653fc0fed73a7b6ba04db5a80826929e5a2330553fe9', NOW(), '20210904162403_add_booking_status_enum', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20210904162403_add_booking_status_enum');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT '6f3c8172-8371-49b0-86e3-ba483b289d7f', 'b5d8afaddde993d3dc988794e1956719236266e2f3db30fd851cdc47a8ec2a00', NOW(), '20210908042159_teams_feature', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20210908042159_teams_feature');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT '2a497eb9-b8a8-421c-b15c-37a90553423f', '30fd9a6ac39902afb146cd4d25e2603091013164d7bc6f4c8d78fc9c89894e29', NOW(), '20210908220336_add_daily_data_table', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20210908220336_add_daily_data_table');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT '1efa4a36-6082-4744-bed7-64a8625823cb', '9dc5ad70517711ee935f9479dd7acd0ba47ce64bef79bc642af56112612b74b5', NOW(), '20210908235519_undo_unique_user_id_slug', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20210908235519_undo_unique_user_id_slug');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT 'e6692c12-45d6-43dc-9f81-0b17f1bb0b8b', '25218fac49b0b3d3cf820828686099e5eb36f85c68d462497ba885f009daa3ea', NOW(), '20210913211650_add_meeting_info', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20210913211650_add_meeting_info');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT '25a1e391-cd49-4933-a0f7-674b84d8349c', '335f2697a358a00a0a7510fc30d60beacecca09a882670424174c5a0c54cf136', NOW(), '20210918013258_add_two_factor_fields', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20210918013258_add_two_factor_fields');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT '745c6306-52be-46ed-92d7-c7eb493809e9', 'ad6f53508aada9f7680bc4a17823719f3508b26955d26762285d0f8536b5db0e', NOW(), '20210918152354_user_id_slug_fix', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20210918152354_user_id_slug_fix');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT 'c60b3d07-8228-4b4d-afd4-26dc97d6e7ba', 'd07fcfec8e611967adb1b2daf7f4b7b567fba53d19f3622276a04acdc546bdd5', NOW(), '20210919174415_add_user_locale', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20210919174415_add_user_locale');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT 'ceea633f-bb74-4bf5-a5aa-3a4571fa39d6', '26c9dcbbf58fdc9a99da007fc88bb69b6a5d03cde7f9bce697377dacd6113d99', NOW(), '20210922004424_add_disable_guests_to_event_type', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20210922004424_add_disable_guests_to_event_type');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT 'e5eb678b-091e-42a4-b797-802fc8cc19d4', 'db1a9e5e526a64e4a6f6f570ce4f919eca81151f44c714c33ea4251c6282a3ca', NOW(), '20211004231654_add_webhook_model', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20211004231654_add_webhook_model');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT '27442393-b2ac-450c-996c-4a8ed76d1c66', '83502a79b6ab8dd31b49f124a886e0b9327dd5aaba4f081e71fe9d10be8ab486', NOW(), '20211011152041_non_optionals', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20211011152041_non_optionals');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT '38865885-2d76-4ac9-bb89-1d16e1f03a4c', 'dd66be3e2d9b3852cd75f04399026a322ac5d7cedbe7db0503e43296baf07c4b', NOW(), '20211028233838_add_user_webhooks_relation', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20211028233838_add_user_webhooks_relation');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT '140d16b0-118f-4870-8e98-af7272d2df01', 'eb82e0c9b0b7441a9ccf3eee7bfa057dde474280ae5db7d88ecdd1fa98528e30', NOW(), '20211101151249_update_rejected_bookings', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20211101151249_update_rejected_bookings');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT 'b6b3bdf6-55aa-4e2d-bc16-519abfc29216', '979f37a90916207866e58a47f9153e0083dedb841ad825d07f5cded4d29c7b2a', NOW(), '20211105200545_availability_start_and_end_time_as_time', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20211105200545_availability_start_and_end_time_as_time');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT 'aae4a480-eeca-4214-8da6-ac6c3f9478cd', 'ac0f9d41abbf4399d411d2b8d703f386726875439be0de25c15c0117074a2e6b', NOW(), '20211106121119_add_event_type_position', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20211106121119_add_event_type_position');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT '60ede887-139d-44a4-a386-ddef0d0ead8c', '83af5b4ab083ec37fa666b387256197625a3ec9377610a4ec8920e26b54665f6', NOW(), '20211110063531_add_custom_brand_color', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20211110063531_add_custom_brand_color');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT '2affc9f8-cb4e-47b9-9963-922a1fe22d35', '562d185ad7fe1246d2c1129b6207a787e8095427fc225ee44a4cecccc77f3f81', NOW(), '20211110142845_add_identity_provider_columns', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20211110142845_add_identity_provider_columns');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT 'e73df9ca-72dd-4ba3-a498-de380b762181', '02c9a235081692a0571cec3ce21b7d67df5eaad03e617e13446002376e897cb6', NOW(), '20211111013358_period_type_enum', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20211111013358_period_type_enum');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT '4c0c5787-702c-4203-8b61-d3a6c4674894', '98b61ad6a2148f20131381e28ecca578c6d9db1c84dbb04a32bc7bfb401bb73e', NOW(), '20211112145539_add_saml_login', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20211112145539_add_saml_login');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT '5c2dc5cb-6258-4976-acfa-a0ae6629a573', '5774760cf508959cea4370297fa3706943cb4daf3009b4ca5c84a25b77380099', NOW(), '20211115182559_availability_issue', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20211115182559_availability_issue');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT 'b9658af2-8319-4090-ae85-8e2e4503ac47', '1ce1bb7e945711845f971adc6dff0b6e29c89ab540cdce773c2f1661400de3d4', NOW(), '20211120211639_add_payload_template', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20211120211639_add_payload_template');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT 'a4e91bbe-9575-4d15-825a-dfb956de22b0', '319c3dc969306fdb594f37117f09416fab3d460f19a389b66963c59117d95253', NOW(), '20211207010154_add_destination_calendar', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20211207010154_add_destination_calendar');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT 'fb21b596-5b80-4b5f-98a6-795433225911', 'e916fbeff0f878f8a07d9f6aa3659327a1fb54116eed539c964d97a9ea18bea3', NOW(), '20211209201138_membership_admin_role', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20211209201138_membership_admin_role');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT 'ea33e99d-fbd2-4379-b8d5-52a33e0fe33b', '2642abb472475b383f5ca5364329658194b8f2ba6f11ac54cb75a7be9a84672d', NOW(), '20211210182230_add_invited_to', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20211210182230_add_invited_to');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT '95c471c9-1f42-4877-b58a-6a804fc7fd53', '105bdf45881e8a0e6e1e5cd541709e8dded8578e4ef977af9ba8cf0039d49ef8', NOW(), '20211217201940_upgrade_to_v3', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20211217201940_upgrade_to_v3');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT '2b9ecdc3-ca96-4396-8deb-212da11ecfaa', 'c2b6b16eb568a1e49c0ae27198c8a82bc658945ebf3115c111fda6208bbd4f43', NOW(), '20211217215952_added_slot_interval_to_event_type', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20211217215952_added_slot_interval_to_event_type');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT '843df382-ba8a-482b-8f03-daaa4daee443', 'e956233fef389a6c7cb1e7f19813d53f1739ec2e4ba16a5162a7dcb6dea5f84a', NOW(), '20211220192703_email_to_lowercase', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20211220192703_email_to_lowercase');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT 'cfd53b5f-62bb-4a85-b46d-0d6b719ce77d', '2b50ff99d63e42965f20301f7ec9b0e921a1d26e500c0d9e0c11d7a22404c72f', NOW(), '20211222174947_placeholder', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20211222174947_placeholder');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT '9bbff6d7-a3e0-4072-9402-a679a7d44390', 'd9b14bdb8271845ef292f2e5a5289569f0817959e562aef918817be5a942a24d', NOW(), '20211222181246_add_sc_address', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20211222181246_add_sc_address');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT '40d0c68f-e593-4caf-a748-987e95b6f0d1', 'fa7eea8b947971a6351afb4721117d15328a79676f5d07f545b8bf727c6d9332', NOW(), '20211228004752_adds_user_metadata', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20211228004752_adds_user_metadata');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT '7f96f032-593b-4d97-a13b-786b54d65a51', '9df7a36c799445569b9fc593dd21fcab44685f9dbe85e32668d6314a8110fc44', NOW(), '20211231142312_add_user_on_delete_cascade', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20211231142312_add_user_on_delete_cascade');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT '83519361-c9ac-4f2e-9c7c-941a28dbc1b1', 'deb2ab9ef565670edbc1d07c1670ba3878fb8605f74ab22e0a8cf5fa6cd70234', NOW(), '20220105104913_add_away_field', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20220105104913_add_away_field');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT 'fbca2cd8-5ed0-4188-a7a4-d3b8cf762bc3', 'fdc5c4c7de8f4e0263e54a4b4ae9cf8a8c719d0a1733a62bb350bcffd1250c0b', NOW(), '20220113145333_rename_column_sc_address_to_smart_contract_address', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20220113145333_rename_column_sc_address_to_smart_contract_address');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT '9e40385b-ba2e-46ca-b7c5-f5e1a018189e', '6c51f54631d2b85ecd1de135bc6f8917b112f39d64aae2007572332a1d39c710', NOW(), '20220117193242_trial_users_by_default', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20220117193242_trial_users_by_default');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT 'e90c3412-b63a-4ebc-9522-a9213f99f814', '79a5fa42ea63289582808c43995d02ebe8f762c9e2dde03031f8dc48cf04b743', NOW(), '20220121210720_add_cancellation_reason', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20220121210720_add_cancellation_reason');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT 'd35fde4a-5228-4345-b412-e721cee1afdc', '4e1f8dabb07e92ba06636e42068598818d980f44f1cbc355a2b059332763345f', NOW(), '20220125035907_add_attendee_locale', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20220125035907_add_attendee_locale');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT '09aefa92-f612-45c0-91c2-5bf119030b81', '9874229ef321e19f80eca4f7b5ccb3a0804842a70f533e7bdb13f6a3b6336624', NOW(), '20220131170110_add_metadata_column_to_event_type', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20220131170110_add_metadata_column_to_event_type');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT '502510bb-e18f-4adf-9053-d8d50815f6a2', '385bd1c58ef9fd8fd840e73c5f71f40fbec810adfcb783b4f37217a6640f0785', NOW(), '20220205135022_add_verified_column', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20220205135022_add_verified_column');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT 'b3cea8ac-1e26-4e9a-9a0a-fccb85b0a667', '5e10b0f68233673c9ff5e3c5795d246c417d000076327ce8936d3c80c1fcbe18', NOW(), '20220209082843_add_rejection_reason', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20220209082843_add_rejection_reason');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT 'b83a4a82-a72a-4685-8ac3-5ef02953659b', '138dbac34dbe2b5105c79037580dd1dfbd1e63266e60eb89d17b07ad5092ce9f', NOW(), '20220217093836_add_webhook_for_event', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20220217093836_add_webhook_for_event');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT 'f1a02b18-ec15-434b-9840-1d8f219669da', 'ef2aa301b62e2eeff9d9f0c71dd795bc91f61bb27bbe29bc5b2fb88f9c342229', NOW(), '20220228122419_add_time_format', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20220228122419_add_time_format');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT 'ab1b2cb2-dd66-419e-93a2-00d15b975b95', '80d9e25072006bee228a27b685e65082ebcbd21ca85893fe4109c830510bb5d8', NOW(), '20220302035831_add_before_and_after_event_buffer', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20220302035831_add_before_and_after_event_buffer');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT 'd1325a00-0c90-46ae-a20a-81ab3fbe2856', 'f4ff676391e001f19195a416b8c47028f616dc103335847741e759454c40ca8a', NOW(), '20220302110201_add_dark_mode_brand_color', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20220302110201_add_dark_mode_brand_color');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT '27dab3a7-3433-4a49-b87d-d8df7ac2eec9', '35c10c4e71a9bcb4a0a948bfccbed30015741ffeecd4a61c3b9938ace8df59fc', NOW(), '20220303171305_adds_user_trial_ends_at', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20220303171305_adds_user_trial_ends_at');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT '6add1e79-503a-4834-93ef-6e3d9f50f107', '7788b8896d63f27ba216a46cc1fa11b8190e7e89338c73886c07f29d4f1d7573', NOW(), '20220305233635_availability_schedules', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20220305233635_availability_schedules');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT 'e95eff9a-4ddf-4613-aadb-fad81583000c', '1148092037e617fc25e7d6cf228d960f5a8fa70f0407c163033bc0697059c13b', NOW(), '20220305233635_rename_indexes', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20220305233635_rename_indexes');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT '114a5e22-59f2-422c-859a-c110ba4dc27b', '1888ccd0ef698974fe8769f8b78d646492b952ef9a86542a2264e2e40e63c0bc', NOW(), '20220306010113_renames_verification_request_to_verification_token', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20220306010113_renames_verification_request_to_verification_token');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT '357b6eab-aa93-419b-9dbd-79a82be83721', '6d0d8bd0366812763fddc227daa67f62357c4abe7fd7262fa9401a99e25ba90a', NOW(), '20220323033335_reschedule_fields_to_bookings_table', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20220323033335_reschedule_fields_to_bookings_table');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT '80c0492e-6889-49af-95ed-8971a262072c', '0eeadefe21baf1bf403028e21f828c8c2abfd66163be74b0cecb43a5870f8dca', NOW(), '20220323162642_events_hide_notes', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20220323162642_events_hide_notes');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT '57916fa0-914f-4811-b4cd-6b5000a07994', 'fde3fb56246133f119104e776772a4f248ae7326ba355678e864cc9eb2c6b6b5', NOW(), '20220328185001_soft_delete_booking_references', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20220328185001_soft_delete_booking_references');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT '88c53e45-6bef-422c-8b3b-23661e61256c', 'ae2f687b4de00d8297d7ad123998708be5e0bd078b1c13d2b41ae98df18ad23e', NOW(), '20220330071743_add_dynamic_group_booking', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20220330071743_add_dynamic_group_booking');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT '81fb799e-12bb-4d03-b690-7dd2b6edadb9', '1f8ace6ebe1fa7d8f1a285acccfde777531868f4e70b5d2130e0b0eabd169ec0', NOW(), '20220404132522_redirect_url', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20220404132522_redirect_url');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT 'bf61c09d-10be-4be4-bc0c-656a1a473fcd', '5cf407dbe019463af133f891cb3e434337b0c0c29cc5bb4d3a93a5ce6015b807', NOW(), '20220409155714_impersonate_users', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20220409155714_impersonate_users');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT 'e966d439-0bb4-44b8-bdd1-475f3bf892d9', '554ccccca38cd6437278b86f030292e714ff65eeca42708af16fb6d873ecb24a', NOW(), '20220409195425_index_event_types_team_id_slug', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20220409195425_index_event_types_team_id_slug');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT '1c0a7c55-0691-48a3-ac4b-573ea577e5f6', '3fbe71c009ea425d62b0c060a1af2de2bf6029f04990f5f5dc0f14be2ba227af', NOW(), '20220412172742_payment_on_delete_cascade', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20220412172742_payment_on_delete_cascade');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT '0179f196-249b-4586-91fe-cd6818974dc2', 'b5fa1ff4c1620a72886a7eb7f16c92c37c9d9ec53ccff13230c6060b545fae0b', NOW(), '20220413002425_adds_api_keys', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20220413002425_adds_api_keys');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT 'f9d91e4a-9b7e-48e0-a036-89bf77b62647', '9d0c2a5079ceaecdfc95125c9a44fd31ba3a9d29986ed1794971483f701fd761', NOW(), '20220413173832_add_seats_to_event_type_model', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20220413173832_add_seats_to_event_type_model');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT '613bf388-1b32-4bed-9b5b-e4e4fbf4c158', '8573ee0ecaebea344f1f57b7e8e8e55f954f02888f3c64556d4076840a1183db', NOW(), '20220420152505_add_hashed_event_url', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20220420152505_add_hashed_event_url');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT 'fbb74036-10fa-42b7-901e-74f5e7181135', 'a299ab8d983f92bc902670f4344638e82988273dfe471105194cd2455094433c', NOW(), '20220420230104_update_booking_id_constrain', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20220420230104_update_booking_id_constrain');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT '33492fee-ddb0-4659-804e-4e79aa5bca32', '69aefa7b67faf5ca60f747f8dfa7d9d9fedce7f5f6810eb879cdffbafbb4eda7', NOW(), '20220420230105_rename_verification_token_unique_id', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20220420230105_rename_verification_token_unique_id');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT '9fc86dec-35c2-45ea-afaa-f466163dfd8c', 'cff612da89db52b7867f4d5168d7288e60600d46cf835c0b3dd88b85c38fdddb', NOW(), '20220423022403_recurring_event', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20220423022403_recurring_event');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT '0591bb23-e5a8-4cc3-9a60-a7701e0d5777', 'f666df068f37eaf72130c517b4ac20d47adf54784856b3605201329ff957b484', NOW(), '20220423175732_added_next_auth_models', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20220423175732_added_next_auth_models');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT 'a283e491-94f4-419a-8bbf-c11f390f78d6', 'd9813419346f834f7484f9eda808bf4cdaf0407c3c619bd25921ef6be988fa67', NOW(), '20220502154345_adds_apps', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20220502154345_adds_apps');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT '2ed8e961-1497-4df3-91ae-d5ecf56a05b0', '0139ca10c99733b5e4f11d5b3f29e709a429874c1eb46d462499d4904eccf0da', NOW(), '20220503183922_add_external_calendar_id_to_booking_reference', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20220503183922_add_external_calendar_id_to_booking_reference');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT '214e1391-af5d-43e0-9cdb-02714909baf9', '51f08ccf5437a6582c9d0c6a1d876a45ee5a41c47add17776f600593bdea86b2', NOW(), '20220503194835_adds_app_relation_to_webhook_and_api_keys', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20220503194835_adds_app_relation_to_webhook_and_api_keys');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT 'c4bab160-0d2b-4c5c-bcf5-914f03ce17db', 'd4bf1b4dead648e08143c72df5c2e7750042840b5a702c052c3a35ac5a3d310e', NOW(), '20220511095513_add_custom_inputs_to_booking', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20220511095513_add_custom_inputs_to_booking');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT '006c1d94-d2a8-4da2-b1dd-833d186861ab', '350af87cd325ea520e3fb39208f244c1cfe15207b13551414f2380cb6c0fb914', NOW(), '20220513151152_adds_feedback_table', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20220513151152_adds_feedback_table');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT '7c6953a9-b45c-45bd-99cd-88ce77bbf43c', 'b13edd80b25f9d9de4ef2c6f71f37e1df33462bbb97cb9e9c98a48041d256863', NOW(), '20220518201335_add_user_relationship_to_feedback', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20220518201335_add_user_relationship_to_feedback');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT '996d00c3-d51c-4e1e-a352-3340bda25436', '0a7f8c36c226f9d9fef7ad9803364ae0bc849f1b0a4bf25fbbadc92bdf8e9ba5', NOW(), '20220525110759_add_user_impersonation_toggle', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20220525110759_add_user_impersonation_toggle');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT '8372ee6c-7dbb-4b1e-9c4b-5653fddb261a', '798d0df5e4c0b4b2fb802d589d70a35bfac86910c06a561c455dd999ddaa2fc4', NOW(), '20220525182228_cal_video_preinstalled', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20220525182228_cal_video_preinstalled');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT '0d99ec31-ca9c-4dca-b34d-1ff431fc8b2e', '4d29743a228401dcd8298beccaf59f5cc98cf807ed602f289afc90d80affd5c9', NOW(), '20220526151550_cascades_impersonations_on_user_delete', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20220526151550_cascades_impersonations_on_user_delete');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT 'cdc36dcf-2d3a-46ff-8087-0b339b99141d', 'd46e7d3c512164fd3235a7ba24d7f15cec7ba1ea3c6bf4c88ad1a3783604d7e6', NOW(), '20220604144700_fixes_booking_status', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20220604144700_fixes_booking_status');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT 'e274f2d4-0ded-4bf3-9cd7-74d2e944d4cd', 'dc1b470f106c488c3197acb3b7a5d798ff20650e00ba8f513cbd08317ee75b6f', NOW(), '20220604210102_removes_booking_confirmed_rejected', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20220604210102_removes_booking_confirmed_rejected');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT '84d7507e-a01b-4a5f-a93c-7030801f73c1', 'ddab9555b9c1bbdcdd72c1d69f1d4d3c6eba916992bc635e665f44c6e1c36d8b', NOW(), '20220614090326_add_webhook_secret', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20220614090326_add_webhook_secret');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT 'd666f1fe-9a09-4e94-9d05-fd652d573775', '42339d8c3266f5dc60c68a33da4170ed980751120923d8f3d586e2a3205eafa3', NOW(), '20220616072241_app_routing_forms', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20220616072241_app_routing_forms');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT 'f767a99a-b112-40be-bea9-a497e19914fc', '11cec2fdcef331465e916ba8af2896766ef035e69fe379c7ce514861c9de806a', NOW(), '20220620181226_add_all_userid_to_users', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20220620181226_add_all_userid_to_users');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT 'e200865b-860e-43f6-b551-4c709dd5ffa7', 'ad8b7ccd570a08bef1cf528b7abf9b143a550a5e6352cf4091de32d7c1ffd963', NOW(), '20220622110735_allow_one_schedule_to_apply_to_multiple_event_types', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20220622110735_allow_one_schedule_to_apply_to_multiple_event_types');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT '294bc24a-878c-497a-8acd-1409c15c220e', '233a47e96e4e705bd363d0f0090374dd55a532fdefcb79cff2a7dcc3acab8b8c', NOW(), '20220628184929_adds_missing_owner_relationship', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20220628184929_adds_missing_owner_relationship');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT '4bc3b630-1b81-4bb6-af21-455f89aa415a', '02ccd6af1a64a1c2bf7b81979948fbbd67ffaf00970606401c5fe0535d158d84', NOW(), '20220628190334_adds_missing_oncascades', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20220628190334_adds_missing_oncascades');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT 'f20f89cb-1032-4606-baa2-a97f4b3d96a2', 'fb6c0a32ff3484692be71ce81a64a4bcbe74842c625c2ffc1ef3acaa827dffb5', NOW(), '20220628191702_adds_default_date_to_feedback', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20220628191702_adds_default_date_to_feedback');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT '6e08872e-b835-4960-9fef-1d11524faf4b', '826ac36330be01623a8cc5992ae35bdf0b41e894d579f42a8b83eaf77bd106ab', NOW(), '20220629151617_connect_destination_calendar_to_credential', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20220629151617_connect_destination_calendar_to_credential');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT '4d90717e-de2b-4c23-b650-45f0b6a5a81b', '7072341ffeed7b098109632c615cad02fa50dfdbf69109183145e2f43f6aef53', NOW(), '20220711182928_add_workflows', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20220711182928_add_workflows');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT '1cd83e68-c6dd-465d-8b02-038477300e0e', '930918df4413469203d4bf8ade1bfecbedb4b6e9d50aecad00424082fadd883d', NOW(), '20220714175322_destination_calendar_one_to_many_bookings', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20220714175322_destination_calendar_one_to_many_bookings');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT '1059407a-3dc0-4442-90f7-34cac20565eb', '92561d67c42195da347bed6a8aaf6150058655b2cf06c6d31e68032387e2a2cb', NOW(), '20220719110415_form_submitted_webhook', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20220719110415_form_submitted_webhook');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT '6b4645e0-3e5a-4b6e-acac-3ede68fd667b', 'a6aaada56137b6423206fe48eb55e2011ac5c5a1a5c5625f35461b09ecf2e56b', NOW(), '20220719144253_disabled_impersonation_teams', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20220719144253_disabled_impersonation_teams');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT 'b287adcf-0610-4f13-9db2-a8cd6f5d8c79', 'a4c5e093efe8171f3316b8d7bd1a9c301b7256956b7af94988bd07f2a838e359', NOW(), '20220721183745_', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20220721183745_');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT 'b4af8f7a-a5b4-4be9-bebc-ac5a4dcaa5ea', 'e0372faa8136103f46289c67dfb0a0defee414ecbae5c3b551937f89d9e2249d', NOW(), '20220723001233_', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20220723001233_');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT 'fe5babfc-12d2-4ef8-98bf-f84746aea6b9', 'd28656009e9ac8573d15cd227b75f20203d51f007c5189a77ce614ac147836c8', NOW(), '20220728111440_add_created_at_form_response', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20220728111440_add_created_at_form_response');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT '656dfa43-5ba3-4489-8453-d9b6cb5ad970', 'c5ec91813c202729e7674f9c6ea4fce6aba76c18fd55da0e7fefc304d8ea7227', NOW(), '20220803090845_migrate_daily_event_reference_to_booking_reference', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20220803090845_migrate_daily_event_reference_to_booking_reference');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT '8588bdeb-f0fb-4dfe-9215-fc9d83570c36', 'fb692a2fda518faab20810a6c5df05e2fc9065acf764d6bf0587fbc7d9e49475', NOW(), '20220803091114_drop_daily_event_reference', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20220803091114_drop_daily_event_reference');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT 'feb58a63-44af-4716-9a90-a082e0e8bcb4', '649972587ae5a5e8d056ff758765ebace7eb5dd407db698544ab23241f077707', NOW(), '20220811132430_add_unique_index_to_webhook', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20220811132430_add_unique_index_to_webhook');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT '752105c2-91a9-46c2-ba19-b86b8e7fd729', 'be21ae8cea926b689c370fb9b2d4d4bec990cb96267c99697dfec52ed4650602', NOW(), '20220811234822_add_after_meeting_ends_trigger', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20220811234822_add_after_meeting_ends_trigger');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT '8d02f2c4-1331-4287-abf5-42462862fd28', 'd5082893b81053f86a1a5e0664af02a7e7fb62d35f0d63fc892c45b3e3c03d1b', NOW(), '20220817201039_', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20220817201039_');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT 'fe65f1b1-2049-47a8-8f66-f3bc0d3aab06', '781b81233a0d8e6867d9de66e0e416205f52bcb4741e0aa92cf8333c508ea72d', NOW(), '20220827082641_reschedule_workflow_trigger_added', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20220827082641_reschedule_workflow_trigger_added');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT 'b7aadcb4-9fde-4ef5-bae8-e63ebdc47006', 'b397fc8ca5eabf0626fffc596242baa50f4c18927ed5440b2222a19be90ef998', NOW(), '20220912134714_add_automation_category', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20220912134714_add_automation_category');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT 'c8df7931-bb74-4431-944b-0d49d5ffbebd', '1d3d9b6ebfca9b6cdf61af9a2a34fd5b498f6d1119ad573a7529ff03ea546606', NOW(), '20220913034937_move_n8n_zapier_to_automation_category', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20220913034937_move_n8n_zapier_to_automation_category');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT 'a600e8dd-d88b-48af-bb45-46c27b2caeaa', '8817fc6b1764ffd6648a9c715144c528f462cef3586531b47096303475d334f9', NOW(), '20220914215052_convert_pro_plan_to_free', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20220914215052_convert_pro_plan_to_free');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT '7fab7786-c5d3-4008-a6d4-9ef2b5624ba3', '19f26dfad0065c81e02007c7de737864821787d1829e597f92e3481c8bd8740d', NOW(), '20220917042621_rename_routing_forms_slug', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20220917042621_rename_routing_forms_slug');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT '671e7c2a-57bc-47c6-9c84-bdb9100c8182', '5d0874dd39872de080b203084aca621f3cb8d5adbf04d51681f93ba8bb1e5c56', NOW(), '20220917201512_revert_convert_pro_plan_to_free', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20220917201512_revert_convert_pro_plan_to_free');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT '323f98c2-20d8-4f34-afc9-2fba659ea391', 'a16caf4c4a648f38809629f3b65287267a2e86fdc4c8f8f112ef77e6ff154063', NOW(), '20220926105434_add_booking_limit', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20220926105434_add_booking_limit');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT '66294697-024b-4388-aa9c-ba3b89c0488a', '4c7f20df499ec8701955301c2a2a8d8c0dc98eb7536bb0eb2e7bd19eac05db9d', NOW(), '20220929132137_add_seats_hide_attendees', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20220929132137_add_seats_hide_attendees');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT '72d2d0b1-0314-4616-bb44-77ef3a55cec8', '1cccf39894a738498d49ac8c6480944a229ed540b0f30d0df3790091d50e11f3', NOW(), '20221006044939_routing_form_type_migration', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20221006044939_routing_form_type_migration');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT '2902a657-0c3d-41f3-83ff-7b1d528c4ab9', '077373f05af5de8c97bd23faeac50b81b6dfbba255d28dc586f6e645ec8b0f47', NOW(), '20221006121954_add_after_event_ends_workflow_trigger', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20221006121954_add_after_event_ends_workflow_trigger');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT 'a3a49509-5461-4707-9af5-faae2bf04648', '0ba31eec56da3a6471c16914b7835faa3b6264346aad3f56ddf7a5438e24ac36', NOW(), '20221006133952_add_analytics_category', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20221006133952_add_analytics_category');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT '26e80567-fd98-408f-be43-527cc1e1bbb1', '349c1ef12b026821bfda7202e9c21f4386639414b38050c5c6dd624c13460846', NOW(), '20221007112203_add_email_address_workflow_action', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20221007112203_add_email_address_workflow_action');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT '9544432a-8d38-414c-b261-7dc72e1b1c46', '3199de1c5f089c0fca77343a47846b93a75ea097887913bc058f1f57a003d601', NOW(), '20221011001632_make_team_name_slug_required', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20221011001632_make_team_name_slug_required');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT 'db5b9494-a1b7-4a5d-94a0-26ff8abe270c', 'e1bbd853c11bdd1ac4047240acd474dadd74029806a6acfdf6352509798cd2e4', NOW(), '20221011012344_add_membership_cascade', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20221011012344_add_membership_cascade');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT '6b414812-dcff-4790-9773-614241920744', 'f926c6029f2268df5348b1c1c000487300ea192c51508564471d020ae06e663d', NOW(), '20221017115710_add_number_required_to_workflow_step', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20221017115710_add_number_required_to_workflow_step');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT '863e6a0d-d660-4f5f-b203-3e1f9950f1c7', '437538b5b7c9f62d0134b134179977e5b972645ed36c3646ba52809f7150897c', NOW(), '20221017205314_add_invalid_field_credential_table', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20221017205314_add_invalid_field_credential_table');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT 'ca384529-e64f-42f1-8a03-a7ad9a5405ab', '4851d0d114982759ea76a717ca812319e840ef138fca52b557ae21b8ea721aa0', NOW(), '20221028093727_add_routing_form_settings', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20221028093727_add_routing_form_settings');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT 'c06f5705-03cb-48be-bbfc-06d1fd62cd42', '443513053571a55b2206b224f65b58a9949b764f8866877ab39829f694450327', NOW(), '20221107201132_add_team_subscription_cols', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20221107201132_add_team_subscription_cols');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT '6c244403-d9b3-40fe-97fd-1de4223577a1', '9dbfc44901b4a2b49a8a06ba967546b57b1c5ef2c46b24b984410bb779035745', NOW(), '20221110164757_add_sender_to_workflow_step', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20221110164757_add_sender_to_workflow_step');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT '1c16a234-080f-424a-84c5-6505ddf58c0d', '83c5bd0da4d39fcca6322036f9f8e32fd14657ca05de4d3073dcb6dea09cdc8d', NOW(), '20221111152547_add_enabled_col_to_apps', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20221111152547_add_enabled_col_to_apps');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT '8a4c89ae-d8f7-4ca2-a8f8-4979c60d2bf2', 'e8a2b6a01847c0a001d54c73135cdd4449eba44435f462fc0ce0011035d730e8', NOW(), '20221121115813_', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20221121115813_');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT 'b46d24b2-eab5-46f1-88f6-21556d0441a8', '69b8e12e56f214228e6fc847b1a730bc25608b77abf8f4739c3e42a97bced2ed', NOW(), '20221129112344_adding_radio_custom_input', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20221129112344_adding_radio_custom_input');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT '6c67543c-5941-4e5d-8707-fd033bfbcd7c', 'c54212be97a3cc06e0ac5d2f4a0ea72267bb7765b40ed9e5c0897cab43608745', NOW(), '20221129125935_add_metadata_to_booking', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20221129125935_add_metadata_to_booking');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT '2886bb20-4826-44ad-8d7b-a499b1ba5946', '6738039bbd77d5b9736c7e774ca0370d714d0e588ae6ee06568b9835c6dfe26d', NOW(), '20221201191836_credential_invalid_col_default_false', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20221201191836_credential_invalid_col_default_false');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT 'f9eee3dd-f20c-4d86-be65-20fe59122a16', '2e7801661f054b5cb4dfe1b11f37ed71a77797933b60c6ef9dd48d9dcc5fe781', NOW(), '20221206152547_set_enabled_to_current_apps', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20221206152547_set_enabled_to_current_apps');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT 'c885859d-79a3-4cc3-9e11-de3d2763f8ad', '5f35c9a3c417a9b446063124f46ba57e2021c5dbe75435951453bf6c7ca12e52', NOW(), '20221208221811_remove_user_plan', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20221208221811_remove_user_plan');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT '18439bfd-90c8-4e56-8821-2d7c4ae27f47', 'e57798b7c3867969708707608a97b464e4159afee8803b0a529951358ed9096e', NOW(), '20221214210020_set_seats_show_attendees_to_default_false', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20221214210020_set_seats_show_attendees_to_default_false');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT '817ca790-1954-4a23-910d-0ec07c9777ce', '2e0de20cfe980f1e6f62ef922e4d28d5561c37ef05cc374da7a9a37beace290e', NOW(), '20221215120525_add_verified_numbers', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20221215120525_add_verified_numbers');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT '6839942c-0612-4891-92ab-ee7a02b7aca5', '7ea4541a36749562285e24ab03e742bef1b770fce4f9cc9a3706ff1e0f4f5313', NOW(), '20230105203125_add_hide_book_a_team_member', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20230105203125_add_hide_book_a_team_member');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT 'f69002b0-fe2a-41d1-957f-8168bcac7edd', '690c759d788012335c45c5c8890941e4c53f1d7ceb92fa6a44673f17f2fab4e4', NOW(), '20230105212846_add_availability_schedule_indexes', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20230105212846_add_availability_schedule_indexes');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT '36a31fed-10b7-43de-b184-1c3d117405af', '8226dcf0c5affbb31ef599656b696e1eba4c0cc753997ab23133198067077136', NOW(), '20230111183922_add_host_relation', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20230111183922_add_host_relation');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT 'a34c605f-d14f-4665-abd4-5187a3b6cd25', '984c29f6f62365afc886ff629ddb5cbb255e2293a349ecbbe055d468370f4cda', NOW(), '20230124154235_add_booking_fields', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20230124154235_add_booking_fields');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT 'f5e62880-3367-43c1-8705-5bb16c6a68c4', 'd41999751a729f48a4758f6307a5fb0c89121c9519d3c3097ead7133c1deb001', NOW(), '20230125175109_remove_type_from_payment_and_add_app_relationship', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20230125175109_remove_type_from_payment_and_add_app_relationship');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT '2309515f-8aa0-4970-b7c6-0a654163064d', 'dcf2362d91e1e3932a1a1c744a29851cebfbcfcef1a263a72660c0ab531de4e9', NOW(), '20230125182832_add_deployment', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20230125182832_add_deployment');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT 'a9920dd4-edbc-415d-b323-8ccf6df92fd1', 'aba82509a7f05052b36dc33c5fa5c76b09153297e9a462b5d26dcaf939bb1743', NOW(), '20230129094557_add_recording_exist', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20230129094557_add_recording_exist');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT 'eddc7881-0464-45a4-b4e3-2d2b8885ad58', '9e12c2de73533edfa0b66e3fa1e0f3a97a5959f96cfc7dcad3f001c28efcd535', NOW(), '20230131062229_add_theme_and_brand_colors_for_teams', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20230131062229_add_theme_and_brand_colors_for_teams');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT 'f648b817-f543-434b-95ab-f7597a7d2cbf', 'a9f6bedc61bee6971ca959bdbee612d426111ad645d6059e14559009bb9b4e67', NOW(), '20230210132534_add_workflows_to_teams', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20230210132534_add_workflows_to_teams');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT '30e0e06f-b20d-4f4c-9153-93410dc3e942', 'ae036c66d1ff620a4a98709d8d14e67394d8fcd07c37deb80fb6e502165246dd', NOW(), '20230210182245_add_verified_numbers_to_team', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20230210182245_add_verified_numbers_to_team');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT '07c7a937-f039-4f27-8a0c-82ada3cb8eeb', 'be7a188ce892c3b77b95ae63bf3389afd2ceee476a0199859d7c030e51267b47', NOW(), '20230214083325_add_duration_limits', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20230214083325_add_duration_limits');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT 'd6f4a8a7-22c0-49d9-a70a-e41f3480e7d8', '9f8188a3f754a686fc2c10ef74d0d74ff810f82387fe5f43633e6d93dfaf1a2e', NOW(), '20230216134219_managed_events', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20230216134219_managed_events');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT '0bdfd50a-daba-4193-bf2a-5f18aa7673fd', 'edea4f5bb04350a5e538433620691a2d9ed1c5839caf66186d5f35452aa88e23', NOW(), '20230216171757_host_user_id_event_type_id', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20230216171757_host_user_id_event_type_id');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT '6c77bf39-3514-40a2-9655-f2547acd494d', '23659f84fe82cdac4236eb14eb48e35cac5910be6c5b26c2caf985178c8bcd17', NOW(), '20230217230604_add_cancelled_to_workflow_reminder', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20230217230604_add_cancelled_to_workflow_reminder');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT 'a59de921-b4a1-41d7-abc8-b5edff0399b0', '3487c1451c67c4fb0b7167e6d9a9a3fc7da29139e11747f59eaece62bd3cf2eb', NOW(), '20230222152136_assign_event_type_ownership', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20230222152136_assign_event_type_ownership');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT '8de37490-e2fc-405c-83ac-437c11cfd869', '2f4e1f437145d528ffae37994785e8917620473ac7782eefe18a914d6a859504', NOW(), '20230303162003_add_booking_seat_reference', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20230303162003_add_booking_seat_reference');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT 'b92218df-321a-48c4-9d7a-cc56312bd8c5', '9cada7486b637745a240687017f2f8949a6ca390c22e4cb261919f4e72753bdd', NOW(), '20230303195431_add_feature_flags', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20230303195431_add_feature_flags');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT 'b52b653c-3f8a-4dc0-ab5c-707091c53285', '3cc1208e69c1d21e811b128aa6d9bf2b89dd54ba226f154d3d7d48fb3669c3ba', NOW(), '20230303195432_add_feature_flag_default_values', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20230303195432_add_feature_flag_default_values');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT 'fc1e4324-3b7b-41f4-8bba-5f0f991703e6', '275d32d7f3eccf2556d9f2691353a7baa0a2b9379abf11b129189100aa7fd9e9', NOW(), '20230309203435_make_booking_and_workflow_step_optional_for_workflow_reminder', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20230309203435_make_booking_and_workflow_step_optional_for_workflow_reminder');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT 'c7440e6b-1f3f-4c29-b40a-a419a638c1dd', '4b0907d4685aadcc971a33a3c43d57804cc1ffba4686377a8898e40595a303a4', NOW(), '20230328204152_add_selected_slots_table', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20230328204152_add_selected_slots_table');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT 'cf4c774d-c045-4c38-82b4-ee6624b96753', 'b8c7f2917f1e397e9b1edac6fc4b71a1d8fc0cc023352f4aa385d21439011946', NOW(), '20230329000000_add_insights_feature_flag', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20230329000000_add_insights_feature_flag');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT '6e3d2ece-b420-4df8-8265-cf27836df9b1', '2b74ff1fbc5219ba39584c686bd12ee12a115a3d5e93495539bc3f3f5e042b0c', NOW(), '20230330030031_add_payment_option', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20230330030031_add_payment_option');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT '8c6dc27d-a4a3-4650-81d6-a87069b3bd1c', 'dca775e55f9a1fbd095974bcab8a2a2e81ea9857e72e11dc60434adcc8e832c5', NOW(), '20230404100155_remove_reminder_body_email_subject_from_reminder_template', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20230404100155_remove_reminder_body_email_subject_from_reminder_template');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT 'e97fbf05-4d76-4f1c-b7e1-c03ef94c6bc9', 'd39547b44bcc60a686bb849c89caf8ad508f613208d70c52c8546ea5451ceea7', NOW(), '20230404202721_add_feature_flag_managed_event_types', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20230404202721_add_feature_flag_managed_event_types');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT 'efd4b9a5-3d3e-4c73-a025-e0a7fb98ecac', 'c37422b22beb007672ca5eecb5df06f34fb7f212328953585871ed0043fcddc1', NOW(), '20230410234751_add_foreign_key_indexes', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20230410234751_add_foreign_key_indexes');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT 'e8fe25a6-a87c-42f2-af08-fd5b41ec0cf6', 'bef959a87c02a89b70e4f2444647cca23a6ff3ee9541ca05b2253d1d8e404ec3', NOW(), '20230412094052_fix_apps', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20230412094052_fix_apps');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT 'aa02d133-1e60-44c1-8eaf-4c166d39076b', '5dba54effac44cf1dfb67670e47075fadb3e19c4215c9023e3c7ce2c0fb8f3c7', NOW(), '20230414112451_add_recording_ready', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20230414112451_add_recording_ready');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT '93223c2b-ad30-4fd9-9719-a5578d6f1828', 'c7431321571359da31b6a931c095a9161fdcc474de0a2c67445fe25315deb3e8', NOW(), '20230417102118_app_logo_subdomain', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20230417102118_app_logo_subdomain');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT '4ef32cb6-0b6e-48e5-9353-32db13027c2f', '8604b24df6da933183e47789c9538d3c10c30ef2e3a64c6d64c0f0dfb9a50724', NOW(), '20230418002117_booking_time_status', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20230418002117_booking_time_status');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT '165feeed-63ca-438c-8621-66093a262354', 'd53d1bda234c0bec97798891255eaa89c25b4a365954d8fcb060080d0cf7e285', NOW(), '20230420222915_add_whatsapp_workflow_migrations', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20230420222915_add_whatsapp_workflow_migrations');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT '7f680e01-cc89-4483-baa0-8358be5414f5', '12902a524db4ac59aa8acdc9e474c05475043fe888f4ac0eda8d2b8c013de3b8', NOW(), '20230422152301_add_team_invite_token', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20230422152301_add_team_invite_token');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT 'f0b88354-a4ab-4c28-bedb-a6bc7ddeaf1e', 'be5fbcc325e583cb4ecdb410f563b97a2cea832022ad8a62cbfe5f753e637386', NOW(), '20230424163718_offset_start_times', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20230424163718_offset_start_times');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT 'ae7b09b5-8c8e-4f40-9961-4acec62c33c6', 'e957c8a857cc1f56c03190362fc428116150b05b059609aed41e3fb5d8295a67', NOW(), '20230428142539_event_type_workflow_uniqueness', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20230428142539_event_type_workflow_uniqueness');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT '81036ce5-9e1c-445e-81b8-73349a23d835', '1457ae51a55e04be987cae6a47aa72134762af22a6d3bc3fa9f90977a657d758', NOW(), '20230513235419_add_booking_webhooks', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20230513235419_add_booking_webhooks');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT '35332a26-4484-4ef2-b351-571aa5e7130e', '1f6d75c6d41ef48fdf417550c0727ddfd276b80fdb6efc26707ced381ba0d28c', NOW(), '20230515121841_add_team_webhooks', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20230515121841_add_team_webhooks');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT '73ce85bf-d4c8-4e7e-ad27-36518a3b9fa1', 'd037e242858b6ad1366edcc6f66a00a71c151ddf40a048a4fd2eb34e582c55ee', NOW(), '20230518084145_add_feature_flag_google_workspace', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20230518084145_add_feature_flag_google_workspace');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT 'cdc68036-f7e8-4481-a214-3329c0c5b122', 'cc6dbb0db7740bae8395aa80b3d92cd127491e110e81b41a6de6c09c78ba3c6a', NOW(), '20230522115850_add_enum_booking_requested_booking_rejected', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20230522115850_add_enum_booking_requested_booking_rejected');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT '9971e428-cc20-4aec-89be-192d028cf687', 'b3b107afb4d555d456c6388eb5c254aea1ead094b9954a86bf244023acb21488', NOW(), '20230523101834_email_verification_feature_flag', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20230523101834_email_verification_feature_flag');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT '0862794c-34d8-4fff-b312-8b6238a94f74', '6329fbcd3849dc81ac7bf74c3b775e968c9ff723b74b3db56eca1689ca85c484', NOW(), '20230524105015_added_newbooker_feature_flag', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20230524105015_added_newbooker_feature_flag');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT 'bcce47ef-8418-4847-bad5-f7f938e76676', 'cd7c51241ed280e9b0ff58875e38408b6ba7734213b1eb6bfff341325fa1edb8', NOW(), '20230531133843_organizations', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20230531133843_organizations');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT '50cb7a05-0553-4a47-bac2-19686af846d3', '6ebfb0b9abe8a95f734207cedd1aeb91f6892dd33f1f38f7fcee111161ae8eff', NOW(), '20230601141825_add_locale_timezone_timeformat_in_team', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20230601141825_add_locale_timezone_timeformat_in_team');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT 'd0403889-bb64-4b57-a5ee-6c79d77b9302', '245f18ff4c991debf3cf15cf8073a451623f3e35dc8fa0e73e0eb2b65cd4afc6', NOW(), '20230601181657_disable_signup_feature_flag', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20230601181657_disable_signup_feature_flag');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT '1a24cbea-b5c6-425f-b41b-4f8874357578', '0813c9408b509f1f12c9804acb2d11baf51019dcfbbb5eeb0031ac7ed2293752', NOW(), '20230603115613_reorganise_app_categories', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20230603115613_reorganise_app_categories');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT '7e41df78-8b1b-4057-a537-8464825526df', '333072f5bc5e28744ede076a5016d58698ae6db072c066ef6851af6dfed92a65', NOW(), '20230605142353_team_routing_forms', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20230605142353_team_routing_forms');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT '534f7601-d793-4c93-9fe7-c5d0a334cef8', '75abc34dafb0102e378b39dd49b35ae4415540596ee882ff5a1078165bda6b8c', NOW(), '20230606202918_add_team_id_to_credential', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20230606202918_add_team_id_to_credential');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT '8768a68a-fa07-4afd-b52a-dce6847e7507', '3e19b017b77d3ed355955974fd48099835176627d0d988b2174e3253551f58c5', NOW(), '20230622164946_remove_host_remnants_from_old_team_members', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20230622164946_remove_host_remnants_from_old_team_members');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT '6e25eec2-b46d-43bc-b537-b81d159b9a0f', 'a1f88d289d0e8a201a434cd2df31012216167a87c184208c66c6438512e1b25b', NOW(), '20230629083927_add_team_id_in_api_key', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20230629083927_add_team_id_in_api_key');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT '115243cb-4726-4b93-a37e-4762b99c4822', '4c0f0dbf2baa2f1fc869e7ae7fd837c86262cfb8d547683f432adce14527bc15', NOW(), '20230629124638_membership_autoinc_id', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20230629124638_membership_autoinc_id');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT '0d3631a5-e3b0-4738-b75c-5031db624c69', '97b8b0bf0d74a7e80663a10503c9eb5cbed2461ebc1d8575176735d35e53dbad', NOW(), '20230701125542_add_is_private', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20230701125542_add_is_private');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT '26b7b763-01b6-47fa-889a-a1ce3400fe49', 'abb89f271c9ca8b65653179b8c33d2d864028934c086a5cf243eb8b2cb54c24c', NOW(), '20230712192734_fixes_team_verification_tokens', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20230712192734_fixes_team_verification_tokens');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT 'ca58c09c-9670-4584-8201-d402ffe4af79', '7333a68f364fe841130a2504ab07687ada9d63e380fe04b7e09bb0b9d89cf8cc', NOW(), '20230717175901_add_booker_email_verification', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20230717175901_add_booker_email_verification');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT '2627a150-13da-43c0-9532-4ea3e74c6dc9', '818551cc996e629b94c338bf6e5e2a62b5091cdff8074f17e04c7f5cbcedd105', NOW(), '20230719214513_update_booking_time_status_fields_event_parent_id', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20230719214513_update_booking_time_status_fields_event_parent_id');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT 'f7c02eb4-08c4-4af5-a4ae-47d5b76e1460', '38cd9689bb88ca026178703a7246f5d60b80f76817d56b56b883e852cc02dbe9', NOW(), '20230726083334_fix_workflow_reminders_not_canceled_for_canceled_seats', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20230726083334_fix_workflow_reminders_not_canceled_for_canceled_seats');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT 'c9ea9dfc-7a5e-423d-8544-67a7c090bf8e', '334fa382ed20f03915288606f5f52686acb437b6d8433ce8246b03b30dc332b4', NOW(), '20230803132959_adds_field_for_seo_indexing_checking', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20230803132959_adds_field_for_seo_indexing_checking');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT 'd0aced0c-e14c-4466-84eb-6e0efd14cee1', '0b9063478c94981ad7a3be41aac45416c43d924deaf7fd4fdaede8f3718e5e28', NOW(), '20230804153419_add_backup_codes', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20230804153419_add_backup_codes');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT '920fec50-5b01-4913-aab4-010f9201a5f0', '12391bb2b5c327bc31db0b623395910e537c70848e09b167a10b43225ffba218', NOW(), '20230815080823_zapier_scheduled_triggers', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20230815080823_zapier_scheduled_triggers');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT 'f4debf2d-e87e-4eeb-8360-176deeeab698', '213ec9b6005263d4293ab9194c83aa58a6fc949c0bb53c3889da8704b4fd3f56', NOW(), '20230815131901_add_position_column_to_routing_forms_and_workflows', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20230815131901_add_position_column_to_routing_forms_and_workflows');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT 'd8240304-e54b-402e-838f-fe0d6c523ccd', '7abbeaeaecfe2c342fd44aa548e01ef09bb0941fa36d7a3ff6d51c417b64035a', NOW(), '20230828094603_add_include_calendar_event', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20230828094603_add_include_calendar_event');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT '773e272c-2d09-4834-8c49-951d6226e60a', '643c192479d942d25e934028bafa7e2d0e953be3ba15ee7fb8c9bbbd51ac1dfd', NOW(), '20230828175052_', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20230828175052_');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT 'd4cee009-fdf5-4658-9881-0c9fdf94a547', 'ddc19898cb1ba171397e210104d096e34126e543b31527771c5788ea3f4b9a03', NOW(), '20230902163155_add_seats_show_availability_count_field', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20230902163155_add_seats_show_availability_count_field');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT '0e19826c-9184-4575-bdbe-be01073c8793', '497f1088aa8a3f45dd8e6d923e47b3a81f2c3abe53ef96c23448c2b6d3bbe480', NOW(), '20230904102526_add_booking_payment_initiated', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20230904102526_add_booking_payment_initiated');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT '068eeebb-b6c2-426e-b5a6-27f73770d37e', 'eb4b3db41df8bd9e3f920f17ad946479faf05a81c0832819473f671742dc3f53', NOW(), '20230907002853_add_calendar_cache', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20230907002853_add_calendar_cache');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT '6e640801-daed-4170-85a9-b2ab92a3faf2', '679e3cfd4cac8603e40bbac1b2b2368a3e08073285d09dd621a934e9beab2755', NOW(), '20230911172537_connect_selected_calendar_to_credential', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20230911172537_connect_selected_calendar_to_credential');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT 'b2811462-0bc3-4717-9be4-6808a428c086', '5b84d1604352e70b9da4386ad2f734d872feed57afd261ce410afd418736a135', NOW(), '20230920175742_add_oauth_model', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20230920175742_add_oauth_model');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT 'e949d157-99bf-4baf-ad12-50e2f0051b15', '81b8c1c34313cf29509999e3e448eadd7c657b5ca03138911c1a6225022f5fa9', NOW(), '20230921002822_fix_booking_time_status', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20230921002822_fix_booking_time_status');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT 'd78a21ff-496b-4627-9c2a-ab2d02d17adc', '0d48fc3df2ae7f6bb4fc8df2e6a5f2607f97fb5fa99ed42da78c934993feeaf8', NOW(), '20231001101010_add_user_email_to_booking_time_status', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20231001101010_add_user_email_to_booking_time_status');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT '56f2810d-5853-4cc6-856a-a5ba774f7825', 'd477ce6d40573336a6300c338a8da32b740fc7ed096cbebde1bcf7d4c3b5f92f', NOW(), '20231014180034_add_temp_org_redirect', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20231014180034_add_temp_org_redirect');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT 'e07d093a-46b0-4590-aeb9-e6da46351e93', 'f512f09c1ca249a4a5ced28e66e703ef5b3564153604aa0655575c38700aa97f', NOW(), '20231016125421_add_username_idx', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20231016125421_add_username_idx');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT '1c644d4a-325e-476d-9bbe-79efbee5bf3c', '75795d680d5aa54366c17724a9cc7ef3670efd04353b779d6b115926928e329d', NOW(), '20231016153526_add_workflow_reminder_indexes', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20231016153526_add_workflow_reminder_indexes');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT '25cd2a79-7ac1-4bca-a4ab-dd62e10ca929', '1ffec53a031fe1f9569aee2e5f363bc7a5a27e47acf32d8c9a2a3fd57772c8ca', NOW(), '20231020090443_add_lock_timezone_toggle', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20231020090443_add_lock_timezone_toggle');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT 'c2605986-f7a7-49da-96cb-074c8526c9b0', '2d5a8c37661021bcc8415bbb7117e2b831990879c79008dae22f3b066a026523', NOW(), '20231024173642_idx_booking_status_starttime_endtime', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20231024173642_idx_booking_status_starttime_endtime');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT 'a69503fb-55a6-4b47-bdd2-3df9b7c5c8a3', '7ec9af694ebc89605dabe057cb64501d7be05c760bfdd661061c0bbe975a9fd0', NOW(), '20231110122349_paid_apps', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20231110122349_paid_apps');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT '4e339f89-c76d-4bb5-b3b5-0b958889f78a', '8901f67caa54eb863d4bd150632fec2a85cb53ca8975655c811cbb402bb813aa', NOW(), '20231113131945_idx_teamid_verification_token', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20231113131945_idx_teamid_verification_token');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT '3960e932-b8c9-4d6c-9513-7b3f2243ec5c', '6a5859be963ea199120225cbc1d2d1e45a082f90f1ebd13baf9e57f7b7aa3c26', NOW(), '20231113202947_add_ical_columns_to_booking', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20231113202947_add_ical_columns_to_booking');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT 'cb728b75-9b00-433b-a6a6-50730f8c5a2f', 'b4e9a43dda108465642b425f0d984a364f93f42cc774f8d7320df406a2376266', NOW(), '20231114090318_add_avatar_url', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20231114090318_add_avatar_url');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT 'fbdb2bc6-901f-4fb9-8e29-3f204690cd5a', '8d070c7c5737b88c283ec9f6b6be809faee07fe33add54455fb97e80d06ab5e8', NOW(), '20231117002911_add_users_locked', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20231117002911_add_users_locked');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT '5a9122ec-159c-470b-8fe8-9395a74512c0', '43fe53ce7a5ae414e14078f9ca81d53374fba4854967a44a7a8572b6539b49a0', NOW(), '20231117081852_idx_eventtype_scheduleid', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20231117081852_idx_eventtype_scheduleid');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT '71444f15-44a4-4c31-b98f-9ab59f58be22', 'a40aa85b3cde123fda52e9d386ea8a54a0767f423af695154311c8d09d411af6', NOW(), '20231201233433_add_new_user_field_app_theme', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20231201233433_add_new_user_field_app_theme');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT 'b682bef0-39eb-4312-8573-04274e9f1f71', 'cd012d8f3395f92d2cbfbe63d228ab2b7753bacb9f6fa86e571f6e37157e8425', NOW(), '20231202181233_adding_show_first_available_timeslot', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20231202181233_adding_show_first_available_timeslot');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT '964c6f9d-becd-4e52-a74f-9b69f3af9833', 'e9e2f691a212f3099cb186e89e639407d4fb8e625b5986ca4e58982f29d5a28d', NOW(), '20231203154633_adding_is_mandatory_reminder_field_for_mandatory_reminders', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20231203154633_adding_is_mandatory_reminder_field_for_mandatory_reminders');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT 'f92fe946-0b33-43ea-910c-e42918e84c3a', 'c53df02ff4eb1387a6fa3de5153166f99f6deb34707f7cf4cc4de3f4203edb67', NOW(), '20231206191034_add_cal_video_logo', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20231206191034_add_cal_video_logo');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT '307119b5-fcb5-4968-aef5-bdb699513098', '366c0899058a7a19d546809a8f0c50cf11ca6a28488cda123495f4d944b655a0', NOW(), '20231206220118_add_recurring_event_id', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20231206220118_add_recurring_event_id');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT '158793e5-ee00-485a-b544-e1d0e3d0b1e2', '3ccc09979c83723a643b50576d46638a7bb94c0a0f41b84e24945d9baf0dcc69', NOW(), '20231213083720_add_meeting_started_webhook', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20231213083720_add_meeting_started_webhook');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT '7e25fc02-30b9-4a1a-a4c8-67c97da6d8b7', '36a8d8f99ecfb497b8cb10421d60a97a494c9aefc22554e15d8198c3740a9154', NOW(), '20231213153230_add_instant_meeting', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20231213153230_add_instant_meeting');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT '61a6c785-adcd-4542-ae3b-43526d29638c', '99ec87c0e3f617d5a1d6c4e504aec10cc7a9e2d6fe4038ec793ba6d625aa257a', NOW(), '20231220152005_add_email_in_destination_calendar', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20231220152005_add_email_in_destination_calendar');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT 'b61813e2-2c66-447e-af24-98d43a977ece', '356aa124c7229954274b90840e68974a500571e69e3f428803af61f639a15741', NOW(), '20240105110500_removed_newbooker_feature_flag', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20240105110500_removed_newbooker_feature_flag');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT '24b7be35-4e2c-499e-ab7f-2b8fd7d0c6e3', '3f1cf019aec263efc9d52d19c04b924db2b19322ad54ac5da3ba56ad36f67f0b', NOW(), '20240109041925_add_out_of_office_entry_table', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20240109041925_add_out_of_office_entry_table');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT '8bf6eda0-2d53-4985-b5f5-940f6ef0b877', 'f94379e1d2c66ba82a5ed757c6e77d042cabfcf3c641b2cd3887fa1c2bf55f48', NOW(), '20240111075727_remove_brand_colours_default', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20240111075727_remove_brand_colours_default');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT '9a319452-8eb6-4670-b78c-912fc36474e9', '0b0545cf1e7659188434b490ae4d6e72fe5be8ec1648621f39c8a78b3f2c2bfb', NOW(), '20240114195534_assign_all_team_members', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20240114195534_assign_all_team_members');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT 'f76c2594-f36f-45cd-8ad0-c92a598358db', '51520d928d8e42c5e250169b98b1587e745650ee03ebb10fdcd89b21e9fdf483', NOW(), '20240116085902_add_pending_payment_column_to_teams', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20240116085902_add_pending_payment_column_to_teams');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT '7481e6f6-5b0e-48fe-a0d9-24d6dd6ef89c', '734283c6775e05e7efa4e6fa9ac3142c9251b0d4f89f8684ab1afe6539261b97', NOW(), '20240117062434_move_org_metadata_to_org_settings', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20240117062434_move_org_metadata_to_org_settings');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT 'cfe6c34b-fbeb-49ed-9f7c-c19775b23982', '60cb040e9502b4996e230ecfc52a821150578cfe9e1e9020e1fe18e7a0ab6625', NOW(), '20240130134919_add_profile_table_and_add_event_type_relation', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20240130134919_add_profile_table_and_add_event_type_relation');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT '3da40d3d-aea8-4428-aee1-88490e0e47f9', '94db13d4294084baac9ff3c988cc631048976b3fe446e4df1fd0b13fd56ead85', NOW(), '20240131021824_revert_20230404202721_add_feature_flag_managed_event_types', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20240131021824_revert_20230404202721_add_feature_flag_managed_event_types');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT 'b20b0c53-6481-4712-90f2-da4faa112d79', '195ce1bbbc0dc31e88672c07063f242af939a1a08e601629cf05e891cadd732a', NOW(), '20240205185412_add_email_field_in_booking', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20240205185412_add_email_field_in_booking');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT 'ca5faa88-605d-439d-808a-8593b0417104', '229ec1477a0b7fb23972d19136a4ffaccfec5cda4140029cd70a4819f29d9b54', NOW(), '20240206162624_add_priority_field_to_host', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20240206162624_add_priority_field_to_host');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT 'c1d883b7-6b43-4bfe-ac2a-ce4243fabb38', '44754b940d98295904804fc2165f166f55721d06e135b185c03726c8f8d16e2a', NOW(), '20240207222843_add_google_watched_calendars', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20240207222843_add_google_watched_calendars');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT 'b5d42435-1f2a-4461-8de6-9e57e35d6012', 'fd07a94d001fe8fa312cdf0978cddb459d03111e2f647c72f8c5a5d79a8012cb', NOW(), '20240208075646_use_event_type_destination_calendar', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20240208075646_use_event_type_destination_calendar');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT 'bf814b75-3809-42ae-b683-74851b2aaee3', 'e4886e799162be90b08959f7797ac81933e2c5035ad4bce47ddfb52f4aadc9f8', NOW(), '20240209223121_adds_user_password', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20240209223121_adds_user_password');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT '9dcde85a-2a39-48fd-a1f7-b14b14a3729c', 'a65941ee41fa8feacff6177a5eb34d9a62d9e064470ce94f91b1d27e68ded7da', NOW(), '20240213081819_add_secondary_email', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20240213081819_add_secondary_email');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT 'd0d1b604-33bc-4ed0-8ddc-bffc8d06088b', 'abf4570d261590dd92a6fceab5336eb68f32a125b529d392d98ce7f3904b2e81', NOW(), '20240213220617_drop_deprecated_passwords', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20240213220617_drop_deprecated_passwords');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT '303f2e78-2dab-4369-9287-5c7bfc7880cb', 'd4f1f0887f20149633abd8f3d1cca1749a2aaa0c5a20df14c85c813123927946', NOW(), '20240214093418_add_banner_url', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20240214093418_add_banner_url');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT 'ec2da924-e15c-4990-86de-45d5a5c779c6', '78fe196c67040f75e1006beca97966dc4d7c1bfbac06bf97174c0dcc053dce29', NOW(), '20240220151951_add_dsync_data', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20240220151951_add_dsync_data');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT '3c44bfde-bc49-4cbb-96ee-5467d404db56', '9c0d30cbbf429b79a0c704822a524b0391fd1941e870079c46eb91862bc0fe5b', NOW(), '20240221051147_link_secondary_email_with_token', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20240221051147_link_secondary_email_with_token');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT 'a95ee1ee-9895-46a0-9e2a-fc8f9a4a5a56', '203f4e4c66deed80688952e5ae8bebe8d2038679f5391398add8a9e0ce138805', NOW(), '20240222120917_link_secondary_emails_with_events', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20240222120917_link_secondary_emails_with_events');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT '582988da-4102-4e8c-80a0-928b043daab3', 'ae6a04b5d9555097d332a910d5aec09090f618aeeb04312fa8a3e747d2285011', NOW(), '20240223033247_add_dsync_team_group_mapping', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20240223033247_add_dsync_team_group_mapping');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT '5f9cd2dc-f7cb-45a1-b4cf-a391af087a3e', '44fce2dc7531a873679292987088df0c3dce77d92ec86b0083a637ea51589aa4', NOW(), '20240226125946_add_idempotency_key', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20240226125946_add_idempotency_key');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT '2a3b9624-9ebf-4ec3-9bf7-e3427421f133', '3919c5907a2b9983f78648ada89c1687e376fbddb1107dab06df7aaa8162f5ee', NOW(), '20240229154858_add_insights_db_indexes', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20240229154858_add_insights_db_indexes');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT 'f8c6ba12-9c46-4dac-81e1-52c8e69d12a4', 'a025a234bd097f14fb803284f53fccda563054d81ecaa86f1b75f363b2dcdfad', NOW(), '20240304093822_lock_eventtype_creation_for_orgs', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20240304093822_lock_eventtype_creation_for_orgs');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT '604314ba-1a99-4d29-9179-7b476f8d0f21', 'fa009e6208d2e7cee8cd832e15effef03d79819ce9fa631239b554696eadf987', NOW(), '20240305054507_add_reasons_to_out_of_office_entries', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20240305054507_add_reasons_to_out_of_office_entries');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT 'f119462b-3c32-44a1-91f1-ebd5a359eb28', '288668ca25e2766a2103095f0c74d81299ec60fb0fac2e42a71ecf51e29bd03e', NOW(), '20240305054508_default_reasons_out_of_office', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20240305054508_default_reasons_out_of_office');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT '8ecf8421-f9a0-4bac-a99a-1a3aff1f03a9', '4c27c94cefb400549a918f7036ee7f4a0af4aebb5af903d7bfc92e4f43750bd8', NOW(), '20240306041233_move_dsyncdata_to_organization_settings', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20240306041233_move_dsyncdata_to_organization_settings');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT '0fde5983-9557-4f24-a412-fba3eb152b4e', 'b8cbf484af47963aa8c0083ea6de49cbb0b72738d6cdb4c09eb0a3c1b09e8c1f', NOW(), '20240307200336_rename_dsync_org_id_to_organization_id', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20240307200336_rename_dsync_org_id_to_organization_id');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT 'aebe32e5-4255-4b3c-818b-a143290398b6', '907d79c1ed3c7f82ec237b504434aecd3536881b520a0537d36c999af080f965', NOW(), '20240307203026_rename_team_group_mapping_org_id_to_organization_id', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20240307203026_rename_team_group_mapping_org_id_to_organization_id');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT 'b2b2261a-eb8b-4bcd-933c-42ff41347597', '1d3cc9d52d0348cc21d10d03e57fc618a54f3787ec5027bfbc50c9dcc907dd3a', NOW(), '20240308211937_add_notes_field_to_ooo_entry', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20240308211937_add_notes_field_to_ooo_entry');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT '9b1d5ba4-96d1-421b-8ddf-013a5218079b', '5864e07c2e5a71cfed494326a998167ca87eb470cf82297b7304cdd368de6d2f', NOW(), '20240308214010_add_is_banner_in_avatar', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20240308214010_add_is_banner_in_avatar');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT '765ffae0-0d15-44c2-a4be-726a4d483180', '0170a76c5629d757d2dbabdab29b1838fb8b291cd08c054c7b1ef031d244ac17', NOW(), '20240313151954_connect_dsync_data_to_org_settings_org_id', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20240313151954_connect_dsync_data_to_org_settings_org_id');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT 'cb9535c0-dcbc-4cf9-954a-58f5f22ddfec', '750944028c69b9f239ab9452547d45d298379a9123e244a1e1ccc8d0c05e341c', NOW(), '20240314152130_platform_wide_webhooks', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20240314152130_platform_wide_webhooks');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT 'f754006e-d486-4c91-bf98-78b1f782e1f8', 'b07cf4708a3ab39d27a063f232ac43224a8867fae24cab465ab6c447cf4f4334', NOW(), '20240318085938_add_provider_email', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20240318085938_add_provider_email');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT '3bcedb84-78b6-4494-9a6b-ef247c4539d0', 'de6235ffe87e35f822742fd7e16c7bef589c9c89050ff6aedef0b866ac3fdeba', NOW(), '20240319144740_platform', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20240319144740_platform');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT 'f49b1cf6-644e-42de-afa6-d97c5569969f', 'a704caa99e98e9da8350b80d89554960de68ff7da8b7a2410f231311c8653a4c', NOW(), '20240321143215_move_avatars_cols_to_avatar_table', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20240321143215_move_avatars_cols_to_avatar_table');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT '768d2f10-ae30-4d85-b47e-6832221a4e7b', 'be6e88b48c28fdcc7dedaa4fd70559050eecad909eee00c8bee986ee3205a95a', NOW(), '20240321153033_add_travel_schedules', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20240321153033_add_travel_schedules');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT 'aae7b5e2-1803-4d01-be7c-e974e53ee792', '69088242ea04a18f281236ac02305ee992c299dc8e3970ee8351659c29560c3c', NOW(), '20240322152654_add_webhook_to_scheduled_webhook_triggers', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20240322152654_add_webhook_to_scheduled_webhook_triggers');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT '621faf84-bd62-4b50-a7dd-60c0aabdc9cf', '373f844db8b2c42a622281e41e9ce8dd77bfe25c3d13fd43f07db921dda7f4a7', NOW(), '20240325082604_add_is_platform_flag_to_team', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20240325082604_add_is_platform_flag_to_team');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT '11422485-eeba-4579-b1f3-1cc08dbc2327', '2c8129d47c019ccbe6533610200111290556e875b322196eac2e288eeefb47f9', NOW(), '20240325162556_add_user_is_platform_managed', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20240325162556_add_user_is_platform_managed');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT '577bb184-db5b-4e08-98a1-729b9c84b6d9', 'e23baf99809b2e7179869f5da64d2b34e0b31ff3118d6bb5387f715cc5fda97f', NOW(), '20240327121006_added_rating_workflow_template', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20240327121006_added_rating_workflow_template');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT '830268d8-4d46-4110-8376-e93ff17f66be', '28164734d3c14ea0ea10a07b158b665109079028253e80d2651cd4431cccaf65', NOW(), '20240327130910_added_rating_feedback_and_noshowhost_for_booking', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20240327130910_added_rating_feedback_and_noshowhost_for_booking');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT '8632891a-4b87-4852-a992-a30e1ff319f7', 'b024ef2703677c7820eed66bf4af2730083dab06ab9b1a9ab78c3fb193b8d959', NOW(), '20240327153218_adds_tasker_feature', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20240327153218_adds_tasker_feature');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT '85775244-2c8a-4e46-810c-ece27872b23f', '776284cc390740720698a1715e81a5f72572a44d2869d36a5da82fd62c81bc10', NOW(), '20240327165803_forward_parameters_on_success_redirect', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20240327165803_forward_parameters_on_success_redirect');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT '4d07eb24-7ab3-4fe5-9ce7-a9b2bbd83f39', 'c746e296da9f90b930961c0eaeb3d2690c40541929a9eed190e9981e2d96bb75', NOW(), '20240328080307_add_ai_phone_call_config', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20240328080307_add_ai_phone_call_config');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT 'f77b1f2f-efef-4570-ae4f-93e2dcf60c2c', 'cef3ea077c325db9635d699de5e93cf7f7003d5b3fb4dd72fa7b6ac92c4c0a21', NOW(), '20240329084749_platform_snake_case_to_pascal_case', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20240329084749_platform_snake_case_to_pascal_case');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT '3c1fc927-5eec-42a4-b683-ac237f97d382', '93e1d812b1f7b0f438a7a22e1a198fc7f12811a77eb8a525b8332f6df2b5a544', NOW(), '20240401034329_add_admin_review_org', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20240401034329_add_admin_review_org');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT '4aa0957f-0623-49c4-8a88-6e94bde5122d', '8ae65ce196b67fd614c3e9198ad39fa9b559916ce42c5ef14e536cfbffafa4b1', NOW(), '20240404092234_add_guest_company_and_email', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20240404092234_add_guest_company_and_email');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT 'dc20d0a3-0558-4eaa-b3a7-c0822180c8bb', 'd35888a603132bce5688cfc3795fa05d712e2de1bf2e354e7b32fde2011dec17', NOW(), '20240405142908_make_guest_company_and_email_optional', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20240405142908_make_guest_company_and_email_optional');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT 'cf435c00-ee14-44d8-94e2-c230a6e5b0a0', 'b61f9426422015f6a85aa0276f981609994cba45c69235a119c0ea63aa7859fb', NOW(), '20240408155446_add_phone_number_in_attendee', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20240408155446_add_phone_number_in_attendee');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT '09bb3114-c98e-42cc-8ec2-a612af2a6ea8', 'fc7aacd6c77b50183c7bb3914b1c3615426eaba64fb87b354a2defaca1f5cde5', NOW(), '20240411114622_platform_urls_emails', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20240411114622_platform_urls_emails');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT 'd6da9579-3e87-43ee-9c4e-cfe87c32776c', 'a89cc4a6e06a618cb63a7e5a78a73582ebac7e09ae372bc37c1ba80b6cd69c5f', NOW(), '20240417175106_add_sms_lock_state', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20240417175106_add_sms_lock_state');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT '04cf073e-4905-4d47-ad78-56b864c79593', 'c811a974423f25272f15f6d11de549016c06a04a2c10c41f261560ad9efc9d0f', NOW(), '20240419114622_add_ratings_to_insights', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20240419114622_add_ratings_to_insights');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT '2c57be92-ba54-4a6b-ac0b-7607c4f05d07', 'f3822f7de0f3573657145304fb0f7956eb7fbe9b13d8974fa7f1bb4e82c2f666', NOW(), '20240425121424_platform_billing', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20240425121424_platform_billing');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT '1492566f-efc7-438c-98bb-7a26b79bb20f', '444a8f528aa73ab2e70f7b959014ab689d44fcbc423d56b28753aed2abe3f4e1', NOW(), '20240429100018_add_org_admin_no_slots_notification', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20240429100018_add_org_admin_no_slots_notification');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT 'b8f6263e-174e-4204-8463-f67f721bf0ab', '299491ed525d779b7daeb3ba2fc7e80fc9c7e52d1149d005d9b22ea66162b3d7', NOW(), '20240502213807_add_webhook_scheduled_triggers_to_bookings', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20240502213807_add_webhook_scheduled_triggers_to_bookings');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT 'ac351623-ea6f-4e92-aa4f-d5c4a0402400', 'ad2c4dc709e00ac4f8940feec3b266ed0129257736d26936ede182d6f0b317bf', NOW(), '20240506065443_added_notifications_subscriptions_table', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20240506065443_added_notifications_subscriptions_table');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT '8f31ca34-59db-43f9-9a89-e5cb071f57c4', '5baf209213d007c4687fb84df357404348bee385c208b424036b02780e5979c2', NOW(), '20240506101739_add_rolling_window_period_type', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20240506101739_add_rolling_window_period_type');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT '97bc1fe2-9e20-425e-8149-400a3634d411', '836d64055efea69586df812385de3f1f0a4a35e8ea2877ac1734d69d3b5d5e3e', NOW(), '20240508134359_add_retry_count_to_workflow_reminder', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20240508134359_add_retry_count_to_workflow_reminder');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT '2d6ffe00-33c8-4bba-a2cd-9595ab0ba2e1', '7ed9bb9599fd87b4fe71730ed85ffbdfa79fb486d86c1a2384a1f3481d298859', NOW(), '20240513101457_add_verified_emails', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20240513101457_add_verified_emails');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT '267ed134-9d4b-46ca-a124-fa10d24cd1d5', 'e5811e67d761624ef2a38ae349771305836129d7b01a3d918a629aee37be1f51', NOW(), '20240517144241_add_org_wide_workflows', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20240517144241_add_org_wide_workflows');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT '6e3d4152-9928-4c4d-82ca-e71e2a8133cd', '9f1544255e1c8c366c087664416cb6ecfb4e04cbdde357d01b15c7a57008ee07', NOW(), '20240531082824_add_meeting_attendee_no_show_column', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20240531082824_add_meeting_attendee_no_show_column');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT 'd06d960e-a688-4a90-89e3-87c3f375ebd1', '5d34da67730bd7131d2c828233b27828d3b1c06c72d598757bbf8d742eff9696', NOW(), '20240605135455_rescheduled_by_and_cancelled_by_for_bookings', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20240605135455_rescheduled_by_and_cancelled_by_for_bookings');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT 'd70b5f12-d58c-4ac9-9777-effa1e6c10c5', 'c1ad71cd56050b0327760465229af5377d51a02e039b833fd18d5fabb73bb0e5', NOW(), '20240607082125_removal_of_logo_and_avatar', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20240607082125_removal_of_logo_and_avatar');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT 'a9c219db-de0f-4809-b5b0-b8f129e96148', '5ec5a2d81c8df845a5c907acd5e10455744b2f58431695e92531c5e6c345fc0d', NOW(), '20240610084425_add_cal_ai_template', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20240610084425_add_cal_ai_template');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT '9271028c-7f22-43d6-8720-be10fae165ae', '9ef31b4def73131050a0c5fb19a7dfca41f71cdcfd541044760f08bd09c88d55', NOW(), '20240611054408_add_ooo_created_as_webhook_enum', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20240611054408_add_ooo_created_as_webhook_enum');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT '537b873b-2b98-4863-b9bb-53ace49d7c7c', '20cd0000c54aa5649ddd9c6f4114f6034b0bde1f73efa85a4b6eb24255e49153', NOW(), '20240619195146_add_booking_no_show_updated_webhook', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20240619195146_add_booking_no_show_updated_webhook');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT 'cae6d1dd-72ec-4495-9470-6b89c5b122ff', 'a7100f14cadc1e61b1b867f4beabfc6935dd503be623198e6727befa3a393447', NOW(), '20240624195855_add_instant_meeting_expiry_offset', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20240624195855_add_instant_meeting_expiry_offset');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT 'a3f1327c-5772-4856-a9c5-bea7aa33e5cb', '6837ae6f78ad61e360a8ca2f16a117179f7c57ec3324f4919b57df96cbbd37ce', NOW(), '20240626171118_add_weights_to_host', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20240626171118_add_weights_to_host');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT '87cd78ef-2a36-4761-a905-dbfeaca8efe5', '7dda340be293688f5e66025cdb3bf0f5c5569ba364b2349d516617acfbe37646', NOW(), '20240626191137_add_recording_transcription_ready_webhook', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20240626191137_add_recording_transcription_ready_webhook');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT 'b895292d-e577-4f6e-9124-9b13c431e012', '54e69885fa55ebd98f3febe912525dede7e59bda65e86145c91a83cd78190730', NOW(), '20240627170642_host_schedule', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20240627170642_host_schedule');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT '4e0dacb8-1632-4662-bbaa-67c5f65b1fb4', '05bce7d5d0d23fc86b16991d8a5f6781695a8c263809a403c8c8cc846cb02a5a', NOW(), '20240711080953_unique_username_in_org', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20240711080953_unique_username_in_org');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT 'b0158007-0b6d-4140-b0d6-5248e6d8864c', 'f91c5917dad9ccc31b2b8ebcaddf2dcf92c68fe2251157dae843c7ffa079b203', NOW(), '20240712162735_default_no_show_host_to_false', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20240712162735_default_no_show_host_to_false');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT '23296aa3-84bf-4090-9bec-ae13b963565c', '9ee034d77f528a1826c68122dc6140a77fb661d9e357457edd910cd639547138', NOW(), '20240722105401_add_is_admin_api_enabled_organization_setting', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20240722105401_add_is_admin_api_enabled_organization_setting');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT 'a7782b28-9fa7-4465-9e75-78a644169848', '59fcf67018b8832bf4fffe5f689c781cc0047aa9c0f3469ebfd98139fbd84f78', NOW(), '20240724124035_update_null_no_show_host_to_false', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20240724124035_update_null_no_show_host_to_false');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT '177c0ed2-477a-4247-b9c0-3aa8f24c255a', '3bfecba1d655cf9d22cb085b74fccf7868b8f78f1737a79ee135494deb74cd5b', NOW(), '20240730122536_add_created_by_oauth_client_to_org_teams', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20240730122536_add_created_by_oauth_client_to_org_teams');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT '3fa1b408-f2ce-4746-9da1-a18bcf3dbebc', 'cbb4f1633e6d7d515b9078e40a792ca7855d5e16076339ff33790cfe606139ea', NOW(), '20240730142744_delete_platform_team_when_oauth_client_deleted', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20240730142744_delete_platform_team_when_oauth_client_deleted');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT '7e0b09ac-1737-48e9-9787-ed1c81a9d1b4', 'f9d8ccc2cdac0287ed6caee4df488592e56cfdca701dcddfef969626689f9e75', NOW(), '20240802053512_allow_rescheduling_with_same_round_robin_host', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20240802053512_allow_rescheduling_with_same_round_robin_host');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT '8d5ddb39-775a-424f-9ac9-6958f330257e', '28523acd764cba8728badbbdef959e1c1cd1ac1850b38f93df56616e9fb3a9a5', NOW(), '20240802124001_webhooks_oauth_client', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20240802124001_webhooks_oauth_client');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT '5eca2f27-0c77-445f-835f-1cb492c19374', 'ada65cf89d0d93c0aaf7a95a651505d4f2baf801ef6b7db34e9d4c8b48a5dc15', NOW(), '20240804185106_add_sms_lock_reviewed_by_admin_flag_in_user_and_team_table', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20240804185106_add_sms_lock_reviewed_by_admin_flag_in_user_and_team_table');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT 'b1db10b1-dc02-4251-9ed1-f2a0afc0aab1', 'ee81f91745dd81d7f5605377fb022124a9d325b529a3e0068a2e0fe933fbf4bb', NOW(), '20240808084028_add_attribute_tables', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20240808084028_add_attribute_tables');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT '1b2750be-4c23-46f3-abf9-bc76c38f36bd', 'a6a8b36ce2b0e10324a5666cbdf9555a7fa6acc87ccef2c7bb2c613be6e46d1f', NOW(), '20240810164200_event_type_color', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20240810164200_event_type_color');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT '02b52e4a-265e-4905-a559-1a90e23e0fbe', '34fbf3ed14256ea445eef32f890095762be9d1f53c170baf1c6ff46595f4dfc1', NOW(), '20240813102151_add_allow_seo_indexing_and_org_profile_redirects_to_verified_domain_to_organization_settings_table', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20240813102151_add_allow_seo_indexing_and_org_profile_redirects_to_verified_domain_to_organization_settings_table');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT '8f98a1be-db4f-424f-a0b6-78be062335f8', '0a5b9346e365cf553fea6188211138f23c88b953922a4a35150d36d7524fa451', NOW(), '20240816083533_attribute_feature_flag', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20240816083533_attribute_feature_flag');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT '5cc3c47a-6409-4126-b437-1f969ce570f8', '61cc335027bd18d970fe6b5e64b61693629d4a55ebb28aa0aa783a11148a0e8a', NOW(), '20240816160101_support_multiple_hashed_links_for_an_event_type', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20240816160101_support_multiple_hashed_links_for_an_event_type');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT 'a25e12a8-95e5-4b4d-81bf-081b3a9d52bb', 'd8d1c4a03fed50ce78290fcaed6662cc965eda9a29bfb68ee8bde0453c47058e', NOW(), '20240823033245_booking_one_time_password', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20240823033245_booking_one_time_password');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT '9485de2b-ecab-4d5b-8c1c-70cd740b5849', '895518f998f878f052d806e982b541f82e4f9809207605788492c49a9bb2d7a0', NOW(), '20240823092832_add_requires_confirmation_will_block_slot', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20240823092832_add_requires_confirmation_will_block_slot');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT '1ac5293e-871d-41cb-8862-2c7bf3406eb6', '736e9bf5e8746567a78c132460fdcc219b2351088eb5202ff7f94a233d689c03', NOW(), '20240830084943_add_instant_meeting_schedule', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20240830084943_add_instant_meeting_schedule');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT '7a4332be-2df3-405e-a731-38b465664ac3', '2d79071cf53abd7ce0e58cfbb0fc3330143c697c562195d53e9f8d714c8e8721', NOW(), '20240909084221_add_referal_link_id', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20240909084221_add_referal_link_id');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT '940e9779-13b2-40c2-9785-f5f1655cae58', 'd6abcd76f3fb9689d3a8ab46855242aefa1d9e88f17534c21d7e6e9d407e4409', NOW(), '20240909162522_union_insights_data', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20240909162522_union_insights_data');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT '90fc53b9-eedc-4351-ab89-e0917e66efb1', '1d0a6bca91faf011337b4f7e54037aa0223946655882b44840c3ac0a0468515f', NOW(), '20240910195018_add_event_type_show_optimized_slots', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20240910195018_add_event_type_show_optimized_slots');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT 'e6740728-8f73-4308-8175-af7907d4abe1', '3e93d71c97e732645e45e1f57b98d1e85b7395c81ad2e6f6dd0d7e2882ff5c0f', NOW(), '20240912150824_add_booking_limits_to_team', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20240912150824_add_booking_limits_to_team');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT '9d28582b-df80-4557-a342-0fb3dd2e5a7d', '76eb3d51ae7073ddc0d424e37111d3b4f43a005057fd843f29641023b6e10f96', NOW(), '20240918202101_adds_per_user_and_team_feature_flags', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20240918202101_adds_per_user_and_team_feature_flags');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT 'dd2a2c70-e2fa-4514-9cf8-d9da4ff93377', '37da12d5a78470b262684526123d0c80d2a0be474a8f144dbfb3bffda02465fe', NOW(), '20240920000000_adds_feature_flag_organizer_request_email_v2', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20240920000000_adds_feature_flag_organizer_request_email_v2');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT '5da3f60b-cc87-483b-9b17-6607fe7d8d49', 'ea19ee79fa0e520cca686f9065b95b6050441cd306a9c7fe9dffb4a07d60399e', NOW(), '20240920100549_add_daily_no_show', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20240920100549_add_daily_no_show');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT 'a5b6843a-97ce-430b-9936-b9370f27378c', '3829fd85941379b539186eb93b75738d49b762fe80b944f6bf22f3c0bfd4dffd', NOW(), '20240920192534_add_no_show_daily_webhook_trigger', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20240920192534_add_no_show_daily_webhook_trigger');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT '83625da6-f8cf-429c-ba0e-4dabcbac9acf', '6669ffa7253a18cd2fe70078f650734f32e3de1f6168598a60f74512a4a28358', NOW(), '20240920195815_add_time_unit_in_webhooks', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20240920195815_add_time_unit_in_webhooks');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT '3c48239d-48cc-4abf-815f-bc3817cf4810', '8c6a6a8583bf292ffcc36a9ac3e2df95d44b743dec2bb44c2a0da8201ee372ec', NOW(), '20240924112248_booking_reference_null_credential_on_delete', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20240924112248_booking_reference_null_credential_on_delete');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT '4386c758-6a0b-474c-b05d-4c828678d813', '4ec6e83244c0e9a14c9ccce2309b4408f6561fb626d68d5d6cd90b57602f19fb', NOW(), '20240925153154_add_hide_calendar_event_details', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20240925153154_add_hide_calendar_event_details');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT '68d75730-9a50-406b-80c3-ab2b2a52f519', 'ab3a9aa19c4009c103c57fd8b0443e0928c93329c91710cb9a4c3f12b2ba12e0', NOW(), '20241001091544_add_api_key_rate_limit', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20241001091544_add_api_key_rate_limit');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT '719feb27-f538-41bb-bbc2-81deb4acf4fc', '3c9d10afd9601084a486f0caf0b1d8954443ee94e3c955b15058c467350525a7', NOW(), '20241003145122_add_include_managed_events_in_limits_to_teams', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20241003145122_add_include_managed_events_in_limits_to_teams');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT '76299d7e-603e-4632-99fd-4c912b2f076c', '49617e795d28a220476d341ff3c8c8fb7404e43e7f40f9cc6c892d541c2a8696', NOW(), '20241007134700_add_connection_bw_booking_and_routing_form_response', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20241007134700_add_connection_bw_booking_and_routing_form_response');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT 'edfa867c-1327-4915-88c1-3d8370c3512b', '67dcf88250da6c6d0413c478d04b54c29d921007711ddd2cf4c391cb582c406f', NOW(), '20241008124232_remove_attribute_value_unique', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20241008124232_remove_attribute_value_unique');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT 'a296b3a0-a03a-41f0-9c6a-c81a4bc86a52', '05a54f3f09b67d27732ea009a0044afa432987dada97e49ef85f1ea9a61267c2', NOW(), '20241010070020_add_active', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20241010070020_add_active');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT '2cf137b0-90d3-4d10-94b3-21f00d7e7b94', '9e8c95266c9befbf41d8d416b082288b4059d2dff79f86762267dc8e04dce99d', NOW(), '20241010171846_add_eventtype_parent_id_index', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20241010171846_add_eventtype_parent_id_index');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT '28958773-321f-479e-a224-c46b6482262a', '569d4d52a844e2f1ffb048793af0579a4a30ddb1f00a48d38fdc29a56beffaf0', NOW(), '20241014202509_add_form_submitted_no_event_webhook', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20241014202509_add_form_submitted_no_event_webhook');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT 'e1ce4009-844b-4b44-bdec-b42944a9dee7', 'a2af6bbaeead7244eb3879cec7276a77ed2a3211775cd461b6aeba2d5ce539da', NOW(), '202410181114246_add_membership_indices', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '202410181114246_add_membership_indices');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT '9dc63fa5-3cec-4832-97fe-928846d186f5', 'a88c830651593ffc9e5d5fc045392759774e4c5cb233d5a538253580f11a3a96', NOW(), '20241018121846_add_credentials_invalid_index', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20241018121846_add_credentials_invalid_index');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT '375a6f67-17e2-4b72-b7cd-dd10ac6609fc', '508742154444653afb5d8ba42cfc46a62dc3cabebb4a95286d7f0877fd6c94ab', NOW(), '20241023041541_add_user_last_active_at', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20241023041541_add_user_last_active_at');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT 'f78a2a7c-1c8f-47b0-933a-68c6cef713bc', 'd8569728117c6657276ba807074daef2286e9cddff077ff4e207c43400a5d3f8', NOW(), '20241025143558_add_reassign_reason_to_booking', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20241025143558_add_reassign_reason_to_booking');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT '474509f1-b0d7-40d1-bb97-ae66966d1435', '9eeeabaaf711e26c9f8e2bdf9292d5b6ebfe53efa6b8c637619d8bae111eac71', NOW(), '20241028103610_add_segment_related_assignment_columns_event_type', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20241028103610_add_segment_related_assignment_columns_event_type');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT '3dc0bcb6-e112-4526-8d9e-ab72a24170c3', '8060407ee70109a7a73f8d993a179667bb70dca64d6699467d381a7c8bd1fdbb', NOW(), '20241031084229_add_reassign_by_column_to_booking', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20241031084229_add_reassign_by_column_to_booking');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT 'a9c81e27-86eb-4619-94cd-246188587d6f', '20bc09c5109603c419a662316c966d81110beb5feacf2aaed43776a473a50727', NOW(), '20241101180315_add_created_at_to_host', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20241101180315_add_created_at_to_host');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT '44d9f44c-4deb-40cb-b57b-ec2885d47fbd', 'd2303d5b9a71f93a4a79aa9dc3d91223e614a25304ee26c22bcb2fc5785f17ed', NOW(), '20241108222820_add_weights_to_attribute', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20241108222820_add_weights_to_attribute');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT '6eaaa3cd-61cf-4193-8154-6b88e847f408', 'af7e7bd8481f318228b9cee7b3568efc6e03b961d80a0f5aa6d2d1b8ffceaf53', NOW(), '20241114154333_add_max_lead_threshold', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20241114154333_add_max_lead_threshold');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT 'a2a946da-70c6-43b7-b032-b860279672cd', 'a2da478e383b8ce6d506447e0435dc406ccc60808a59f2a66450090b28c8e61c', NOW(), '20241114174956_add_instant_meeting_parameters', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20241114174956_add_instant_meeting_parameters');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT '8bd35656-3df9-48e9-9ec7-a295cb162289', '97e23941a52e1a60644d8e76c30f1364913b5382e5e7ee57cde537250582dc2c', NOW(), '20241114210330_add_event_type_translation_model', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20241114210330_add_event_type_translation_model');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT 'a41ece6d-8948-46a1-a95d-939d636538b8', '5c5c7fa8e0f9d376a6d2af6067d312b0f5883c36be1881cbcf5cbe883f3c5fb8', NOW(), '20241116180203_add_missing_profile_id_idx', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20241116180203_add_missing_profile_id_idx');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT '541d34fa-9a1a-4042-abae-46dd10f20bb5', '8d6e8f440aec79e162a93b4045d041b9e19fa2f30073ee7eb0914430997de248', NOW(), '20241118085804_add_booking_seat_metadata', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20241118085804_add_booking_seat_metadata');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT 'aa2356a6-d9f3-44b9-9fff-2fd06b61863d', 'e35413f9942b8f4e104c864bd2be9c410f141776cbd2858978e5e379147bd9aa', NOW(), '20241119132536_add_source_locale_and_target_locale', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20241119132536_add_source_locale_and_target_locale');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT '3115a60c-cd95-4a22-8f83-18665372d83a', '5519e4fdf93fb1249928ed6204df2362c62ba80db1211c075929758cae543697', NOW(), '20241119185538_add_index_for_user_and_team_features', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20241119185538_add_index_for_user_and_team_features');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT 'b48fc469-89bc-44dc-8427-c9cad42e5a64', '286f17ba1190af3ed38317dd644c9f6e1254025b88fe8a6a24e444504f1a1cbc', NOW(), '20241120161007_update_event_type_translation', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20241120161007_update_event_type_translation');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT '17c0b23e-b1dc-40f0-bd9e-7547a23b252a', '25d856e1292d023038c45b1489ec48b588347e1e5840d7fc8999473d9fc6dc41', NOW(), '20241121043631_add_assignment_reason_table', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20241121043631_add_assignment_reason_table');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT 'c81dc138-2667-4c70-83dc-ce702be3233a', '4eb0b64b7e929e88ca28124f3fc5d858cb59d2e39d665ba58fcde4058ba0e8a0', NOW(), '20241122050747_add_title_to_event_type_auto_translated_field', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20241122050747_add_title_to_event_type_auto_translated_field');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT 'ec7be207-b3ba-45ce-892e-570a2a3f3ca5', '1f45499a602812ee460c56cf85282243bd2743d1a74173989301b8c627dca1ed', NOW(), '20241126132214_scim_attributes_sync_related_attrs_added', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20241126132214_scim_attributes_sync_related_attrs_added');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT 'c8242c22-334b-4d53-86a9-959f98ff6f3c', '3a77e0d452e80877cc6b3515c914219bfbbc8ddf9b5b9772d088bc099bb2ef43', NOW(), '20241127102756_remove_fields_from_evenet_type_translation', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20241127102756_remove_fields_from_evenet_type_translation');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT 'a29ca8a9-ad90-4258-954a-91643cf44abf', 'e6d9c78c11be46280d0ff50f12686077348428e0ed53cdadd72a4ce29cfa9238', NOW(), '20241129194340_add_requires_confirmation_for_free_email_to_eventtype', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20241129194340_add_requires_confirmation_for_free_email_to_eventtype');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT '6931b047-131a-4986-a90f-37b4c371679d', '26565ad3f506c5be48904c50836685c5bd9fc335da511b77e0bacc4128e49e30', NOW(), '20241202182411_add_watchlist', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20241202182411_add_watchlist');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT 'b512d18b-3a93-4e0c-9419-920cce32cc09', '4502cb45d9e5de358bc5bbbe4490f7f285ee71c7cea9d0559a2ac483cc96eff5', NOW(), '20241203184322_add_watchlist_severity', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20241203184322_add_watchlist_severity');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT 'f1b862f3-d37a-4821-a164-a9ea8c35d96c', '4e565201272bac2c36a1042a7873e8d027ac308139f64d142c92c8042d570b02', NOW(), '20241205095738_add_feature_flag_domain_wide_delegation', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20241205095738_add_feature_flag_domain_wide_delegation');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT 'c22b98b8-96dd-4448-bf2b-0e4b07f54eef', 'c04e30e9f86cba453e3734ce74498904c0e0b0193b63aa46e130efefbf74777d', NOW(), '20241206131352_add_dwd', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20241206131352_add_dwd');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT '9c823de2-27d2-45d3-b93b-f2ce1e10bbb4', '0e89fce565041c7cc9b58335ab49f32c35de79be8f0cc9d92c2ad584bba3afee', NOW(), '20241212164338_create_routing_form_response', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20241212164338_create_routing_form_response');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT 'cc5fc8c2-3c4c-45c2-a059-a6f03f84f1ca', 'fc14cc2c7bf9765de0d51d0218b7f4cd18e16363d464e69f3639d82f21c7408e', NOW(), '20241216000000_add_calendar_cache_serve', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20241216000000_add_calendar_cache_serve');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT 'e122b695-e559-433d-9eff-744fcb5dcdef', '6d68c69b4c47b8db3a0d26b63ac2880ab1f43418d81d0849f24b730cddaed6d4', NOW(), '20241218125130_add_optional_uuid_two_step_primary_key', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20241218125130_add_optional_uuid_two_step_primary_key');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT 'bdc70059-a568-4d4f-b000-1e7d3e0a54d1', '0b10415341e9eae08355fb1acf172a405f3adac8d403cdeb0bd73f6fa711262c', NOW(), '20241218143848_add_event_to_selected_calendar_make_id_required', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20241218143848_add_event_to_selected_calendar_make_id_required');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT '3ece376a-ae33-46fe-83f1-ba85aaa51eaf', '4b01ac965181de84a6ba93ef9d6fb5f31d6ecdb8a51fb64e5c88a89898bb3f97', NOW(), '20241218164539_add_selected_calendar_error', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20241218164539_add_selected_calendar_error');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT '90598504-19c3-4208-80c9-ce2e93101caf', '5de9b529d8582ed500233f634408f844f0066c473a99a0d991334eba20d89c06', NOW(), '20241223163249_allow_rescheduling_past_booking_setting', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20241223163249_allow_rescheduling_past_booking_setting');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT '1472229d-7fa6-42cf-943b-5b6569cfac9d', 'c6545c208366e792dd49745093ca1caeb6c9fb2e303ff1837d41b1e3fe9d4db0', NOW(), '20241224023424_add_index_team_id_on_attribute', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20241224023424_add_index_team_id_on_attribute');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT 'e1d2e8f0-15f9-42fa-a0c6-f4c035e7675c', 'a0b6402bf430204c945bc20c0faf1cffe8b76cbc13ea2c3b479e57132b6955bc', NOW(), '20241230140747531_add_salesforce_crm_tasker', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20241230140747531_add_salesforce_crm_tasker');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT '1c555be9-135d-4940-91a7-59b78da8204e', 'd01512f8b6e55b86db2fffc216d14118b886390242e42f6d37ba930fdccd0dcb', NOW(), '20250101000000_add_calendar_cache_and_sync_fields', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20250101000000_add_calendar_cache_and_sync_fields');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT '15d63648-3e00-4612-b657-9c9be1ef51f2', '3966119f8ffb70562d1802679138930ea2d7dccd44848d52d92f9fa244de4660', NOW(), '20250108095727_assignment_reason_index', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20250108095727_assignment_reason_index');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT 'c7badba4-820a-4383-a017-d1be82e5c4ca', '3d3751382d12eda6007e2af63ca6d9aaba6c099de234a66454cda4eb11d9d342', NOW(), '20250109145213_update_routing_form_response', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20250109145213_update_routing_form_response');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT 'db9e20e0-8cdb-44a2-9018-aec54528f45e', 'f4277136789f313a5829adbdb24eaae62daa5c48947fd670ba75666bd7f7d1b8', NOW(), '20250109161330_update_routing_form_response', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20250109161330_update_routing_form_response');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT '432850c0-39cb-4bc5-a9e1-5ea698c020f4', '0d7fb3b6637053ab89777d658aaa4a5493c9748994dd98860a5dd7693bc6e63f', NOW(), '20250113170733_add_routingforms_incompletebooking_action_table', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20250113170733_add_routingforms_incompletebooking_action_table');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT '7614ec54-363e-46c4-ac2b-38e65c3cd250', '6727ca97c1d002bf84089e30822c653a7a287aa8d5a5e6d8bfdb79462ecb6220', NOW(), '20250117091620_event_type_add_interface_language', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20250117091620_event_type_add_interface_language');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT 'c35d0f94-db23-4277-a43a-418f40d0cb55', 'bfffdc71cc075d90be87e0f88c12dace0e85131a63b8bd95ac0ad8be15e883e7', NOW(), '20250120135752_add_creation_source_for_bookings_and_users', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20250120135752_add_creation_source_for_bookings_and_users');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT 'b12eb419-6e60-4409-9ccc-26b09299920e', 'f478ff15caf436ddac0b7adc09b1a00bbdf380fa2b1dc7a37a143769764e8485', NOW(), '20250122083420_create_internal_notes_tables', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20250122083420_create_internal_notes_tables');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT '6737ee1a-d5c0-4d42-be7a-8284f4f501fe', 'ee1658283d9cbaeb9190232d8b65f748303f08b64e102b2b06765faa5aa4f157', NOW(), '20250123170615_add_workflowstep_safe', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20250123170615_add_workflowstep_safe');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT '77d9a6ac-c9f2-4a0e-b463-99633ca48026', 'b7710e743789e1b76ab154049122b87a869d48120c0aaa1c7a7f4bd3e6d982db', NOW(), '20250203180603_add_can_send_transcription_email', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20250203180603_add_can_send_transcription_email');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT '8003f63d-d149-4830-adb5-dc52f3ca4b0a', '2ae05a7ea4621fa843537102f7cc6427e280bc1b142b885013ba46e9b1ee64a3', NOW(), '20250204105304_add_updated_by_to_routing_form', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20250204105304_add_updated_by_to_routing_form');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT 'ad087fab-a406-4a50-914f-5fb758ce1238', 'ca677f18e6c045a25c6270913b45c887257fe25acc72f73ca3b72916ec4ceff5', NOW(), '20250209012421_add_rr_reassign_reason', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20250209012421_add_rr_reassign_reason');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT '5b539f53-0ee0-4a26-986a-494b0fbf85ce', '3f5f39702bbfe3efb98eec8e91e7c7db14e56aac34610330cfc6376fc78eeba3', NOW(), '20250210114958_add_default_event_types_enabled_to_platform_oauth_client', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20250210114958_add_default_event_types_enabled_to_platform_oauth_client');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT '28e8d781-4873-4a9d-8287-f3791cbcc6d6', '5b2e7f13380523241f5cc36ee88e49cbc6343bb4159da980cbc636074e940863', NOW(), '20250213092458_allow_non_unique_platform_billing_customer_id', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20250213092458_allow_non_unique_platform_billing_customer_id');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT '0fb159db-3a31-425d-b89d-fdf22ae4002f', '3707e18351f0c09aa02543e88fa5e61568a9515e665d148689c8d3001ebb0532', NOW(), '20250213092715_add_platform_billing_managed_organizations_fields', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20250213092715_add_platform_billing_managed_organizations_fields');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT '8463c1d7-75ef-4142-a801-1facdb43de02', '4911896d39b0deef010667e60babc97a65de22562de983444ef3fbb664d8ce2c', NOW(), '20250213093931_create_managed_organization_table', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20250213093931_create_managed_organization_table');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT 'ab576dfb-39f6-4681-a878-4902d4fa9bf6', '9d1afc3df9ac427e97e420361a0fb03826431d88438997a2bbafce6bc8e01b7b', NOW(), '20250213144302_add_managed_organizations_unique_constraint', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20250213144302_add_managed_organizations_unique_constraint');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT '7ffcdc61-2b81-42ad-8a6a-84af6a11545c', 'c8593f5a00f8382bb7a25fe6087411be2a136af282a63fe1b697bf2a2302f32b', NOW(), '20250218111500_add_org_onboarding', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20250218111500_add_org_onboarding');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT '7748adb8-d461-4f10-a963-c2334612fba4', 'c0d7f093bc9f44c8e23b4c6a5e4d8c04e92112f0a2894157b817dc2010c3a959', NOW(), '20250221140631_add_rr_reset_interval_to_team', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20250221140631_add_rr_reset_interval_to_team');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT '808d95a5-1971-47d2-983c-4e34449c7502', '1393b1eb3c05fa6930ca3ad54d6d16bd9c30fc182fe3f4237d4f1d8ce42e88ee', NOW(), '20250226133600_add_last_failed_attempt_to_task', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20250226133600_add_last_failed_attempt_to_task');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT '76f9c04a-e365-4923-9043-bb1ab1fa8068', '1dac0460bb15c529fe3f7795bc37f9cf23509dc1117780c678b1527a1b61e04a', NOW(), '20250305114246_delegation_credentials_schema', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20250305114246_delegation_credentials_schema');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT 'cd870648-3aa2-4770-9189-3edca7b39c3c', 'a6b51ff3c71be05f79c96098737b7676ef4ba91cd0af130d3bea9c0be2a2cd53', NOW(), '20250311134135_add_tracking_to_booking', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20250311134135_add_tracking_to_booking');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT '3a5af346-1c4c-47b3-8096-671a732e3f65', '1b9a563eeafc4a01348dcaaa9882f59e06aa93de0c446051d86461dcaf67ea0e', NOW(), '20250312140531_add_filter_segment', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20250312140531_add_filter_segment');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT '712c5ebb-f564-42b3-805a-6af5783fb680', '9429e60dea6e7562135c8114b7e977248b8621d3a9a703a60891d992682aee87', NOW(), '20250313110448_update_routing_form_response', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20250313110448_update_routing_form_response');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT '32a0edf3-2fb5-42d2-95ae-c918fdf7d579', '16e515bbb09666d7cb49b0c4a6c191e13dcb9b512e17fde3e8787f41244b317e', NOW(), '20250324051542_add_hide_team_profile_link_in_team', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20250324051542_add_hide_team_profile_link_in_team');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT '3790f5e6-acf6-45fd-9e9f-28f37815ce99', 'c9bdf9d115e030cd447736fbc6537038593e8e84b72d28af6e0c2b989b762c2c', NOW(), '20250331140235_add_reference_uid_to_task', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20250331140235_add_reference_uid_to_task');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT '5090566f-7aad-49ea-ac14-395b463de16e', '5afa5fdda2bd043225b7c98e0e57ffc82ebf36bd51589eaf6fe09309c9b1eca5', NOW(), '20250331185500_adding_disable_cancellation_and_disable_rescheduling', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20250331185500_adding_disable_cancellation_and_disable_rescheduling');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT '28cf3b88-0691-4546-abce-8b89e20a3585', '3e234b622d39466e142328f266fd524ba72074b5d3ddf2a1f28197165486ace1', NOW(), '20250401191319_', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20250401191319_');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT '8613cd79-9889-439e-b4b7-5c2fb45022f0', '20cc7c42bfc477d3c4781e0a9788efbfeaa8dd47922a62d177ca5bb5d2e81d8f', NOW(), '20250403094343_add_search_term_to_filter_segment', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20250403094343_add_search_term_to_filter_segment');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT '90e2eff3-71ee-490e-92ce-3a4105f60bd2', 'fecb2929c7f4c546529c5940319d13c5fda6e801c94d85bfe96fa7e755dcdfa8', NOW(), '20250407034337_add_id_field_calendar_cache', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20250407034337_add_id_field_calendar_cache');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT 'c4c02110-0f05-443f-839f-485f931b394b', 'e5deff57be244c9cf6fba1526b6e8e2df9cad0501d15b9a9c173977dcbf2a3e2', NOW(), '20250407204810_add_membership_creation_date', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20250407204810_add_membership_creation_date');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT '5605b742-b291-4ca2-9f9b-ab5b5985fd15', '84426639f0b97a4cf6df866ca739aa5c9c6576767bc756c41a5b6dbda95802cc', NOW(), '20250409135411_updated_at_routing_form_response', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20250409135411_updated_at_routing_form_response');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT 'ca952887-6bcd-4d04-959d-e450dce851e0', '70251da880bc7b39a3596d8908e765cf6817b333e0b0d846873bd4cb2d7be5e9', NOW(), '20250413115818_add_azure', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20250413115818_add_azure');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT '83439e9e-d4c4-45ea-96ee-7c9dc95ca1a0', 'a92338a3e7582c6da8d5f969410f70ff2e71747d1ece0c031765dc764387b72d', NOW(), '20250415173346_add_whitelist_workflows_to_user', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20250415173346_add_whitelist_workflows_to_user');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT '193385e4-9001-4aec-aceb-5c8affb71995', '367e2a8ac0146ee809011b46d9bc82f0115a2fa7d3807a53faee240b931db387', NOW(), '20250417131239_add_workflowoptoutcontact_table', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20250417131239_add_workflowoptoutcontact_table');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT '9c66092d-96d2-4df9-a2b2-38f57ce9e0ab', 'cf59760687d694eec6bd25d93ca85c021b382cb8a73eccdfc3475ea4fd876570', NOW(), '20250418155253_custom_reply_to_email', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20250418155253_custom_reply_to_email');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT '6550d3d9-8837-4da3-b98c-731784b7ede9', '6ed6e4d6ecf02d80edd1a8b7a960bdb1d260731e30c9cfb33ac193a4f79e00e9', NOW(), '20250419103412_delegation_credential_calendar_cache', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20250419103412_delegation_credential_calendar_cache');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT '4aaf8c7b-7d75-4ddb-ae1f-01a7409f6067', 'edd1daf2ed29361bf5adcc5b6e03f3a9ae644472e74d685ac00b86143ba55e73', NOW(), '20250420171801_hide_organizer_email', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20250420171801_hide_organizer_email');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT 'b1c6d7e2-5874-42cd-b9e6-da531a2b569d', '912a7366e85a2198f82ddbdd9fa3d204456ee895beb2ac8345fabc7263d51466', NOW(), '20250425220800_add_selected_calendar_credential_id_index', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20250425220800_add_selected_calendar_credential_id_index');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT 'e65c206b-ebea-4afd-b84f-c9610d6cb8c1', '4d546a5543e2c8a560239fca7f50114628f6285750fd64ba63ee3673efa3116c', NOW(), '20250430031041_add_include_no_show_in_rr_calculation', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20250430031041_add_include_no_show_in_rr_calculation');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT 'a11ca1ac-86e7-417a-b58f-4c109de82a5b', '0a706c070d79ee6ed0a8d8745c0c17ab2ec6e1f6f5bc88d91fee4b56da5ac0dc', NOW(), '20250430084050_disable_org_phone_only_sms', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20250430084050_disable_org_phone_only_sms');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT '79e6e5ca-03dd-4e67-9dbd-3d96ac8f9755', '2735fb5ed10137829f1229a85d046856019a05d2619cdffbb777075a56eb43e1', NOW(), '20250502113653_create_denormalized_tables_for_routing_form_response', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20250502113653_create_denormalized_tables_for_routing_form_response');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT '43ab5bd3-7c0c-41b2-a655-7edcbd86d389', 'fb2e8b595b85daba3bac8c018b2107c6006289bb6408eb7c2727e436da9e094b', NOW(), '20250502113828_setup_triggers_for_routing_form_response_denormalized', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20250502113828_setup_triggers_for_routing_form_response_denormalized');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT '8f649025-6f63-42e9-b749-d7b6c1f0a467', '3badc0e74d72033c2228f72df8b588e31bf9fdec72c434addab151aa67af5ee1', NOW(), '20250502114245_setup_triggers_for_routing_form_response_field', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20250502114245_setup_triggers_for_routing_form_response_field');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT '1173f84a-35fb-4f05-9560-e0fbd4453c35', '5a6f79bf846ab78c63fee1d560a250fc7eb52f9c11f3967bf002baac5d7de189', NOW(), '20250502130807_create_booking_denormalized', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20250502130807_create_booking_denormalized');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT '707c463c-7f25-4712-a781-39656cd0a6a5', 'c65e45b89befe0cf69b60434fac9bf97b447c0525494d0f9045fd80804ed9391', NOW(), '20250502130843_setup_triggers_for_booking_denormalized', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20250502130843_setup_triggers_for_booking_denormalized');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT '4a245ee3-0ab3-4eac-81a4-e6deedac2680', 'f7635165f57958ab1c989621eef7fabc996238c7311d5dd1e905131291de7de4', NOW(), '20250502154530900_add_login_overlay', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20250502154530900_add_login_overlay');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT '21825cd8-e5e6-4663-bc97-c640f00891c8', 'dc6ac1ae44dfd997fe0e81af44104a648bbc533975d4833fb05b1e8e5bafa5de', NOW(), '20250505135207_create_booking_time_status_denormalized', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20250505135207_create_booking_time_status_denormalized');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT '372f907e-e2da-45cf-9053-bcc8287ab696', 'd63c68116ae48692417dc82fd9e69badabd57d5c3ce94498fa6fc41ff0025f9c', NOW(), '20250506000000_remove_around_from_event_types', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20250506000000_remove_around_from_event_types');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT 'cc57ea66-6224-4e70-b15d-b7c897f8887c', 'd772d54c6d17c447bb60ecb0ec7545ed5e508b979a33b29372d3972131c1a853', NOW(), '20250506000001_remove_around_credentials', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20250506000001_remove_around_credentials');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT '93da6311-b6ac-48ed-90e6-512796c9bfb4', 'be1fcfadf841a2df426af6146f3524a81a9d9b654c6de4baa4f237bf6e8c7d0c', NOW(), '20250506000002_remove_around_app', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20250506000002_remove_around_app');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT '361a96bf-f052-48d7-8ac8-a80de78dd879', '501d48e3c268663fbc5bd11dde867dea2c7ec51efa964eb46e21ec3d52750302', NOW(), '20250506113723_add_credit_balance', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20250506113723_add_credit_balance');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT '7fc57484-519c-4c2f-b276-2a044a8fe89d', '1c51b402acaf78464dd2fae726d5814a1bcb9b23f794141e2e92eb528cfefd6e', NOW(), '20250508131736_add_workflow_smtp_feature_flag', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20250508131736_add_workflow_smtp_feature_flag');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT 'f5ed8848-1109-4d0e-b064-606b49d1cacc', '5bdb528fb5e4da840cb94f9247b53740a90e91f1367bbc3e37d6a27c97cdbf08', NOW(), '20250512153630_add_use_api_v2_for_team_slots_feature_flag', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20250512153630_add_use_api_v2_for_team_slots_feature_flag');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT '6a3c350e-9999-49c2-ad6b-37a5cd107086', 'bd907daa934bd00c57d1b7b5c28253a0e4dfe9b3cb3c47aca1dea289c6b85b11', NOW(), '20250512205531_upgrade_prisma_to_6_7_0', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20250512205531_upgrade_prisma_to_6_7_0');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT '4076a6d3-39ab-4e88-815d-40e7f04f3aee', 'b79120b849303d83613d36d84e3a8af08b09ede7887790ea8395b4f993e3e8f3', NOW(), '20250519083756_missing_migration_routing_form_response_denormalized', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20250519083756_missing_migration_routing_form_response_denormalized');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT 'c4600f35-1236-4941-8644-f257d327d40a', '0f3c4873781f516f76d59e67e52d991d57a8623cd3bb2c96befc070209ffb6af', NOW(), '20250519090442_add_schedule_restrictions', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20250519090442_add_schedule_restrictions');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT '4161c5cb-2d49-41fe-beda-4d0d89d158f9', '090d7b758c94cffc9d2ca0c3cd7e83fc50a561746762ee925dfdf116235e932c', NOW(), '20250520071309_add_pbac_tables', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20250520071309_add_pbac_tables');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT 'c0a7d9bd-0460-4272-90c0-7b14e1d9a440', 'fa232707d1a0e0fe5d87cdc07106520f3e3d6f8e424d5d32022718ffe1783a34', NOW(), '20250520072457_add_more_error_tracking_fields_selected_calendar', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20250520072457_add_more_error_tracking_fields_selected_calendar');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT 'c6b40a59-e25e-4ccf-b879-eeaf46156242', '1132cbc7aee2f19d4434c802306894aed3d37313dc6774770505cc9fa4ad17c3', NOW(), '20250520103718_add_last_enabled_at_disabled_at_to_delegation_credential', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20250520103718_add_last_enabled_at_disabled_at_to_delegation_credential');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT 'd49d65d2-f769-415b-95de-bb1aa9033cdc', '61b51ae58b100ec20b1d7806623d1e7b9a4882d38beee92a287f30f3d07effa2', NOW(), '20250520103801_add_missing_default_now_to_created_at_membership', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20250520103801_add_missing_default_now_to_created_at_membership');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT 'b592c698-6e9f-46c6-9282-9e171ca415c8', 'cc382e59cc6083705089db77d26edc8d713298981dcb00d87bac19e26f26faf2', NOW(), '20250520143014_booking_denormalized_backfill', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20250520143014_booking_denormalized_backfill');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT '05c34ef6-88ce-4223-b0b8-8636598ec56f', '4e3b764a3921d784e2a2b20287195c7911f78651e969e49235a0bf7887503208', NOW(), '20250521070158_add_pbac_feature_flags', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20250521070158_add_pbac_feature_flags');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT '6ebf8cdb-16e9-42ac-87d5-540e8628e0b0', '402a5289cdf2bf9fe4d606a6a114438a70363acbeb6f23f4dd1ff94a4639eeff', NOW(), '20250522083627_update_memberships_to_new_roles', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20250522083627_update_memberships_to_new_roles');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT '82c57775-e600-4688-93a0-113651ba66d9', '2f7c94f5f3c2b6254900a6dc7aad5fd6cc13b55f79671751c894fab175f46d3e', NOW(), '20250523155738_add_cal_video_settings', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20250523155738_add_cal_video_settings');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT 'c7744c69-0a73-4899-a766-1d00cfc531a8', '045b3e4f3198edbd5cfe3900581eae27adffdeb4bf37d395f243377868cf984e', NOW(), '20250525034030_add_index_credential_delegation_credential_id', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20250525034030_add_index_credential_delegation_credential_id');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT 'b2d60055-fc84-4274-9c9d-aa719a0d6e51', '0c2b06b92b6f954f090d28c2bc752c791945c8ef69a4ba08ceb648ae9a956e38', NOW(), '20250526143547_create_user_filter_segment_preference', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20250526143547_create_user_filter_segment_preference');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT '5633b5a9-edf0-4545-be2e-4aff5f54a2bb', '8a7ac6170f1bf87be1d7bf1b486c7d1bfe7cedc291d42fa62905bebfb8dd5720', NOW(), '20250527091330_add_color_to_pbac_role', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20250527091330_add_color_to_pbac_role');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT '66b49c43-7456-4214-a83b-654a45fec89c', 'b88333fa9db2d84f3162b4a0cc5559437acef89de3debc5d3579741efccdaf3d', NOW(), '20250527092133_add_rr_timestamp_basis_to_team', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20250527092133_add_rr_timestamp_basis_to_team');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT 'f89086a6-3791-4078-b6d5-df8002db2a46', '9f45ab6730a83478d928df1c906552c954dce5e10f3b7344279665374505a1b6', NOW(), '20250528061149_add_transcription_setting', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20250528061149_add_transcription_setting');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT 'eb2e2274-cb93-49a5-950d-113271d14152', '92b7bff30deceb5d948d87c3806644603ef8fc8b9af9e6055362ce9017a25e39', NOW(), '20250529130535_add_index_restriction_schedule_id', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20250529130535_add_index_restriction_schedule_id');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT 'e010e843-def9-444e-8c14-4cbe29ec6000', 'bd09df339bcb6f90696ea271d7e1ce343a7d9d2165614553fb1745e3a846c565', NOW(), '20250605102526_add_allow_reschedule_of_cancelled_column', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20250605102526_add_allow_reschedule_of_cancelled_column');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT '0a5decc8-687e-4d7b-ba65-f0bd4da4488e', 'f17774983b531fd06f234befe4fc619ba4e93ea705009c5fd4fe075e5bb6208b', NOW(), '20250609132708_added_bookerbookinglimit', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20250609132708_added_bookerbookinglimit');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT 'be733675-81ce-415d-9df5-a074cd635bc5', '4e8329c078509d9cc94b005a8c5495e01e10f073bb787228b3d5a03cfd207a8d', NOW(), '20250610135051_add_transcription_cal_video_setting', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20250610135051_add_transcription_cal_video_setting');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT 'd989df69-0030-4823-9789-cc8f533aa967', 'eb1fbd20e87fc963a7de6cd5ed7f8719dc214ae7bb1f1f475e0dc8abd92a1cad', NOW(), '20250611095054_add_are_calendar_events_enabled_for_oauth_client', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20250611095054_add_are_calendar_events_enabled_for_oauth_client');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT '799d36ad-669c-46b2-a659-e68113125ff7', '7dd66b9be5b6a45bf3609c8bf4fe1f7d7dd30883a1e7b8f868923ffec5fcc522', NOW(), '20250611112835_add_credit_purchase_log', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20250611112835_add_credit_purchase_log');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT 'b7c250b4-aed0-4a1a-bdca-92f2336098bd', '05bb30df1e20830c08773579b7ce041d9401bccb9ec48d2d7409c62c295cb66a', NOW(), '20250611123345_add_sms_segments_to_credit_expense_log', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20250611123345_add_sms_segments_to_credit_expense_log');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT 'e2888aeb-e42e-4858-af51-2aaa3eb04679', 'f43940f4e2a6bb8c4da2d6e7599523c90fa66492d3d9a8ff24e5d635ae3df250', NOW(), '20250612210429_remove_profile_cascade_delete_on_eventtype', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20250612210429_remove_profile_cascade_delete_on_eventtype');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT '76d1c0f9-4668-4aa2-b262-ad743ddd7a8b', 'c9289f7266bf6a4959f54f7f7c730f1c0ccddc82047cbaf86db7b0968092960c', NOW(), '20250613224705_max_booker_booking_limit_offer_reschedule', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20250613224705_max_booker_booking_limit_offer_reschedule');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT 'aeb15219-ee26-47d5-a34a-066edf032da2', 'd841814d35c91a57a0b45105791ecf3d7448e3a8201db653d7fc070fc4513118', NOW(), '20250617060130_add_queued_response_table', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20250617060130_add_queued_response_table');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT '4a3102f0-0440-4525-8339-199b07dee763', '1c8fafcfc7074895ab90c7c358dc7edf90a15f124a32e6abe794a9226739e6d3', NOW(), '20250617070118_update_memberships_one_time', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20250617070118_update_memberships_one_time');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT '2cd0b687-ed31-4f05-a75a-2c27c09473f4', '8b0cdf06590478df6b74dada11fb718db2196be0d7f22125cd2ff90ff2661dce', NOW(), '20250617092501_add_automatic_recording', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20250617092501_add_automatic_recording');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT 'f0729269-36b9-4be9-afb7-7eb39f7d8724', 'b91831091d25dfe6b38f5b4f1dca5729d5416a4c3e555585268c90c1f2ba1d8a', NOW(), '20250617123959_update_handle_routing_form_response_fields', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20250617123959_update_handle_routing_form_response_fields');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT 'e3a67426-a5df-4267-b1f9-53858872f231', '349a37109b0f9abe4002e77b2e27883b3de4ea87985d166d45a9917ca9819629', NOW(), '20250618093846_routing_form_response_denormalize_backfill', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20250618093846_routing_form_response_denormalize_backfill');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT 'a25099f2-0af2-4c95-ae8a-794d132d57ff', 'f0d6a6b1cc62ac888357c79a0ff1ba6d3d28e372d08edae407f1861bdafe4950', NOW(), '20250618093923_routing_form_response_field_backfill', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20250618093923_routing_form_response_field_backfill');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT 'eea77e75-3505-4870-a644-68f9205c48c7', 'f71beb10fd63736a384aa199eb7c34018282566e8053c9ab79018b300829b637', NOW(), '20250618151833_add_uuid_to_app_routingforms_formresponse', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20250618151833_add_uuid_to_app_routingforms_formresponse');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT 'b941dbf8-07b9-44cd-a69d-d3d11cbb69e8', '9756a01d920a810aadd70586fd86b162d61451ca1deb2670a408081b0e746912', NOW(), '20250626092518_app_routing_forms_form_response_uuid_nullable', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20250626092518_app_routing_forms_form_response_uuid_nullable');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT '2b5d4ce5-4c0f-4f90-8056-08fa7bb81a9b', '2ce40e3ab5cab4bfedaa08d26dd89866b1bc466812bbe0a2534d255bedafe6dc', NOW(), '20250627091352_add_signature_token_to_deployment', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20250627091352_add_signature_token_to_deployment');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT '2cbb5776-057d-47e8-9476-b87b88f660ef', '4f1fbc8fe0e8ceb0e046f03a5aae7262440a8419da4ca2dcc0d91eb2cbc2e03d', NOW(), '20250627195833_add_date_fields_to_calendar_records', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20250627195833_add_date_fields_to_calendar_records');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT '2f4eca8d-f602-4de7-aa7b-aba34575aa31', 'd800861c8d01e47b1482042b43606ec18590af8d71eb3e8761d17136ccb5e993', NOW(), '20250704081718_add_host_groups', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20250704081718_add_host_groups');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT '8e6af0d6-da9f-480d-b743-1cd29da25c42', '7943a9d2313f6a3ada5ccab1d892a485dd070d7d2a1f6ef2e8ec698b3328bfb4', NOW(), '20250707145503_add_private_links_expiration_capability', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20250707145503_add_private_links_expiration_capability');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT '6e419346-1c20-48e6-ad0c-6a8f9fc2fc17', 'c0abbb41ebe0f4010f783a92d21e811a72642d8a6bdd3a7d109053aa4f967a2d', NOW(), '20250709150348_attributes_unique_on_slug_team_id', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20250709150348_attributes_unique_on_slug_team_id');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT 'f0671aaa-0544-4776-baa8-6165f4f287ec', 'bccb117d3cb1a2a0590c5d741daa5705136a8f14d57691d498ea2e54784374b1', NOW(), '20250710172011_add_indexes_and_uniq_index_to_task_table', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20250710172011_add_indexes_and_uniq_index_to_task_table');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT '478f0692-8388-47fe-b290-eac073387367', '66d7583100662402c1fa9cd55bd622b95ffcc0f6aff4e27bb07c8712449f8aed', NOW(), '20250711154030_setup_triggers_for_routing_form_response_denormalized_2', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20250711154030_setup_triggers_for_routing_form_response_denormalized_2');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT '46fb8ce8-5534-4c0b-85e1-52501ad5e6cd', '4bba3bb77368a15b8b6ce042a48849c14518e958b2e34eeecd5a58bb3c25edbd', NOW(), '20250714075355_add_attributes_pbac_permissions', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20250714075355_add_attributes_pbac_permissions');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT '2bd51e51-2c78-419e-bc9a-9dea4fbb72ff', '4231c72ace2585d11554ecdf48d026f66b31476ca042c827a2c3943ec93838d8', NOW(), '20250715154531_event_locked_timezone', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20250715154531_event_locked_timezone');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT '5b738201-18f2-4a56-8038-d74ed4effc54', '49cd6f39b0ddb9bb5e3840c4e87ebac2dd20dc3bab0f32a9eee98d8827cf4438', NOW(), '20250715160635_add_calendar_cache_updated_at', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20250715160635_add_calendar_cache_updated_at');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT '058da434-d9fc-429e-96f4-6961bb5cce70', '3077b89358b44f361edcc29a0c8964f2efd1a548bd1f150dfe6818cfe0e32607', NOW(), '20250716135157_team_booking_page_cache_feature_flag', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20250716135157_team_booking_page_cache_feature_flag');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT '6115072d-ef96-4de7-bd83-d63aaa7a50ec', '939ba7f79de225783824c8da797a8479a1078d37dbc960638349224a0f8d508d', NOW(), '20250730091450_add_host_many_to_member_one_relation', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20250730091450_add_host_many_to_member_one_relation');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT '31f0919a-a2ce-4e49-a2ad-ea08835a11cc', '09864934e7a74ae4cd06829e0fa362283c5637452a69e46bdb46ae1b84f065e4', NOW(), '20250731135727_add_phone_email_to_expense_log', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20250731135727_add_phone_email_to_expense_log');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT '008a59bf-6ea1-46f6-8eda-4bbf748e3b32', '32461ad899f1e3f17e721109aa8d7115c4502c97f5f3ec07426e67cb6d74f30d', NOW(), '20250806093054_insert_role_permissions_for_routing_form_pbac', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20250806093054_insert_role_permissions_for_routing_form_pbac');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT '8cf441ec-c175-44b3-97a4-1528f0e4d5d2', 'd2d1d52f1add9804165eb2692383f7940ce24a75a8db9146a9c49b47b0f5ab3a', NOW(), '20250807134931_add_cal_ai_self_serve', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20250807134931_add_cal_ai_self_serve');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT 'e8f65113-c787-44ca-90fb-ff8b804dc3b5', 'e2dacca9db1bf938f9830b8d90231a0bd1709cfb1fc3040e32348d34cfa69f9e', NOW(), '20250811123707_add_team_list_members_permission_to_admin_role', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20250811123707_add_team_list_members_permission_to_admin_role');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT '69dc92b5-e86a-4ea8-997a-8266d666f6d9', '3579d83e848a1e7a18520ea10d3cdd3e6ced2d353c830812849714eb79ae7939', NOW(), '20250812084523_add_system_segment_id', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20250812084523_add_system_segment_id');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT 'a634774c-f655-49c4-a662-f84c050a22c5', '2e7712039d0f612708ffd13da1e1b29d158c6f60095fbc1fd91572ca26585a8e', NOW(), '20250812101632_add_impersonate_permissions_to_admin_role', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20250812101632_add_impersonate_permissions_to_admin_role');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT '10cd6a11-3966-4a19-a669-fd53a08d3b3a', '1b38eaa9a2b31d9f1717aff1a31612ab85dd7585aaae74700aed59fea270fdfe', NOW(), '20250813182504_adding_booking_triggers_to_workflows', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20250813182504_adding_booking_triggers_to_workflows');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT 'b248822a-ca43-4554-8c79-7bab542fa936', 'e648ed8fb16f38c6e4769f445aa4ea8d3a50fc499f9ee120260078acf1c5fe15', NOW(), '20250817234749_add_cal_ai_voice_agents', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20250817234749_add_cal_ai_voice_agents');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT '305cdd68-39f7-40d0-976a-3d43e9a19a16', '9e4898e9a878c0ca201b596c2143e904e9b336ddc6dd14441b6120ebf5b9d9ff', NOW(), '20250818151914_routing_form_response_denormalized_backfill2', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20250818151914_routing_form_response_denormalized_backfill2');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT '494460ad-a058-4513-aa2f-ba18788aa5c0', 'f9fb3fa2d043a40d3c552bf32da2d88e83b8700b5042eeca1b1029b65631ac85', NOW(), '20250820094118_add_event_type_booking_requires_auth_column', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20250820094118_add_event_type_booking_requires_auth_column');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT '1097d9fa-9d2e-4b2e-8cf9-4b45d54895bd', 'dbc4cc2bb08eccfddebc8b28df9e9098392c5accaef01fd13c34e078fbc9ce5b', NOW(), '20250821141229_add_external_ref_and_duration', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20250821141229_add_external_ref_and_duration');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT '89acf766-bc83-43b9-a3ea-5f3c02b4a30e', 'ecc7edbd4ff7c56e4bd624bc48b01d863dc1b17e484558e25b947267b9c8773c', NOW(), '20250829133535_add_member_defaults_permissions_teams', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20250829133535_add_member_defaults_permissions_teams');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT '9c0d2cec-acfc-4b92-b8df-7d2a7e457716', '13e2fd359ad028de41cf7e5d94b28b9bcb2724120d67cf5e1e290c3c617a14c4', NOW(), '20250902070438_add_disable_autofill_org_setting', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20250902070438_add_disable_autofill_org_setting');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT '175885b2-9176-43a3-8ebd-29dd236958ec', '208e7e5654bbbbf6e1360ea5553aba24a8ca5faefc54268a72ef3138680c5001', NOW(), '20250903165210_add_on_cascade', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20250903165210_add_on_cascade');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT 'c09e5220-77d9-405c-b317-57227c54be17', '8f2e4c865ccdd7f42a018f22b796fd4d051dffff05ca80d1794cb1f8704a3bd3', NOW(), '20250905082756_change_internal_note_preset_team_fkey_to_cascade', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20250905082756_change_internal_note_preset_team_fkey_to_cascade');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT '3bdb868d-3b6f-4233-9524-14d927c6cf07', 'ebf2354e206b74237ef249cd24261adaf4e5d1dc8211fede919d1a2233f2e2c0', NOW(), '20250905115031_add_webhooks_permissions_default_roles', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20250905115031_add_webhooks_permissions_default_roles');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT '59e84000-f97c-4d5a-98f4-0fb52f5fd320', 'a2a304eda15f2dd198c7858d01a64fd08870359edb2689db36d2e5a9ecb1b71c', NOW(), '20250905121358_add_feature_flag_tiered_support_chat', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20250905121358_add_feature_flag_tiered_support_chat');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT '0dc5a305-5b81-407e-9498-cc1c1f91aa4f', '29fc08b1bccacf86958b18e2c78c970c276997713c92e4d360738afb162e8025', NOW(), '20250909093954_add_form_submitted_workflow_trigger', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20250909093954_add_form_submitted_workflow_trigger');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT 'a31c5513-1460-4fa2-99f8-94c229f576c9', '0becc18e592da428dc16e9cf18beb1cdca5668df9e3741255fdddd46b66cb4e8', NOW(), '20250909134440_add_form_submitted_no_event', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20250909134440_add_form_submitted_no_event');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT 'aa322e7a-2b25-4db1-8564-f69f54e00496', '2943af21db2e5ca51a1a92d2441e7cc0a3eac052889f1f63a74d836624d0b6f0', NOW(), '20250911093331_pbac_team_billing', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20250911093331_pbac_team_billing');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT 'a8d1094f-44bf-4bf3-8c45-2657658d229e', '00f210e25e1838f7b90ec1db1be448a7614d4c0e2889ace068dd9cb63c5fc54c', NOW(), '20250919124540_booking_denormalized_starttime_endtime', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20250919124540_booking_denormalized_starttime_endtime');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT '226082a0-18fc-4915-8d7c-1c5e8714f474', 'b1575daf02c07e72278b8ddfa08a98bca9e3498116469ffa16a900b11fe3e44d', NOW(), '20250919174231_add_event_type_timestamps', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20250919174231_add_event_type_timestamps');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT '18778ba5-173b-40ec-9795-070aad6651f8', '89b9f1635de1dcee41b4f85eac94d4fb4efebce5c8f144c768b970334ab9a379', NOW(), '20250923082416_add_spam_block', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20250923082416_add_spam_block');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT '06e38302-46d6-4e20-90bb-7d8a049bd06b', 'a68e4bd0d03432f5087ea297741f76e659f0d0e8c639cf07b335bcd337d07ae5', NOW(), '20250923085350_add_list_members_private_permissions', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20250923085350_add_list_members_private_permissions');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT '99b6fb08-332a-4e00-92a8-9068bf894307', 'd94e99926cb5f9a031b6e2c32bd9b70c2e9b2fc2f7c7989072937d7a58d96c4e', NOW(), '20250924082337_remove_booking_read_permission_from_member', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20250924082337_remove_booking_read_permission_from_member');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT '4298ff99-8b11-4994-b3c3-e962aabd290c', 'c35e841efcea6b86a267fca38f08a1e891a37544961b312d935d788db060fa42', NOW(), '20250924091435_update_watchlist_created_by_id_fkey', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20250924091435_update_watchlist_created_by_id_fkey');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT 'e182d03d-edb9-436b-9db0-f69630302efd', '88bcb2db31bcd9705eb534db54680914905f4d6b029afef86339c0a28b426d7a', NOW(), '20250924205500_calendar_subscription_features', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20250924205500_calendar_subscription_features');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT 'b6a713e8-a9a1-440a-989e-9c3b4cbd8ba2', 'eb48f26a164e927aa0a421278f7073fc6146051631a5b09ca712d547840a7756', NOW(), '20250925122623_add_default_now_eventtype_table_created_at', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20250925122623_add_default_now_eventtype_table_created_at');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT '183dd485-7498-4dba-ba0a-457b61272377', '856cf2cf6086dc67f5c7a0de8886f36df07170cbcd052f61671b4bac7f098158', NOW(), '20250925134226_add_availability_ooo_permissions_default_roles', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20250925134226_add_availability_ooo_permissions_default_roles');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT '784f4045-b650-4717-8d27-01681bda4486', '868dd16e84540d85882b6d57d5850a8302b9ae224c5b4eff058b4dd70b2f47e6', NOW(), '20250926134500_update_watchlist_action_block_for_critical_severity', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20250926134500_update_watchlist_action_block_for_critical_severity');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT '85f33ec4-7c57-4c3a-acc6-22afe71b88fe', '18ba5292140731287499f8d7c8dee84272532fd91637c48fb67a81be1f02f6bd', NOW(), '20250929190134_init_team_and_org_billing_tables', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20250929190134_init_team_and_org_billing_tables');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT '36671fc8-2940-465a-936d-775baecc3fac', 'a7e6db14215620a81676b805e8f8b8d56d4c4ff5f0543bde5b5642fca4c7366b', NOW(), '20250930135416_add_type_to_workflow', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20250930135416_add_type_to_workflow');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT '8ae834fb-1e9b-4352-9785-e201153d830e', 'b03a8895ad5854ed19cf24b0c318605451a436b84324b6ad0db93072da966910', NOW(), '20251002092823_add_booker_botid_feature_flag', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20251002092823_add_booker_botid_feature_flag');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT 'c18ae1e8-7329-48df-9502-349a6c354c10', '37384314c42326bd78358e05dcf6f215101489990b4ecdcd2728a64f5705240f', NOW(), '20251003103832_upsert_watchlist_audit', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20251003103832_upsert_watchlist_audit');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT 'c59a208b-9350-4928-a3a8-7af5194c8b14', '819d0a0ac46ca214bbc042e97f32909b9c54a1800ccdfba80a7b4648c83d0d72', NOW(), '20251005102651_add_onboarding_v3_feature_flag', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20251005102651_add_onboarding_v3_feature_flag');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT 'd9775693-df33-4ff7-a214-867d55a3de5d', '662cf7a66fe746440846608dec398cac8697ab0c4e5ecf91c49fd0cf319a9161', NOW(), '20251006103705_add_inbound_agent', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20251006103705_add_inbound_agent');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT 'c326c2ee-04e5-4e4f-a0d9-ec541ba0c1e8', '433aeb24549ccb848260930df6f78712e04961e0d1a5060edf877b051a38ba68', NOW(), '20251006111422_add_requires_booker_email_verification', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20251006111422_add_requires_booker_email_verification');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT 'b1230ab8-0a7a-4897-91b9-54481a555be9', 'aa5b1d13d9a130b7fd15e565df35167ac364b7e1d01f88ec161e1ec8459141df', NOW(), '20251006191654_drop_watchlist_deleted_column_index', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20251006191654_drop_watchlist_deleted_column_index');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT 'aa891270-3375-4af3-be17-82d2d50c6f2e', 'd4d6fc3ed45627a955be6d53b8dd0db35f94b33b2cd553ba63234a9e88826b7d', NOW(), '20251007090722_modify_onboarding_table_orgs', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20251007090722_modify_onboarding_table_orgs');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT 'b4fb139a-f659-4903-b415-826161920766', '33eb5080236f6f382684af6e7edd158517c19b8d3df7180926d2e8b0d4e9cb81', NOW(), '20251010135752_billing_tables_add_dates', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20251010135752_billing_tables_add_dates');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT '8d9b8edf-c64d-4cfe-9c5a-df364776cc8d', 'a95f64175c9f561be7dccc130d6524b536f9cf8438c5bf09c2f14e8f5437f3aa', NOW(), '20251013185902_add_booking_report', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20251013185902_add_booking_report');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT '790aed45-31bd-42fe-b508-4b4971961c64', 'ed7ad98e9893c22ce303013e5a866a384871f82e46fb627f60ae7edb04224544', NOW(), '20251014143620_add_watchlist_audit_relation', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20251014143620_add_watchlist_audit_relation');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT '540412cc-d75d-4939-88c4-6eaa62faf0d5', 'd48455d323e56710560bd4b35c6626b24ec7b8f7321b4d3fb90a0fcfcecb914c', NOW(), '20251015211003000_add_watchlist_admin_permissions', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20251015211003000_add_watchlist_admin_permissions');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT '799658c2-1f1d-47a1-9ca9-6705bf2f590b', 'c08049280d1c22af9cd6b87b72b97249decf470a2e60364e48d7165c5e81a64d', NOW(), '20251017161715_cleanup_future_events', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20251017161715_cleanup_future_events');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT '16ae4017-2aab-48d9-931a-9e769588db7d', '39d0576fe97839f9cc4e6ead66cb3093af2c8985131d7952a38b01670c1187f6', NOW(), '20251023133244_add_user_uuid_column', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20251023133244_add_user_uuid_column');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT '3d35d276-334c-4eb1-80a3-aa4557876505', 'c7e0b116406a649fa8031ca4c7faa9cee9e59964a3075fa3c1aaa030b01d5dba', NOW(), '20251024025759_add_webhook_version', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20251024025759_add_webhook_version');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT '5a2031eb-c44c-49a0-ad68-72cf49bc5fc0', 'cd1c7e8dab501088d19e01371c29d398a3fa2eafdd0e3e48826b3fff334210a2', NOW(), '20251027102656_add_video_call_guest', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20251027102656_add_video_call_guest');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT '9eb81570-54d6-4af7-a85a-7e10fbd86fa7', '32398dd93ffd07d54f52823e2ef8d88085a7c598cd91602ac0a95086cf877f87', NOW(), '20251028124351_add_partial_indexes_for_user_delete_cascade', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20251028124351_add_partial_indexes_for_user_delete_cascade');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT '46730267-d2e5-420a-8ce5-30551c580981', '30bffc602f2a19ec677b5b8476b1e626679de152dca6cee15f9c1f4561d82f5c', NOW(), '20251029103123_add_booking_calendar_view_feature_flag', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20251029103123_add_booking_calendar_view_feature_flag');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT 'df729a54-02b8-4486-ba48-ff997cb9f23c', '6d3bc3cf89992cfe14dafbb8c6fa695606db0201b83f50ebc26cbc78132efaac', NOW(), '20251030081154_add_report_status', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20251030081154_add_report_status');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT '3100915b-f5f6-4b85-b2d6-97cdc352b2fb', 'b294fac28454242a9b8b217c23a80814317e1535dd1a72957af223783fea1244', NOW(), '20251103175338_make_user_uuid_required', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20251103175338_make_user_uuid_required');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT 'bd1ba62c-9f79-4eee-b67a-57de85c73b82', 'e04cafbabe4a561879b0a7b64bc1d53b422513cfec164ce65ed3a237a66a9a49', NOW(), '20251110081648_add_delegation_credential_error_webhook_trigger', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20251110081648_add_delegation_credential_error_webhook_trigger');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT 'b31ce1e4-b2bf-4c83-894a-d5f844208fd8', '0b1235c16c37fbcb74b94b4490f4b1cd97b98e139fd30d5ce684c7d5f8ebde70', NOW(), '20251110160435_add_outbound_event_type_id_to_agent', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20251110160435_add_outbound_event_type_id_to_agent');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT '3fac4185-d902-4b95-8c05-58ffdd3dc29e', '49ad2fd557f8f1339d3419086f7201864ea65db4178a09c3d8bcdf427519fb3e', NOW(), '20251112171210_add_org_auto_join_on_signup_to_organization_settings', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20251112171210_add_org_auto_join_on_signup_to_organization_settings');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT 'a4909418-d2a6-42e9-8b9d-37665bc2f3b4', 'e53e2c684999a148e215e0b389d848460da7351fc8b8b2beb2d4486791d94be7', NOW(), '20251114173403_add_bookings_v3_feature_flag', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20251114173403_add_bookings_v3_feature_flag');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT '037ca239-cba8-4a8d-a20a-8250af65104f', '4e244452adf734a718fcbfe1ac126a7e893a3f0bf1b8d355e1c7af6c1fea71ad', NOW(), '20251115043236_add_audit_booking', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20251115043236_add_audit_booking');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT 'ba3510db-bbab-4897-9673-33bdbc04090f', 'b0d04f474acd1d3e8384e3ad83b0681b44675ace560ed07bef0c3bd82e8715d3', NOW(), '20251115054502_insert_system_actor', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20251115054502_insert_system_actor');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT '4c0543b2-9d74-4ba5-9504-9f4fab17800b', '2eede00befd65c4f1f0a3e37ddb0cb546b62907b811960538bdf26a6771c0287', NOW(), '20251118120422_add_attendee_email_setting', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20251118120422_add_attendee_email_setting');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT 'd7cec977-6623-407f-b4d5-adadc1878119', '9d54b66540229f0b32a3b8eff165c78dc9cb001740a9f3bcb251ef12eb69281b', NOW(), '20251119124132_add_uuidv7_to_audit_actor', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20251119124132_add_uuidv7_to_audit_actor');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT '34214175-7da2-4a7a-bb16-7353c7b45dd7', '4f93ab08a324eb17761c14ff33fd377752afb2c93e04e426d51dd358aebdbc71', NOW(), '20251121114503_add_pkce_oauth_client_type', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20251121114503_add_pkce_oauth_client_type');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT '1617f540-ca47-4dbd-a7ca-528d637743f3', '8344852d82c16d056a8e72e15f6b2ba2d68523602555bb2e6361baca57749af7', NOW(), '20251126085109_pbac_add_attributes_edit_users_permission', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20251126085109_pbac_add_attributes_edit_users_permission');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT '31e8d4b3-0edd-4507-8137-f1f1e2c30ca9', '99aef723e9d0173244cbe1b2a7107f2e8c3b7ae0b81c52288c166f5724ff6a7d', NOW(), '20251127102536_add_from_reschdule_index_to_booking', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20251127102536_add_from_reschdule_index_to_booking');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT '8dcffc93-1cc9-47af-a2f4-750cba38a459', '6ca247d0a446eb67ce84b5309d39b0a03374ff943c9650f6188840193863307c', NOW(), '20251129125459_add_show_note_publicly_to_ooo', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20251129125459_add_show_note_publicly_to_ooo');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT 'b4400ee4-29ad-4570-81f8-a47a6af94b2d', 'ab8061d3e1edf1b9d7b6601c8efb78f6c209d10ddd297dc562ab301b6f4a1d04', NOW(), '20251201113559_add_booking_audit_feature_flag', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20251201113559_add_booking_audit_feature_flag');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT '3eee80b8-690f-4a53-9c6c-1bb2d88fdb13', '8105e28e7b36bf5c7a070873c1609c95d7bb266dcc77d376934bed8112366641', NOW(), '20251202143411_add_auto_translate_title_enabled', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20251202143411_add_auto_translate_title_enabled');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT '2dcf73c0-9ba3-40bd-add2-1e2de3becacd', '549053c7244c4f49070183706de1f96cf80596b6bdd8c7a5f18511ba9cc4bb27', NOW(), '20251202181340_add_user_holiday_settings', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20251202181340_add_user_holiday_settings');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT 'bfe58d86-dc0a-43c4-b67e-725a53eb8951', 'a815e88e0407d25bbe7dd279f23a8e913854ea595fc579cd15040829666ec838', NOW(), '20251203000000_add_holiday_cache', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20251203000000_add_holiday_cache');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT 'c98a1381-5eb5-4a0b-a2d1-d6d7cda5615c', 'b2c89800d5e4edbd8d948b8fb3c4d20f96566056937af5c7f0ce0b840430e936', NOW(), '20251203102204_add_min_reschedule_period', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20251203102204_add_min_reschedule_period');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT 'aee2ab7c-9fdb-4582-be44-e54c395a424c', '8ec86d7f0d0583d629e7e98834c1bbc0a936266b8e875d8d5fb79ba97ce6bbbd', NOW(), '20251205111359_add_is_trust_to_o_auth_client', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20251205111359_add_is_trust_to_o_auth_client');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT '9cbfb2f8-55cc-487c-bf50-a20677572be1', '452149cd246ebed79704e93d8e3fc91a00336661e7bba0397c33ff50f8442bd3', NOW(), '20251205150624_enable_host_subset', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20251205150624_enable_host_subset');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT '130df8b7-cd5c-475a-a949-ecdbb26b449d', '4993eb459ba6d44252f73309558dda21ad4a800c67bc01c1d5628991e639e5a2', NOW(), '20251208035931_watchlist_audit_on_delete_set_null', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20251208035931_watchlist_audit_on_delete_set_null');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT 'ca77a848-fc64-4446-8277-d957bd8910a4', 'e0b0e929ee722286de18edadfc8c74cfa8a8ff39266f5875bb957b59da4b2d98', NOW(), '20251210143104_add_enabled_to_user_and_team_features', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20251210143104_add_enabled_to_user_and_team_features');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT 'd172bcf0-3666-40c7-a5e5-b127522357db', 'b6c81a6a733fa50fcdfd14927958b7d099a23995d03f88dadb46b17b29d44fc5', NOW(), '20251216074521_enhance_booking_audit_schema', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20251216074521_enhance_booking_audit_schema');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT 'a7ac56f1-09a5-4f02-b48e-91ae9fdfa229', 'ddb2a607fd3cf682b69c2b6eb4d4987e0aae2c3d51cf91acde96392349930035', NOW(), '20251217090304_enhance_audit_schema', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20251217090304_enhance_audit_schema');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT 'faee7013-c277-488f-b56a-cc7f2fea7b0b', '2ad40aaa35a1df36f9d97a2b168b87c9466dbfdfa38e2dd0db0a9656ca58c08d', NOW(), '20251217155117_add_auto_opt_in_features', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20251217155117_add_auto_opt_in_features');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT '76a4857e-10c8-4b00-83d1-fdf6a8e574a0', '1011a27a913669d87bb0bcfa0ffc29b1830dcb4da6de6334725d49361136e1a9', NOW(), '20251218173119_add_global_watchlist', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20251218173119_add_global_watchlist');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT '99110a7b-a4a1-4e16-b31e-da4aa8fb462f', 'a670df80b7484c1134bdb20fc543c2aef1a4f36a2948ea83fc86596c3cf18f93', NOW(), '20251220034814_add_custom_calendar_reminder', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20251220034814_add_custom_calendar_reminder');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT '9473b9ce-35c0-4970-9836-c086c593f720', 'c31ab2ad916b838de891a2ba4286dcde7e1d7ac02baf91534cf586df84f767f2', NOW(), '20251224092336_add_context_audit_action', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20251224092336_add_context_audit_action');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT '48dacf57-fde2-47e2-8c18-d9cfe4312f31', '55cfa9080c6bbe65e9b1b6069547640672faeb89ca2a5405b730787ce6dcc0da', NOW(), '20260105071846_update_watchlist_index_with_is_global', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20260105071846_update_watchlist_index_with_is_global');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT '03326986-d064-4652-bc4b-d1942a3a15e6', 'fcc837aa0e9f5d37584ae4a3034411f6900bb40d93890bd26bb354a202d0f6be', NOW(), '20260106093811_add_monthly_proration_tracking', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20260106093811_add_monthly_proration_tracking');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT '636221ec-467e-465a-b807-5cb3b4f144a4', '79ee0351a1318d01ffb19c00ccf15dead5a4416494b9eed6ea48718ba3227087', NOW(), '20260107093019_add_magic_link_source', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20260107093019_add_magic_link_source');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT '6158e22f-ed13-44f8-b1ee-a5ae30dc9198', '3e283cd985ae582fa4e2b00d42859341cbb9bd62877c5c7d5a8f6f9ee1f59a1a', NOW(), '20260109090244_seed_sidebar_tips_feature', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20260109090244_seed_sidebar_tips_feature');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT 'e88fd7c1-433b-44d0-b7ed-14d887e57382', 'b1a4051987d0344065b3f046619eb3c039905b0f17ade1731f758017df2f474d', NOW(), '20260112170655_pbac_add_feature_permissions', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20260112170655_pbac_add_feature_permissions');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT 'b7a05765-e76d-4461-a252-e79b54ea0a6e', 'ff1e171cc2ea799c8fed40160e72be2c492b6008361800c978c6f81ed7c4020d', NOW(), '20260112172746_add_integration_attribute_sync', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20260112172746_add_integration_attribute_sync');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT '4ceddbe3-e532-4c25-b568-fea644bf0dd0', '381deb94a22cd26d931d0b866e1907aa31f769c6af43ae96fe17fb28b1405bab', NOW(), '20260113140724_add_missing_integrationattributesync_and_credential_index', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20260113140724_add_missing_integrationattributesync_and_credential_index');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT 'f7a3a6bc-1c0e-460b-b05c-5e701edbd7fa', 'b19b70ede512c3f8de60c73151cc9896b7d8b3897c37479603020eda6c97cd69', NOW(), '20260114154054_add_oauth_client_properties', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20260114154054_add_oauth_client_properties');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT 'eac19d74-c00b-42aa-acd9-a2cfb2b7d1f6', '1bde7f42a89a5ca1d6873b364ec18b4d2dd4bb6da2c68ed17cff64202c516757', NOW(), '20260115111819_add_cancellation_reason_require', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20260115111819_add_cancellation_reason_require');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT '55ff86b5-4c0d-4065-8862-dad68103a1a0', '745ee578fb592ea8a8762454763f344a1bd9ced427ae8a387389c6c8029ae464', NOW(), '20260115155453_add_integration_sync_constraint_on_mapping_and_attribute', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20260115155453_add_integration_sync_constraint_on_mapping_and_attribute');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT 'd0a3041e-ee64-45c2-9f86-879764fee6e2', '3245a4268fe5caabdc1d74d75d7c9fa2328af084f113153e957ad180fcd62137', NOW(), '20260116145525_add_custom_host_location', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20260116145525_add_custom_host_location');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT '719a3190-a5c2-46ea-bb9f-a82cda855564', '44ea3b6979df6dd3c3893de1b1f9b11d9ebd5b4ee6c0ec05533842a3d4c7c13c', NOW(), '20260119113000_add_system_source', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20260119113000_add_system_source');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT 'fdf25501-cee4-4e4d-a3af-ea95a0cded7a', '2910c353532f2d14ab302d14c5aa3e3ad10952da18334e5cde53b8f27153051d', NOW(), '20260119120000_add_seat_change_log_operation_id', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20260119120000_add_seat_change_log_operation_id');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT '5615cb0a-bb5c-4614-9af0-a058d2743177', '7dc74e94a8e892a84960149d20d25a180c3a95f1927d725508431ee2500bbc3c', NOW(), '20260119184420_add_calendar_subscription_error', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20260119184420_add_calendar_subscription_error');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT 'c6b73154-5269-4684-9907-ea991a53041f', '1599240a6ab335a5fcb447e18283c927142ecb69e22faf594806afc8530c04ea', NOW(), '20260120093500_add_no_show_updated_audit_action', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20260120093500_add_no_show_updated_audit_action');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT '21238620-98f2-44d9-9b3d-6d23c4605e4d', 'baef8cffd9a4d459ca31afe919e973e962ee0bd6fd0713fcf9bfed38e9aeef61', NOW(), '20260121145242_add_workflow_step_translation', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20260121145242_add_workflow_step_translation');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT 'c9495254-6d20-466a-9cba-deb78b27b83d', '0bafae9ddc3d97165346d0e2ab63cbb5442949e36d1707d37d3d1e68c9bac334', NOW(), '20260121191700_add_eventtype_parentid_teamid_index', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20260121191700_add_eventtype_parentid_teamid_index');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT '9737cc1c-9e69-41e1-bbd0-3a0e872ab7e4', '7d911449d8986ef5b2f211ca3f2fa8e6d2736d1edd7f2294cfd44f0b38c3a803', NOW(), '20260122133147_add_wrong_assignment_webhook', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20260122133147_add_wrong_assignment_webhook');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT '9084fea2-af73-4d08-a615-619fa6e3f15c', 'eaa76a3ba6f6bf92c5fb3390fae0e2bbb95ef1017f482816e3abb3e1933f7b0c', NOW(), '20260122140703_add_credential_teamid_index', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20260122140703_add_credential_teamid_index');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT 'ce6d3428-9415-494c-8ec0-f66993db6399', 'c51d31ee94a695e5791199f4f3a1bd0d9c46366d1e789b6605631ba0aaa484c7', NOW(), '20260122145500_drop_user_starttime_endtime', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20260122145500_drop_user_starttime_endtime');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT 'f0fdc244-7227-4a30-93ee-fc567b005c9a', 'd2236cfa929fe50c32c61e1e7c10b458e745a4adf355c84fd45cf30e4e6436e6', NOW(), '20260122165837_add_encrypted_key_to_credential', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20260122165837_add_encrypted_key_to_credential');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT 'c0b4287b-c755-4906-8d2a-295f6a086251', 'f4f4e8b66357e478a0435b591104bf650d05de71c239b6159fff73ab2b60be52', NOW(), '20260126173100_add_form_response_formid_createdat_index', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20260126173100_add_form_response_formid_createdat_index');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT '17749249-c428-4247-84f2-29bc58d994a2', '444238b9afd620f74f7fbdcdec18015e0cc2d34ebf1007d521d6ed10b8d25345', NOW(), '20260127035022_add_routing_trace_tables', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20260127035022_add_routing_trace_tables');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT '2479abcc-16a0-456e-8cd5-3a60975e2b5d', 'c481c1a8d3b91ebf491f50f5331f421ea027ad25abccad6299a5f1c98b3a1f3f', NOW(), '20260127140951_add_invoice_url_to_proration', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20260127140951_add_invoice_url_to_proration');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT '967e994e-ca82-484e-b106-5ddc3ddb07ba', '96071017b67e6e702ed3d2b08185e9986304055b41d0c33158f539e4dc2346ee', NOW(), '20260128004200_add_booking_composite_indexes', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20260128004200_add_booking_composite_indexes');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT 'c8773614-52cd-402c-a81f-46996c1fca6d', '3a0d872b86beb1819b36b4cab464e96347e62bf390e64479591648cedaea240b', NOW(), '20260128170309_add_secondary_email_index', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20260128170309_add_secondary_email_index');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT '21acf486-a29a-4a14-9bb1-cac50132d4cb', '99cbedb7f37ee35b68727bf86020fe19131fba78ab0fc231918e2f17f51c87a7', NOW(), '20260129090913_enable_pbac_globally', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20260129090913_enable_pbac_globally');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT '02848616-ea12-4b3d-9366-f8d15c13cec8', 'ba24f9018d49aad0f627dae2932230e36025fadb9ba877787ff6a92fd8b0e4e0', NOW(), '20260129170000_pbac_add_password_reset_permission', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20260129170000_pbac_add_password_reset_permission');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT 'c599874f-a8f5-49ea-a512-44a56839f3b5', '2bd31969990a6142896e72c261f06ed381c45b668c59031632b0f9642abf0b16', NOW(), '20260129205827_add_wrong_assignment_report_table', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20260129205827_add_wrong_assignment_report_table');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT '2cf7264d-cd9a-44cf-9a73-4cb0a6e0f91d', '46b05b8506d6727645b4940a3468b514cf3fde69fb90f04c618daac881b90524', NOW(), '20260130000000_add_selected_calendar_channel_id_index', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20260130000000_add_selected_calendar_channel_id_index');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT 'bf6f8c12-3b94-46ee-a7f9-7a8384f67f87', '4eba626a57f0bb36a86e59cb38a77760d19bc428a8f487a2265f20be2635bb6e', NOW(), '20260130043627_add_reviewed_fields_to_wrong_assignment_report', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20260130043627_add_reviewed_fields_to_wrong_assignment_report');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT 'e1fc3647-5817-4f1a-8e9a-b4ac85816fce', '4fbd114a6912dffe2201286558012b956d059486d7a6629bb5dab5d6af95907e', NOW(), '20260130100000_add_high_water_mark_fields', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20260130100000_add_high_water_mark_fields');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT 'd3dc00e3-0f1a-4d50-ba12-07e27c13bd6e', '96c9b65649e2edff733406a2e7c45f38b2c7ec110b7b53af3ed2cb5fcc8ca803', NOW(), '20260201053520_add_redirect_url_on_no_routing_form_response', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20260201053520_add_redirect_url_on_no_routing_form_response');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT '7c8fe8c6-8a77-4225-8406-a8657c0bca7a', '9eb19f63e6710043469fa1ce4a82d5ad204ef507a87ad2838b1029691c62e3c3', NOW(), '20260210000000_add_billing_mode', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20260210000000_add_billing_mode');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT '9ed26359-c9f5-4b4c-a8e1-6083cdfa07f9', '4f94c9cde01e71a8dcfd03d2ab25bf147cd6a27c7f62fc132710891f16b0ec96', NOW(), '20260210142544_add_audit_logs_permissions_to_admin_role', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20260210142544_add_audit_logs_permissions_to_admin_role');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT '02dc4947-53a5-49bb-bcd5-c9334c8b3a63', 'd2ca9995c46432a1c1607cacd20d3f181a199f056d324513fa703fdf7b08d12d', NOW(), '20260211234000_add_composite_index_wrong_assignment_report', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20260211234000_add_composite_index_wrong_assignment_report');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT '52de7ea9-7302-4167-940d-b5710ed9d510', '67fcc17d19eb736e523167331d6c9b65c9a414e9872bf0a0226cbf78b8a07974', NOW(), '20260212202500_add_signup_watchlist_review_feature', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20260212202500_add_signup_watchlist_review_feature');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT '52fae2b5-f435-4265-8e27-27e7f7b9026d', '158f7958067ef6ea032e80f85661fee207c548bd81b4fca6f8f6aa5de299dbd7', NOW(), '20260213000000_enable_onboarding_v3_globally', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20260213000000_enable_onboarding_v3_globally');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT '6d02af1e-4724-40af-a23b-8c7cfa6db169', 'b41f3168d16c8cb627c1c882267e91f1025697c6b33c12e2de5c6d3c24012887', NOW(), '20260218000000_add_routing_form_fallback_hit_webhook_trigger', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20260218000000_add_routing_form_fallback_hit_webhook_trigger');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT 'a568702f-1cc6-43ff-b86d-c001a601ab84', 'a40e5389ebfdf6fc3a8d83c47a1c6b54e28b98b7e55fc6b31321f867be496373', NOW(), '20260219000000_add_fallback_action_to_queued_form_response', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20260219000000_add_fallback_action_to_queued_form_response');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT '4eb16a13-9617-4102-87ba-21e1822c6898', '816a6479dd21ee67aaa10b1d834790238efde3736a05681225e13ca8e0e7a6c5', NOW(), '20260226000000_seed_sink_shortener_feature', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20260226000000_seed_sink_shortener_feature');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT '418c3189-669a-4016-8c27-bccc1dd8b0d3', '149d961f16fdf74ae7cec157ae9d8069e3d3d1be9a6fcf9afbacbf87785012b2', NOW(), '20260305043434_remove_routing_forms', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20260305043434_remove_routing_forms');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT '8590878d-41e5-4792-8434-2408809a81ff', '6f1762d606d414b0aecebc2d0d70d847c12b7dbfc5e6282a504f2ef8fa5cdde3', NOW(), '20260319000000_drop_workflow_tables', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20260319000000_drop_workflow_tables');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT '938547a6-a117-4855-8846-7b35bbbe1955', '02727c4d2faf0a6aa2c75970b7bef4a168dc7cd79eb7fd3e4bf00bd83a5c61cf', NOW(), '20260319100000_drop_impersonations_table', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20260319100000_drop_impersonations_table');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT '0f9d194c-8539-4465-90bd-9d6014589eae', '8dbf0521cfd138f939adfd9f25d05953adb13a829dba5c4d35bac317e65cf5e5', NOW(), '20260319161640_drop_domain_wide_delegation', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20260319161640_drop_domain_wide_delegation');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT '265d0bab-32fb-42ca-9b43-c788deda5590', '525774ee77395e54b482abd711710c9ef0255237c7414ece515ee8cfa27cc00e', NOW(), '20260430000000_drop_instant_meeting_webhook_trigger', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20260430000000_drop_instant_meeting_webhook_trigger');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT '2eba1078-78a4-4b8d-bce1-910d4bfcabf6', '85fe5dca5aa9224a3b99510444672f9f99ce46c5b55dc4f3aed9e94c2312fe90', NOW(), '20260703230000_dental_practice_encryption', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20260703230000_dental_practice_encryption');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT 'c2062546-98a0-459e-8e84-af22876716c6', '173a48fa025c725cf615183aca0c2c0997d1b4699591bf352edb7ea7994e1fe2', NOW(), '20260703230100_dental_disable_booking_denormalized', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20260703230100_dental_disable_booking_denormalized');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT '40ec9bc1-701d-4de7-a9ff-e04f9f8cf3bd', 'df04a7c13152dfc65c3b6708287f9c250a4efac35aeba84d68e4efb09fbd3ad1', NOW(), '20260703230200_dental_treatment_resources', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20260703230200_dental_treatment_resources');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT '31df9c68-cc05-4bd8-a55d-a5cea5b5c52c', '06a3dbe8d6c2b572e6bc436aa9d5a2a8d0bff4f213ae20b6d8595bc3f8ac3763', NOW(), '20260703240000_smart_fill_ai', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20260703240000_smart_fill_ai');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT 'eea6e96c-7478-4e50-a437-42e8357c8486', 'fd2c8f82c25ae8c91dd8e5aa240a1b9fc2dbc5acf720e6012c7a96b978b7fe33', NOW(), '20260703260000_pvs_sync_outbox', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20260703260000_pvs_sync_outbox');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT '8f242b00-5fac-408f-bc97-46df52a8c4fd', '249496f3f3ed5cc829522e509681cd5dec0c3772b45c828116e5be4da2339cbb', NOW(), '20260703270000_pvs_connector_credential', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20260703270000_pvs_connector_credential');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT '73fad2cd-bfb9-452a-867d-070a492bfd00', 'a006206b85dc69c852d9405cc977030ef9f329c6f7301354feb90ed75382b5ad', NOW(), '20260703280000_dental_recall', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20260703280000_dental_recall');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT 'bec38b97-c07e-4406-aa27-791671a6caf8', '7fb8d8d9f4b731e5b6111817ed3361160e46217c7f335571afc44d9281fe569e', NOW(), '20260704000000_smart_fill_patient_encryption', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20260704000000_smart_fill_patient_encryption');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT '9d503a01-a473-4bf4-8589-c71196e4673a', '0b9bc8973371d9d68c809ef219be0558bf357e6e2a993cea0f4534533e73900f', NOW(), '20260704110000_practice_trial', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20260704110000_practice_trial');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT 'c1e3aa9a-f3f1-4c65-b7d7-e65b2451e3ad', '29830a3a475ee8dff1c5d07d4a12fdebfd55e3e50e2dae536d9915a035a18fe5', NOW(), '20260704120000_smart_fill_email_invites', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20260704120000_smart_fill_email_invites');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT '1594a8b0-dcf5-425f-81d0-98ea16432a38', 'fa0026092a9229e1b9342d8a98db1c587b7ff6a341cf649496b0448c75372cfc', NOW(), '20260704130000_medical_booking_flow', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20260704130000_medical_booking_flow');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT '327c5665-df45-4981-be14-a0effbb9531b', 'c4122d621dbc11caa544a6d3e2a22373d4a1e39fe62df9efc270f76817f624a8', NOW(), '20260704140000_recall_conversion_tracking', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20260704140000_recall_conversion_tracking');
