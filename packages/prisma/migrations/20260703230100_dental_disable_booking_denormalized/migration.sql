-- Dental fork: disable BookingDenormalized triggers to prevent plaintext PII duplication.
-- BookingDenormalized is incompatible with application-level field encryption (Art. 32 DSGVO).
-- Insights/analytics must query encrypted Booking table via the application layer instead.

DROP TRIGGER IF EXISTS booking_denorm_booking_insert_update_trigger ON "Booking";
DROP TRIGGER IF EXISTS booking_denorm_booking_delete_trigger ON "Booking";
DROP TRIGGER IF EXISTS booking_denorm_event_type_team_id_update_trigger ON "EventType";
DROP TRIGGER IF EXISTS booking_denorm_event_type_length_update_trigger ON "EventType";
DROP TRIGGER IF EXISTS booking_denorm_event_type_parent_id_update_trigger ON "EventType";
DROP TRIGGER IF EXISTS booking_denorm_user_update_trigger ON users;

-- Replace refresh function with no-op so manual calls cannot repopulate plaintext copies
CREATE OR REPLACE FUNCTION refresh_booking_time_status_denormalized(booking_id INTEGER)
RETURNS VOID AS $$
BEGIN
    RETURN;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION trigger_refresh_booking_time_status_denormalized()
RETURNS TRIGGER AS $$
BEGIN
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION trigger_delete_booking_time_status_denormalized()
RETURNS TRIGGER AS $$
BEGIN
    RETURN OLD;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION refresh_booking_time_status_team_id()
RETURNS TRIGGER AS $$
BEGIN
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION refresh_booking_time_status_length()
RETURNS TRIGGER AS $$
BEGIN
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION refresh_booking_time_status_parent_id()
RETURNS TRIGGER AS $$
BEGIN
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION trigger_refresh_booking_time_status_denormalized_user()
RETURNS TRIGGER AS $$
BEGIN
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

TRUNCATE TABLE "BookingDenormalized";
