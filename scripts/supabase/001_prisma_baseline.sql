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
SELECT '40e576be-322f-41ce-92e1-5b2acfa744d9', 'e943b277074ff79ecedf452cca9e2123e0f889a762c148190492bd3bd3f4e617', NOW(), '20210605225044_init', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20210605225044_init');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT 'd49c37a0-02a9-444d-b7c1-3020dff25021', 'cd548ab5297379acc8c074c5b0dc4240a6d14886dc1df2a5f61a75db135d661e', NOW(), '20210605225507_added_bookings', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20210605225507_added_bookings');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT 'a2eaec0e-2c39-42ab-9f81-dff66a0a0573', 'fe081a902ad4b5ab0d6e23f19fe50faefb824f3ec5645e16ccfdfc87141a25e1', NOW(), '20210606013704_made_booking_uid_unique', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20210606013704_made_booking_uid_unique');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT '6b1a50d2-91ca-4f9f-be6a-688d3cd289fd', 'c4dea6e6cd8e16ccc8263f1e2e36b80497552c3a8516894314f1cbc3a5f6e550', NOW(), '20210613133618_add_team_membership_verification', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20210613133618_add_team_membership_verification');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT 'ec8e3019-c5ee-4de7-aa21-9b69373e5559', 'ea7646068dab402c17537cce3c03909551246923f3d1d37f420612a6717e428a', NOW(), '20210615140247_added_selected_calendar', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20210615140247_added_selected_calendar');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT '58debce4-c644-4cec-8d74-654f716bc985', 'bd9f9370a1d0cad7e6d5038fa318812e7e7554df8efbc470e48355fb2b82a8a1', NOW(), '20210615142134_added_custom_event_name', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20210615142134_added_custom_event_name');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT '704de104-a153-411f-b53c-01d11ba18d7a', '2142e2a0e5675d8be719d7bdd5893f6e2368737e8500c6ebdb4f4505d3a7578f', NOW(), '20210615153546_added_buffer_time', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20210615153546_added_buffer_time');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT 'c34b825b-bc3e-4b30-97f7-aaba9f701418', 'ea6c64c18f05b8b871a518de6c7a0eefd31cf04ae43047e2fd8956a7b0423468', NOW(), '20210615153759_add_email_verification_column', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20210615153759_add_email_verification_column');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT 'fedfa672-9828-418c-ba7b-7ee22863db1b', '23c29b6e264d2a8c73c7842e2454334ad6f51e00415089f3d6a8bc4eabcdbbde', NOW(), '20210618140954_added_event_type_custom', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20210618140954_added_event_type_custom');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT '47643788-6386-4991-a0a5-bffeb13806b0', 'c6df245d6b1b967ce00be1bf3160724fe628e1b75c15e426b533e6d25a6de17f', NOW(), '20210628153550_password_reset_request', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20210628153550_password_reset_request');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT '8eaae690-39e5-46dc-b73d-00f411273ff8', '935b9a25880cab758dd26af73ce2beb17ab34459e080dcab0e3caffeee6badae', NOW(), '20210629160507_hide_branding', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20210629160507_hide_branding');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT '6ca61c89-2eb4-404e-b83d-672b16063545', '71ee70b60e8c94c674bee5926da662aa96c2a325f82e1e7249c43d0958c49f7b', NOW(), '20210630014738_schedule_availability', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20210630014738_schedule_availability');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT '304e6d52-a997-4fd9-b553-2eec0d17dd7e', 'd97c97032a70c58163024becb4c69ab43c1e6fd0916ae2e971ecc82abe683cd4', NOW(), '20210709231256_add_user_theme', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20210709231256_add_user_theme');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT '5d69f82f-0068-4894-bfc7-aa7731cbfc76', '2d31657f49643c2248cf4472a0c389de929340350cdf853017684a3de146be36', NOW(), '20210714151216_event_type_period_settings', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20210714151216_event_type_period_settings');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT 'c505ddaa-3d88-4f6d-a328-7f51f27072b1', 'cd5ab82bd8491dd19d9c7a3a25ddc78302c688bb2618c5796c79205019b43bb1', NOW(), '20210717120159_booking_confirmation', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20210717120159_booking_confirmation');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT '3d90e030-e921-499f-ae09-028924fdf7f6', '4668eb7fd8eb60d26161ef42ae3e4948ec260111b03f92a03c0e4f53e1c6bdb5', NOW(), '20210718184017_reminder_mails', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20210718184017_reminder_mails');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT 'd2f13d49-451d-4065-843b-acd1339e054b', 'ff22b8a74c0bc885d134d28fa0a38a4706008b268abc888eaa92a90e78004c56', NOW(), '20210722225431_minimum_booking_notice', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20210722225431_minimum_booking_notice');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT 'a8102d58-35b3-4a79-bf40-8c0ae34457c5', '11aba67d15c03b9276d07af6a161d7f657c6b41f452eb8633e492c23b676b6f7', NOW(), '20210725123357_add_location_to_booking', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20210725123357_add_location_to_booking');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT '4b0ba5df-caec-464a-b5a8-6b07709da86f', '6b85d2c7bdbd2dcfc3dec8110046dd80e3db581befbd7dd70e019e20372ad1c7', NOW(), '20210813142905_event_payment', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20210813142905_event_payment');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT '64627341-a256-4983-af65-088412145672', 'e2457d7ed2a788768c13c66c51b47481e1e310b03e5bc785d76bacf78cd69f57', NOW(), '20210813194355_add_slug_to_team', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20210813194355_add_slug_to_team');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT '055ce536-ae13-4a50-829f-0b57eaacd563', '79f39193fec9947daa547c057572d7996188219cbe8425ac9fc1122f45263ed8', NOW(), '20210814175645_custom_inputs_type_enum', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20210814175645_custom_inputs_type_enum');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT '3a447120-e201-461e-9a85-65b23cd54926', 'e7a2a7fa8c60c1cf50ee1edba5897df9b4e8cc8f547c75402fb325ce5284588c', NOW(), '20210820130519_add_placeholder_to_custom_event_types', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20210820130519_add_placeholder_to_custom_event_types');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT '497f50f6-fe0e-4c2d-9884-1ecf45863385', 'e06d3a1bea3d17abd09db94f51d5c123a37c33ceaddf249dc9fa21aaab5ac60c', NOW(), '20210824054220_add_bio_branding_logo_to_team', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20210824054220_add_bio_branding_logo_to_team');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT 'a5a0ee03-0820-4480-9ae1-b4f6abe9e9a5', '4b9697e3bebd63164bffd35ddb973c6112e830420351dd9d2dec409b1f327934', NOW(), '20210825004801_schedule_schema', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20210825004801_schedule_schema');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT '34640809-276e-4552-b940-c6cb18a8c2f8', '8ee37158e9e822f3f266241a4fd5de53ec3448f891069c309c6a788cd5cca33d', NOW(), '20210830064354_add_unique_to_team_slug', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20210830064354_add_unique_to_team_slug');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT '8ebbd4da-e88a-4411-9833-3453cae07f73', 'ad6f53508aada9f7680bc4a17823719f3508b26955d26762285d0f8536b5db0e', NOW(), '20210902112455_event_type_unique_user_id_slug', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20210902112455_event_type_unique_user_id_slug');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT '9869ce7b-8efb-45f9-b645-c8dba1bdf291', 'f137d0f6c5f097ef9bd841c11b4874273e4c67794c504016b55172cb0e79e5ee', NOW(), '20210902121313_user_plan', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20210902121313_user_plan');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT 'eaa79133-3f4d-40ad-973b-88b7e0449643', 'c51dd74614855fa749dad1f6df452d7050821a1af38f83e0ccea8135eab4ceb9', NOW(), '20210902125945_user_username_unique', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20210902125945_user_username_unique');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT '0114b2de-7a56-48f6-9ee1-e37c119535e6', 'a7b26bed96bd0ea5de0d653fc0fed73a7b6ba04db5a80826929e5a2330553fe9', NOW(), '20210904162403_add_booking_status_enum', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20210904162403_add_booking_status_enum');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT '65fd5a63-cdff-4bd4-ad8b-3035a1a3d743', 'b5d8afaddde993d3dc988794e1956719236266e2f3db30fd851cdc47a8ec2a00', NOW(), '20210908042159_teams_feature', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20210908042159_teams_feature');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT 'fc2e4de9-f5dc-4c3c-af54-5302267a6b7d', '30fd9a6ac39902afb146cd4d25e2603091013164d7bc6f4c8d78fc9c89894e29', NOW(), '20210908220336_add_daily_data_table', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20210908220336_add_daily_data_table');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT '4f17fe61-b7d7-4e79-b60f-95024cb6ac2e', '9dc5ad70517711ee935f9479dd7acd0ba47ce64bef79bc642af56112612b74b5', NOW(), '20210908235519_undo_unique_user_id_slug', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20210908235519_undo_unique_user_id_slug');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT '63b5fc67-e26e-481b-9203-b11034a17eef', '25218fac49b0b3d3cf820828686099e5eb36f85c68d462497ba885f009daa3ea', NOW(), '20210913211650_add_meeting_info', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20210913211650_add_meeting_info');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT '1369a40f-d20a-44a0-93c1-e2b4b22af5a8', '335f2697a358a00a0a7510fc30d60beacecca09a882670424174c5a0c54cf136', NOW(), '20210918013258_add_two_factor_fields', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20210918013258_add_two_factor_fields');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT '458af3c3-c3e7-4412-ab37-b1c60a283642', 'ad6f53508aada9f7680bc4a17823719f3508b26955d26762285d0f8536b5db0e', NOW(), '20210918152354_user_id_slug_fix', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20210918152354_user_id_slug_fix');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT 'b25bb6bf-f95b-4cbd-9990-ad8d1c3fadad', 'd07fcfec8e611967adb1b2daf7f4b7b567fba53d19f3622276a04acdc546bdd5', NOW(), '20210919174415_add_user_locale', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20210919174415_add_user_locale');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT '7d2af6c0-3cba-4ae9-a9ba-c1c3c3ca7119', '26c9dcbbf58fdc9a99da007fc88bb69b6a5d03cde7f9bce697377dacd6113d99', NOW(), '20210922004424_add_disable_guests_to_event_type', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20210922004424_add_disable_guests_to_event_type');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT '7b5c4450-2d13-40d3-9003-53a003d245a5', 'db1a9e5e526a64e4a6f6f570ce4f919eca81151f44c714c33ea4251c6282a3ca', NOW(), '20211004231654_add_webhook_model', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20211004231654_add_webhook_model');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT '049fd03c-daa7-4c5b-b052-8e590ea33926', '83502a79b6ab8dd31b49f124a886e0b9327dd5aaba4f081e71fe9d10be8ab486', NOW(), '20211011152041_non_optionals', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20211011152041_non_optionals');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT '586ec30a-296c-4685-8d92-c17da99c709d', 'dd66be3e2d9b3852cd75f04399026a322ac5d7cedbe7db0503e43296baf07c4b', NOW(), '20211028233838_add_user_webhooks_relation', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20211028233838_add_user_webhooks_relation');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT '3c6f77d2-818b-4b31-bdce-bfa425f62c60', 'eb82e0c9b0b7441a9ccf3eee7bfa057dde474280ae5db7d88ecdd1fa98528e30', NOW(), '20211101151249_update_rejected_bookings', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20211101151249_update_rejected_bookings');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT 'bfffefe8-2121-48f6-8c82-b1c6e05c2c8d', '979f37a90916207866e58a47f9153e0083dedb841ad825d07f5cded4d29c7b2a', NOW(), '20211105200545_availability_start_and_end_time_as_time', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20211105200545_availability_start_and_end_time_as_time');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT '902c0a62-efef-4542-9756-4f4924a2b668', 'ac0f9d41abbf4399d411d2b8d703f386726875439be0de25c15c0117074a2e6b', NOW(), '20211106121119_add_event_type_position', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20211106121119_add_event_type_position');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT '91f0cd38-8370-4168-a6f2-58b5ea8e0412', '83af5b4ab083ec37fa666b387256197625a3ec9377610a4ec8920e26b54665f6', NOW(), '20211110063531_add_custom_brand_color', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20211110063531_add_custom_brand_color');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT '0658ef02-e265-4b36-986e-1df7a7c03ad8', '562d185ad7fe1246d2c1129b6207a787e8095427fc225ee44a4cecccc77f3f81', NOW(), '20211110142845_add_identity_provider_columns', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20211110142845_add_identity_provider_columns');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT 'b385196a-8ec4-477d-a5b8-a73eca5d4869', '02c9a235081692a0571cec3ce21b7d67df5eaad03e617e13446002376e897cb6', NOW(), '20211111013358_period_type_enum', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20211111013358_period_type_enum');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT 'bf958991-3742-41a9-bce7-904f46bf7bc0', '98b61ad6a2148f20131381e28ecca578c6d9db1c84dbb04a32bc7bfb401bb73e', NOW(), '20211112145539_add_saml_login', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20211112145539_add_saml_login');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT 'b97f9aee-872c-41dc-ad2e-d880b65461bd', '5774760cf508959cea4370297fa3706943cb4daf3009b4ca5c84a25b77380099', NOW(), '20211115182559_availability_issue', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20211115182559_availability_issue');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT 'a529c0b8-fed8-4082-aab6-8f6bafcf4d39', '1ce1bb7e945711845f971adc6dff0b6e29c89ab540cdce773c2f1661400de3d4', NOW(), '20211120211639_add_payload_template', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20211120211639_add_payload_template');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT '801b1fe6-0113-4972-9567-8bd991b31168', '319c3dc969306fdb594f37117f09416fab3d460f19a389b66963c59117d95253', NOW(), '20211207010154_add_destination_calendar', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20211207010154_add_destination_calendar');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT '1888e83b-2b17-4ebd-8333-26fbcfe1f03b', 'e916fbeff0f878f8a07d9f6aa3659327a1fb54116eed539c964d97a9ea18bea3', NOW(), '20211209201138_membership_admin_role', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20211209201138_membership_admin_role');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT 'd4af2e5e-21d7-4bd0-8333-d20ea8f8796c', '2642abb472475b383f5ca5364329658194b8f2ba6f11ac54cb75a7be9a84672d', NOW(), '20211210182230_add_invited_to', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20211210182230_add_invited_to');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT '5a2b6e9d-65ef-49f2-9ed5-e1438c738013', '105bdf45881e8a0e6e1e5cd541709e8dded8578e4ef977af9ba8cf0039d49ef8', NOW(), '20211217201940_upgrade_to_v3', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20211217201940_upgrade_to_v3');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT 'd9ee36d9-bcb2-4c04-b2e0-84784670fb22', 'c2b6b16eb568a1e49c0ae27198c8a82bc658945ebf3115c111fda6208bbd4f43', NOW(), '20211217215952_added_slot_interval_to_event_type', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20211217215952_added_slot_interval_to_event_type');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT '21bf87ef-f9b5-4362-aa55-dabae158127e', 'e956233fef389a6c7cb1e7f19813d53f1739ec2e4ba16a5162a7dcb6dea5f84a', NOW(), '20211220192703_email_to_lowercase', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20211220192703_email_to_lowercase');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT 'a04f5909-13df-4bbf-965e-d5ec626ad1dc', '2b50ff99d63e42965f20301f7ec9b0e921a1d26e500c0d9e0c11d7a22404c72f', NOW(), '20211222174947_placeholder', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20211222174947_placeholder');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT '7f08d23e-dbfa-430f-90e1-6b55f69546ac', 'd9b14bdb8271845ef292f2e5a5289569f0817959e562aef918817be5a942a24d', NOW(), '20211222181246_add_sc_address', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20211222181246_add_sc_address');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT '1cdb4be7-c91d-4ef7-9ead-4313cc0dc94d', 'fa7eea8b947971a6351afb4721117d15328a79676f5d07f545b8bf727c6d9332', NOW(), '20211228004752_adds_user_metadata', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20211228004752_adds_user_metadata');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT 'e7b27f6c-edaf-44e0-b583-8ceca361e826', '9df7a36c799445569b9fc593dd21fcab44685f9dbe85e32668d6314a8110fc44', NOW(), '20211231142312_add_user_on_delete_cascade', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20211231142312_add_user_on_delete_cascade');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT '46918d6b-3cc9-48e9-b9a6-539f9d1714b4', 'deb2ab9ef565670edbc1d07c1670ba3878fb8605f74ab22e0a8cf5fa6cd70234', NOW(), '20220105104913_add_away_field', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20220105104913_add_away_field');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT 'cf70c6d5-9d1c-4e9c-9d91-580c8e07ad4e', 'fdc5c4c7de8f4e0263e54a4b4ae9cf8a8c719d0a1733a62bb350bcffd1250c0b', NOW(), '20220113145333_rename_column_sc_address_to_smart_contract_address', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20220113145333_rename_column_sc_address_to_smart_contract_address');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT '3ff3cd68-018e-4d9e-b415-92082a2bd5f1', '6c51f54631d2b85ecd1de135bc6f8917b112f39d64aae2007572332a1d39c710', NOW(), '20220117193242_trial_users_by_default', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20220117193242_trial_users_by_default');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT 'f31714a2-f83e-4fc6-816c-b5494d3bf689', '79a5fa42ea63289582808c43995d02ebe8f762c9e2dde03031f8dc48cf04b743', NOW(), '20220121210720_add_cancellation_reason', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20220121210720_add_cancellation_reason');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT '3e45f46e-e8cb-46a0-87cc-927375a92467', '4e1f8dabb07e92ba06636e42068598818d980f44f1cbc355a2b059332763345f', NOW(), '20220125035907_add_attendee_locale', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20220125035907_add_attendee_locale');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT '23d14274-cdb2-4c71-aa7f-226136f9a0bb', '9874229ef321e19f80eca4f7b5ccb3a0804842a70f533e7bdb13f6a3b6336624', NOW(), '20220131170110_add_metadata_column_to_event_type', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20220131170110_add_metadata_column_to_event_type');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT '84dad525-9aca-4a06-942e-2de7dd335953', '385bd1c58ef9fd8fd840e73c5f71f40fbec810adfcb783b4f37217a6640f0785', NOW(), '20220205135022_add_verified_column', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20220205135022_add_verified_column');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT '27b41f96-7444-493d-9003-acab9d2f75ca', '5e10b0f68233673c9ff5e3c5795d246c417d000076327ce8936d3c80c1fcbe18', NOW(), '20220209082843_add_rejection_reason', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20220209082843_add_rejection_reason');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT 'd2a99a0d-7104-4b67-b731-43bda6a0e42e', '138dbac34dbe2b5105c79037580dd1dfbd1e63266e60eb89d17b07ad5092ce9f', NOW(), '20220217093836_add_webhook_for_event', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20220217093836_add_webhook_for_event');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT 'e88e0246-20cd-4c34-af5a-b08b5c7e9dde', 'ef2aa301b62e2eeff9d9f0c71dd795bc91f61bb27bbe29bc5b2fb88f9c342229', NOW(), '20220228122419_add_time_format', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20220228122419_add_time_format');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT '38011205-9e0e-4aa6-bf41-ab054d97aaae', '80d9e25072006bee228a27b685e65082ebcbd21ca85893fe4109c830510bb5d8', NOW(), '20220302035831_add_before_and_after_event_buffer', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20220302035831_add_before_and_after_event_buffer');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT 'b3cf5cd2-cf08-45df-ad45-881a63a2b805', 'f4ff676391e001f19195a416b8c47028f616dc103335847741e759454c40ca8a', NOW(), '20220302110201_add_dark_mode_brand_color', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20220302110201_add_dark_mode_brand_color');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT '053c222e-8983-4c3f-9710-c99b83d281bb', '35c10c4e71a9bcb4a0a948bfccbed30015741ffeecd4a61c3b9938ace8df59fc', NOW(), '20220303171305_adds_user_trial_ends_at', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20220303171305_adds_user_trial_ends_at');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT 'a4b512f0-feff-4fdc-9435-66bec2f2765f', '7788b8896d63f27ba216a46cc1fa11b8190e7e89338c73886c07f29d4f1d7573', NOW(), '20220305233635_availability_schedules', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20220305233635_availability_schedules');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT '3d2173c0-b30a-49f4-9644-db9d335b460b', '1148092037e617fc25e7d6cf228d960f5a8fa70f0407c163033bc0697059c13b', NOW(), '20220305233635_rename_indexes', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20220305233635_rename_indexes');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT '100b40ec-85c6-4058-87cc-20ca72af6710', '1888ccd0ef698974fe8769f8b78d646492b952ef9a86542a2264e2e40e63c0bc', NOW(), '20220306010113_renames_verification_request_to_verification_token', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20220306010113_renames_verification_request_to_verification_token');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT '28a6fa7a-8afb-4463-aac2-ffc0e79cfd69', '6d0d8bd0366812763fddc227daa67f62357c4abe7fd7262fa9401a99e25ba90a', NOW(), '20220323033335_reschedule_fields_to_bookings_table', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20220323033335_reschedule_fields_to_bookings_table');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT '6f30d5e9-4a3b-40a1-9ea1-6a81a148032e', '0eeadefe21baf1bf403028e21f828c8c2abfd66163be74b0cecb43a5870f8dca', NOW(), '20220323162642_events_hide_notes', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20220323162642_events_hide_notes');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT '48ecc4eb-3ac0-40ba-b02c-8d2aedce2c25', 'fde3fb56246133f119104e776772a4f248ae7326ba355678e864cc9eb2c6b6b5', NOW(), '20220328185001_soft_delete_booking_references', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20220328185001_soft_delete_booking_references');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT '1a82d0f2-ec04-4abf-9e7f-73142eaec2f4', 'ae2f687b4de00d8297d7ad123998708be5e0bd078b1c13d2b41ae98df18ad23e', NOW(), '20220330071743_add_dynamic_group_booking', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20220330071743_add_dynamic_group_booking');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT '8bd1df32-65c1-473e-9118-f0de09346e00', '1f8ace6ebe1fa7d8f1a285acccfde777531868f4e70b5d2130e0b0eabd169ec0', NOW(), '20220404132522_redirect_url', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20220404132522_redirect_url');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT '8aa124e2-b126-4325-80c7-f4c68f5def27', '5cf407dbe019463af133f891cb3e434337b0c0c29cc5bb4d3a93a5ce6015b807', NOW(), '20220409155714_impersonate_users', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20220409155714_impersonate_users');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT '93f1ceda-af26-4b0a-9129-b8ff6e8d32ff', '554ccccca38cd6437278b86f030292e714ff65eeca42708af16fb6d873ecb24a', NOW(), '20220409195425_index_event_types_team_id_slug', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20220409195425_index_event_types_team_id_slug');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT 'a1634da9-8450-45b6-88a4-198020708a99', '3fbe71c009ea425d62b0c060a1af2de2bf6029f04990f5f5dc0f14be2ba227af', NOW(), '20220412172742_payment_on_delete_cascade', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20220412172742_payment_on_delete_cascade');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT '6812e864-85a0-4809-9d48-8d5bef00a6c5', 'b5fa1ff4c1620a72886a7eb7f16c92c37c9d9ec53ccff13230c6060b545fae0b', NOW(), '20220413002425_adds_api_keys', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20220413002425_adds_api_keys');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT 'd4174124-648b-4f3f-8489-6a0dc5fe7bcc', '9d0c2a5079ceaecdfc95125c9a44fd31ba3a9d29986ed1794971483f701fd761', NOW(), '20220413173832_add_seats_to_event_type_model', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20220413173832_add_seats_to_event_type_model');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT 'c284841c-4742-43b7-84b2-8e71070b0f6a', '8573ee0ecaebea344f1f57b7e8e8e55f954f02888f3c64556d4076840a1183db', NOW(), '20220420152505_add_hashed_event_url', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20220420152505_add_hashed_event_url');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT '70e15bae-b7a8-421c-9f27-e50595cd5270', 'a299ab8d983f92bc902670f4344638e82988273dfe471105194cd2455094433c', NOW(), '20220420230104_update_booking_id_constrain', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20220420230104_update_booking_id_constrain');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT 'e78a9636-c5b7-4966-8561-bb2551e6a3d2', '69aefa7b67faf5ca60f747f8dfa7d9d9fedce7f5f6810eb879cdffbafbb4eda7', NOW(), '20220420230105_rename_verification_token_unique_id', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20220420230105_rename_verification_token_unique_id');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT 'e2de89c7-0dc9-4f94-b64e-2b0d1c0af2ea', 'cff612da89db52b7867f4d5168d7288e60600d46cf835c0b3dd88b85c38fdddb', NOW(), '20220423022403_recurring_event', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20220423022403_recurring_event');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT '8761dd65-1fd0-455e-a232-f9d9b3fa8f8c', 'f666df068f37eaf72130c517b4ac20d47adf54784856b3605201329ff957b484', NOW(), '20220423175732_added_next_auth_models', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20220423175732_added_next_auth_models');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT '7fc20e3b-b97b-4167-8250-2fe0bc626111', 'd9813419346f834f7484f9eda808bf4cdaf0407c3c619bd25921ef6be988fa67', NOW(), '20220502154345_adds_apps', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20220502154345_adds_apps');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT '8c53414f-53e3-4c84-85fe-e03761914bd3', '0139ca10c99733b5e4f11d5b3f29e709a429874c1eb46d462499d4904eccf0da', NOW(), '20220503183922_add_external_calendar_id_to_booking_reference', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20220503183922_add_external_calendar_id_to_booking_reference');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT '37b51f76-4a3f-4476-8a14-471b2ceeb1e6', '51f08ccf5437a6582c9d0c6a1d876a45ee5a41c47add17776f600593bdea86b2', NOW(), '20220503194835_adds_app_relation_to_webhook_and_api_keys', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20220503194835_adds_app_relation_to_webhook_and_api_keys');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT '9f697a99-db70-4d11-90ec-449ae4347c9e', 'd4bf1b4dead648e08143c72df5c2e7750042840b5a702c052c3a35ac5a3d310e', NOW(), '20220511095513_add_custom_inputs_to_booking', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20220511095513_add_custom_inputs_to_booking');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT 'cec551a0-00f1-45c6-b71a-8005a44afb18', '350af87cd325ea520e3fb39208f244c1cfe15207b13551414f2380cb6c0fb914', NOW(), '20220513151152_adds_feedback_table', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20220513151152_adds_feedback_table');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT 'cc6a0f1e-c78e-4dac-8089-42061329c491', 'b13edd80b25f9d9de4ef2c6f71f37e1df33462bbb97cb9e9c98a48041d256863', NOW(), '20220518201335_add_user_relationship_to_feedback', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20220518201335_add_user_relationship_to_feedback');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT '4cabf358-d643-4ec7-9d1a-ca3a2650cade', '0a7f8c36c226f9d9fef7ad9803364ae0bc849f1b0a4bf25fbbadc92bdf8e9ba5', NOW(), '20220525110759_add_user_impersonation_toggle', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20220525110759_add_user_impersonation_toggle');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT '2637bb0f-5c5f-478f-8a2d-fb0273b51c03', '798d0df5e4c0b4b2fb802d589d70a35bfac86910c06a561c455dd999ddaa2fc4', NOW(), '20220525182228_cal_video_preinstalled', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20220525182228_cal_video_preinstalled');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT '762fbd8c-92d5-4d30-9614-3f85f3206bc8', '4d29743a228401dcd8298beccaf59f5cc98cf807ed602f289afc90d80affd5c9', NOW(), '20220526151550_cascades_impersonations_on_user_delete', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20220526151550_cascades_impersonations_on_user_delete');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT '96daf6cd-5ecf-49f4-b1cc-da45c3e95728', 'd46e7d3c512164fd3235a7ba24d7f15cec7ba1ea3c6bf4c88ad1a3783604d7e6', NOW(), '20220604144700_fixes_booking_status', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20220604144700_fixes_booking_status');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT '0e55bae3-9bb6-4711-be21-cb78fc3bf406', 'dc1b470f106c488c3197acb3b7a5d798ff20650e00ba8f513cbd08317ee75b6f', NOW(), '20220604210102_removes_booking_confirmed_rejected', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20220604210102_removes_booking_confirmed_rejected');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT 'e8d78a50-914c-4fae-aff8-359a70aa51f5', 'ddab9555b9c1bbdcdd72c1d69f1d4d3c6eba916992bc635e665f44c6e1c36d8b', NOW(), '20220614090326_add_webhook_secret', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20220614090326_add_webhook_secret');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT 'b3ae16cd-8dd0-45e1-b15f-246980504f7e', '42339d8c3266f5dc60c68a33da4170ed980751120923d8f3d586e2a3205eafa3', NOW(), '20220616072241_app_routing_forms', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20220616072241_app_routing_forms');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT '7aea3e39-5a50-4930-a653-c0568fb93fde', '11cec2fdcef331465e916ba8af2896766ef035e69fe379c7ce514861c9de806a', NOW(), '20220620181226_add_all_userid_to_users', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20220620181226_add_all_userid_to_users');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT 'df59ae15-fc29-4c44-af69-48c7ebf556fd', 'ad8b7ccd570a08bef1cf528b7abf9b143a550a5e6352cf4091de32d7c1ffd963', NOW(), '20220622110735_allow_one_schedule_to_apply_to_multiple_event_types', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20220622110735_allow_one_schedule_to_apply_to_multiple_event_types');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT '4f6f7a57-8125-4269-b6ec-6210e51a1ce0', '233a47e96e4e705bd363d0f0090374dd55a532fdefcb79cff2a7dcc3acab8b8c', NOW(), '20220628184929_adds_missing_owner_relationship', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20220628184929_adds_missing_owner_relationship');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT 'd0cb3c65-5bd9-4344-b398-10cc69f2792d', '02ccd6af1a64a1c2bf7b81979948fbbd67ffaf00970606401c5fe0535d158d84', NOW(), '20220628190334_adds_missing_oncascades', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20220628190334_adds_missing_oncascades');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT '0dbcef81-7567-4ff3-b9ce-824f953f1a15', 'fb6c0a32ff3484692be71ce81a64a4bcbe74842c625c2ffc1ef3acaa827dffb5', NOW(), '20220628191702_adds_default_date_to_feedback', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20220628191702_adds_default_date_to_feedback');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT '0e263646-8c88-47a3-853a-250b05fc16a3', '826ac36330be01623a8cc5992ae35bdf0b41e894d579f42a8b83eaf77bd106ab', NOW(), '20220629151617_connect_destination_calendar_to_credential', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20220629151617_connect_destination_calendar_to_credential');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT '23128c66-9614-4768-b7ca-749ff2410354', '7072341ffeed7b098109632c615cad02fa50dfdbf69109183145e2f43f6aef53', NOW(), '20220711182928_add_workflows', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20220711182928_add_workflows');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT '78937133-587a-4cf7-801f-ca64e8064a64', '930918df4413469203d4bf8ade1bfecbedb4b6e9d50aecad00424082fadd883d', NOW(), '20220714175322_destination_calendar_one_to_many_bookings', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20220714175322_destination_calendar_one_to_many_bookings');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT '456885b3-134a-4d87-984a-bd62eb5c10c2', '92561d67c42195da347bed6a8aaf6150058655b2cf06c6d31e68032387e2a2cb', NOW(), '20220719110415_form_submitted_webhook', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20220719110415_form_submitted_webhook');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT 'd3c39bef-5884-4ab2-b19a-8678165ee5d8', 'a6aaada56137b6423206fe48eb55e2011ac5c5a1a5c5625f35461b09ecf2e56b', NOW(), '20220719144253_disabled_impersonation_teams', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20220719144253_disabled_impersonation_teams');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT 'eb171d24-3411-4f4e-93b0-4c873c92da21', 'a4c5e093efe8171f3316b8d7bd1a9c301b7256956b7af94988bd07f2a838e359', NOW(), '20220721183745_', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20220721183745_');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT '7ddd091a-604e-48ae-802c-ae9f5f3b19fb', 'e0372faa8136103f46289c67dfb0a0defee414ecbae5c3b551937f89d9e2249d', NOW(), '20220723001233_', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20220723001233_');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT '56169fa4-1d0a-43f7-aa02-a09a60ab4cb5', 'd28656009e9ac8573d15cd227b75f20203d51f007c5189a77ce614ac147836c8', NOW(), '20220728111440_add_created_at_form_response', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20220728111440_add_created_at_form_response');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT 'd8d6fb0c-eb47-46e9-bd5a-c673f8014816', 'c5ec91813c202729e7674f9c6ea4fce6aba76c18fd55da0e7fefc304d8ea7227', NOW(), '20220803090845_migrate_daily_event_reference_to_booking_reference', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20220803090845_migrate_daily_event_reference_to_booking_reference');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT 'a71ba385-aefb-432a-b22d-ae55e22ac3ce', 'fb692a2fda518faab20810a6c5df05e2fc9065acf764d6bf0587fbc7d9e49475', NOW(), '20220803091114_drop_daily_event_reference', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20220803091114_drop_daily_event_reference');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT '91be8d63-b8d6-42b0-9516-ef6d79ca1190', '649972587ae5a5e8d056ff758765ebace7eb5dd407db698544ab23241f077707', NOW(), '20220811132430_add_unique_index_to_webhook', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20220811132430_add_unique_index_to_webhook');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT '330949df-bdd4-470c-bb90-3c3713fa30a0', 'be21ae8cea926b689c370fb9b2d4d4bec990cb96267c99697dfec52ed4650602', NOW(), '20220811234822_add_after_meeting_ends_trigger', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20220811234822_add_after_meeting_ends_trigger');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT '7e904c57-b93d-4c7f-9f0c-e9bdfa7526b4', 'd5082893b81053f86a1a5e0664af02a7e7fb62d35f0d63fc892c45b3e3c03d1b', NOW(), '20220817201039_', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20220817201039_');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT 'e6aca60c-8f7f-4149-a8f4-17812c55a15d', '781b81233a0d8e6867d9de66e0e416205f52bcb4741e0aa92cf8333c508ea72d', NOW(), '20220827082641_reschedule_workflow_trigger_added', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20220827082641_reschedule_workflow_trigger_added');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT '5dcb568b-e7ea-43d9-9e06-4691a5cffbd8', 'b397fc8ca5eabf0626fffc596242baa50f4c18927ed5440b2222a19be90ef998', NOW(), '20220912134714_add_automation_category', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20220912134714_add_automation_category');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT 'f3ef7f94-a0bc-440d-b962-aec67b28a242', '1d3d9b6ebfca9b6cdf61af9a2a34fd5b498f6d1119ad573a7529ff03ea546606', NOW(), '20220913034937_move_n8n_zapier_to_automation_category', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20220913034937_move_n8n_zapier_to_automation_category');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT 'b31e5e0b-335a-4742-a2b6-8274a71af141', '8817fc6b1764ffd6648a9c715144c528f462cef3586531b47096303475d334f9', NOW(), '20220914215052_convert_pro_plan_to_free', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20220914215052_convert_pro_plan_to_free');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT '9bc1640a-9990-4e15-9f72-ccf41cf7e2dc', '19f26dfad0065c81e02007c7de737864821787d1829e597f92e3481c8bd8740d', NOW(), '20220917042621_rename_routing_forms_slug', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20220917042621_rename_routing_forms_slug');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT 'f5547a35-e9c1-4e77-954c-fc23f57234bc', '5d0874dd39872de080b203084aca621f3cb8d5adbf04d51681f93ba8bb1e5c56', NOW(), '20220917201512_revert_convert_pro_plan_to_free', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20220917201512_revert_convert_pro_plan_to_free');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT 'ca7d8740-5e01-4c0a-9a51-de53b30f8a4b', 'a16caf4c4a648f38809629f3b65287267a2e86fdc4c8f8f112ef77e6ff154063', NOW(), '20220926105434_add_booking_limit', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20220926105434_add_booking_limit');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT 'abafd58c-da85-4848-add1-4194c8129463', '4c7f20df499ec8701955301c2a2a8d8c0dc98eb7536bb0eb2e7bd19eac05db9d', NOW(), '20220929132137_add_seats_hide_attendees', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20220929132137_add_seats_hide_attendees');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT '95cf5b2c-be82-43f4-98e9-0dff75303499', '1cccf39894a738498d49ac8c6480944a229ed540b0f30d0df3790091d50e11f3', NOW(), '20221006044939_routing_form_type_migration', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20221006044939_routing_form_type_migration');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT '63227678-7d51-4319-a081-5f80aa1b04f5', '077373f05af5de8c97bd23faeac50b81b6dfbba255d28dc586f6e645ec8b0f47', NOW(), '20221006121954_add_after_event_ends_workflow_trigger', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20221006121954_add_after_event_ends_workflow_trigger');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT '4f021d68-d66c-4143-9f58-7562071ee3f8', '0ba31eec56da3a6471c16914b7835faa3b6264346aad3f56ddf7a5438e24ac36', NOW(), '20221006133952_add_analytics_category', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20221006133952_add_analytics_category');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT 'dc150b12-1e1d-4bc1-a38c-830c434050b5', '349c1ef12b026821bfda7202e9c21f4386639414b38050c5c6dd624c13460846', NOW(), '20221007112203_add_email_address_workflow_action', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20221007112203_add_email_address_workflow_action');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT '6036653b-cc96-45a6-8398-793573b754a0', '3199de1c5f089c0fca77343a47846b93a75ea097887913bc058f1f57a003d601', NOW(), '20221011001632_make_team_name_slug_required', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20221011001632_make_team_name_slug_required');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT '24a0d819-d76a-4e13-8c3d-6989519ed058', 'e1bbd853c11bdd1ac4047240acd474dadd74029806a6acfdf6352509798cd2e4', NOW(), '20221011012344_add_membership_cascade', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20221011012344_add_membership_cascade');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT 'dcd583e2-cbe1-4a96-8ae6-7398daf5202f', 'f926c6029f2268df5348b1c1c000487300ea192c51508564471d020ae06e663d', NOW(), '20221017115710_add_number_required_to_workflow_step', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20221017115710_add_number_required_to_workflow_step');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT '04c443d7-fe2c-4956-be69-5e9196053bce', '437538b5b7c9f62d0134b134179977e5b972645ed36c3646ba52809f7150897c', NOW(), '20221017205314_add_invalid_field_credential_table', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20221017205314_add_invalid_field_credential_table');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT '17a204bc-20f8-46a2-b6d3-deb9a14d2da7', '4851d0d114982759ea76a717ca812319e840ef138fca52b557ae21b8ea721aa0', NOW(), '20221028093727_add_routing_form_settings', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20221028093727_add_routing_form_settings');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT 'd9de23ec-e1e8-4a12-9281-02cbeeb1e23f', '443513053571a55b2206b224f65b58a9949b764f8866877ab39829f694450327', NOW(), '20221107201132_add_team_subscription_cols', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20221107201132_add_team_subscription_cols');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT 'f7dc1702-b651-45db-be70-67c8e26d8f28', '9dbfc44901b4a2b49a8a06ba967546b57b1c5ef2c46b24b984410bb779035745', NOW(), '20221110164757_add_sender_to_workflow_step', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20221110164757_add_sender_to_workflow_step');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT 'f1b89497-96cd-4153-b1bd-520b4989ef23', '83c5bd0da4d39fcca6322036f9f8e32fd14657ca05de4d3073dcb6dea09cdc8d', NOW(), '20221111152547_add_enabled_col_to_apps', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20221111152547_add_enabled_col_to_apps');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT '0d70e4a9-ce44-48da-9b28-dc12b692575e', 'e8a2b6a01847c0a001d54c73135cdd4449eba44435f462fc0ce0011035d730e8', NOW(), '20221121115813_', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20221121115813_');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT 'b6f1f196-4e7f-4384-8a25-fe15d0cd0bcf', '69b8e12e56f214228e6fc847b1a730bc25608b77abf8f4739c3e42a97bced2ed', NOW(), '20221129112344_adding_radio_custom_input', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20221129112344_adding_radio_custom_input');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT '6fa2687b-ffdd-4902-88f5-812d17673265', 'c54212be97a3cc06e0ac5d2f4a0ea72267bb7765b40ed9e5c0897cab43608745', NOW(), '20221129125935_add_metadata_to_booking', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20221129125935_add_metadata_to_booking');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT '1ce99173-1840-4abc-b36d-8ddbe675198a', '6738039bbd77d5b9736c7e774ca0370d714d0e588ae6ee06568b9835c6dfe26d', NOW(), '20221201191836_credential_invalid_col_default_false', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20221201191836_credential_invalid_col_default_false');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT 'c71c1b7d-d424-4022-9e08-a810c3b9aa4e', '2e7801661f054b5cb4dfe1b11f37ed71a77797933b60c6ef9dd48d9dcc5fe781', NOW(), '20221206152547_set_enabled_to_current_apps', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20221206152547_set_enabled_to_current_apps');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT 'cd7cb392-e65a-4606-a05b-fde34ab1a1b1', '5f35c9a3c417a9b446063124f46ba57e2021c5dbe75435951453bf6c7ca12e52', NOW(), '20221208221811_remove_user_plan', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20221208221811_remove_user_plan');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT '11b9a319-3426-4744-a277-5f1d9ca71dd3', 'e57798b7c3867969708707608a97b464e4159afee8803b0a529951358ed9096e', NOW(), '20221214210020_set_seats_show_attendees_to_default_false', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20221214210020_set_seats_show_attendees_to_default_false');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT '27a4f0f9-133d-4d46-9095-3ab56a0a7a6c', '2e0de20cfe980f1e6f62ef922e4d28d5561c37ef05cc374da7a9a37beace290e', NOW(), '20221215120525_add_verified_numbers', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20221215120525_add_verified_numbers');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT 'cef620df-ab21-476b-9e76-311255769a5d', '7ea4541a36749562285e24ab03e742bef1b770fce4f9cc9a3706ff1e0f4f5313', NOW(), '20230105203125_add_hide_book_a_team_member', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20230105203125_add_hide_book_a_team_member');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT 'ecd094b4-63b5-4544-b747-a4a8df5d9464', '690c759d788012335c45c5c8890941e4c53f1d7ceb92fa6a44673f17f2fab4e4', NOW(), '20230105212846_add_availability_schedule_indexes', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20230105212846_add_availability_schedule_indexes');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT 'be804419-bdf5-4f6c-8667-7c7062dc0221', '8226dcf0c5affbb31ef599656b696e1eba4c0cc753997ab23133198067077136', NOW(), '20230111183922_add_host_relation', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20230111183922_add_host_relation');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT '9e793053-5e89-47db-b706-1c2d46a9f8b5', '984c29f6f62365afc886ff629ddb5cbb255e2293a349ecbbe055d468370f4cda', NOW(), '20230124154235_add_booking_fields', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20230124154235_add_booking_fields');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT 'ada7df1c-fda4-4488-9bfb-a20496d2cca4', 'd41999751a729f48a4758f6307a5fb0c89121c9519d3c3097ead7133c1deb001', NOW(), '20230125175109_remove_type_from_payment_and_add_app_relationship', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20230125175109_remove_type_from_payment_and_add_app_relationship');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT '29be8db3-a96b-4521-9015-7c6ff39b1858', 'dcf2362d91e1e3932a1a1c744a29851cebfbcfcef1a263a72660c0ab531de4e9', NOW(), '20230125182832_add_deployment', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20230125182832_add_deployment');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT '79351485-9e86-4e3e-852c-6aada5e9202c', 'aba82509a7f05052b36dc33c5fa5c76b09153297e9a462b5d26dcaf939bb1743', NOW(), '20230129094557_add_recording_exist', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20230129094557_add_recording_exist');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT '190aa8c3-4e3b-4427-8a4d-10b230130923', '9e12c2de73533edfa0b66e3fa1e0f3a97a5959f96cfc7dcad3f001c28efcd535', NOW(), '20230131062229_add_theme_and_brand_colors_for_teams', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20230131062229_add_theme_and_brand_colors_for_teams');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT '694bf7c8-9ebb-4c66-8338-379267d1625b', 'a9f6bedc61bee6971ca959bdbee612d426111ad645d6059e14559009bb9b4e67', NOW(), '20230210132534_add_workflows_to_teams', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20230210132534_add_workflows_to_teams');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT '20aa46d9-162d-44f0-adba-b2d3ec605b70', 'ae036c66d1ff620a4a98709d8d14e67394d8fcd07c37deb80fb6e502165246dd', NOW(), '20230210182245_add_verified_numbers_to_team', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20230210182245_add_verified_numbers_to_team');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT 'bbd1230b-9cb6-4577-9bdd-79eded9df48d', 'be7a188ce892c3b77b95ae63bf3389afd2ceee476a0199859d7c030e51267b47', NOW(), '20230214083325_add_duration_limits', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20230214083325_add_duration_limits');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT '3f1c74ba-43aa-47e2-9a12-9dc0dc9f0ccb', '9f8188a3f754a686fc2c10ef74d0d74ff810f82387fe5f43633e6d93dfaf1a2e', NOW(), '20230216134219_managed_events', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20230216134219_managed_events');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT '5815d4aa-394f-40bb-af11-57bae5603987', 'edea4f5bb04350a5e538433620691a2d9ed1c5839caf66186d5f35452aa88e23', NOW(), '20230216171757_host_user_id_event_type_id', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20230216171757_host_user_id_event_type_id');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT 'f49c13e6-9a14-4113-aac8-6c5692eade61', '23659f84fe82cdac4236eb14eb48e35cac5910be6c5b26c2caf985178c8bcd17', NOW(), '20230217230604_add_cancelled_to_workflow_reminder', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20230217230604_add_cancelled_to_workflow_reminder');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT 'e296fdb2-d40a-4de4-99af-a835456ec0d8', '3487c1451c67c4fb0b7167e6d9a9a3fc7da29139e11747f59eaece62bd3cf2eb', NOW(), '20230222152136_assign_event_type_ownership', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20230222152136_assign_event_type_ownership');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT 'aaf32e23-c4f2-4938-9f80-1d6af688555d', '2f4e1f437145d528ffae37994785e8917620473ac7782eefe18a914d6a859504', NOW(), '20230303162003_add_booking_seat_reference', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20230303162003_add_booking_seat_reference');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT '931fa9b0-e3ee-4da5-b04b-669635e97118', '9cada7486b637745a240687017f2f8949a6ca390c22e4cb261919f4e72753bdd', NOW(), '20230303195431_add_feature_flags', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20230303195431_add_feature_flags');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT 'f22b7906-899c-47be-a497-e97ddb443aa1', '3cc1208e69c1d21e811b128aa6d9bf2b89dd54ba226f154d3d7d48fb3669c3ba', NOW(), '20230303195432_add_feature_flag_default_values', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20230303195432_add_feature_flag_default_values');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT '4ce64f9d-df24-47de-920d-5e8f078b2d04', '275d32d7f3eccf2556d9f2691353a7baa0a2b9379abf11b129189100aa7fd9e9', NOW(), '20230309203435_make_booking_and_workflow_step_optional_for_workflow_reminder', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20230309203435_make_booking_and_workflow_step_optional_for_workflow_reminder');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT '830c2c98-70f8-490b-8aab-aa0c7d0e0028', '4b0907d4685aadcc971a33a3c43d57804cc1ffba4686377a8898e40595a303a4', NOW(), '20230328204152_add_selected_slots_table', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20230328204152_add_selected_slots_table');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT 'd86d6d7e-3f47-4e3c-be8f-f4c03b233ee7', 'b8c7f2917f1e397e9b1edac6fc4b71a1d8fc0cc023352f4aa385d21439011946', NOW(), '20230329000000_add_insights_feature_flag', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20230329000000_add_insights_feature_flag');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT 'cb0b614e-488f-4731-9d1e-c29d0c33c5f8', '2b74ff1fbc5219ba39584c686bd12ee12a115a3d5e93495539bc3f3f5e042b0c', NOW(), '20230330030031_add_payment_option', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20230330030031_add_payment_option');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT '6b88f47c-39df-4b03-8b78-c370827194b0', 'dca775e55f9a1fbd095974bcab8a2a2e81ea9857e72e11dc60434adcc8e832c5', NOW(), '20230404100155_remove_reminder_body_email_subject_from_reminder_template', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20230404100155_remove_reminder_body_email_subject_from_reminder_template');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT 'feb7d30c-3841-4016-823b-44df57f5ee5a', 'd39547b44bcc60a686bb849c89caf8ad508f613208d70c52c8546ea5451ceea7', NOW(), '20230404202721_add_feature_flag_managed_event_types', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20230404202721_add_feature_flag_managed_event_types');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT '56a7b6ce-5326-4d34-b848-ff8f69ec843f', 'c37422b22beb007672ca5eecb5df06f34fb7f212328953585871ed0043fcddc1', NOW(), '20230410234751_add_foreign_key_indexes', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20230410234751_add_foreign_key_indexes');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT '41cf5152-62a6-4200-9869-1d5cf1dc6714', 'bef959a87c02a89b70e4f2444647cca23a6ff3ee9541ca05b2253d1d8e404ec3', NOW(), '20230412094052_fix_apps', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20230412094052_fix_apps');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT 'dc4b9073-5fab-4a36-afc8-5ad7dfa0fde3', '5dba54effac44cf1dfb67670e47075fadb3e19c4215c9023e3c7ce2c0fb8f3c7', NOW(), '20230414112451_add_recording_ready', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20230414112451_add_recording_ready');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT '2066a741-2b7d-40e8-a742-91c4f0f04b0e', 'c7431321571359da31b6a931c095a9161fdcc474de0a2c67445fe25315deb3e8', NOW(), '20230417102118_app_logo_subdomain', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20230417102118_app_logo_subdomain');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT 'b318a029-3a61-4fc3-b475-7fdf15d62b87', '8604b24df6da933183e47789c9538d3c10c30ef2e3a64c6d64c0f0dfb9a50724', NOW(), '20230418002117_booking_time_status', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20230418002117_booking_time_status');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT '5f1695fe-f558-42e0-84c5-b3cecf0fc1f8', 'd53d1bda234c0bec97798891255eaa89c25b4a365954d8fcb060080d0cf7e285', NOW(), '20230420222915_add_whatsapp_workflow_migrations', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20230420222915_add_whatsapp_workflow_migrations');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT 'f89240d1-749e-4c5f-a8ee-5d0832b18135', '12902a524db4ac59aa8acdc9e474c05475043fe888f4ac0eda8d2b8c013de3b8', NOW(), '20230422152301_add_team_invite_token', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20230422152301_add_team_invite_token');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT '928cd9a4-2b89-4b2e-9b00-d8fceb934942', 'be5fbcc325e583cb4ecdb410f563b97a2cea832022ad8a62cbfe5f753e637386', NOW(), '20230424163718_offset_start_times', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20230424163718_offset_start_times');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT '4331d9a6-0e70-4992-a031-9cda76510b04', 'e957c8a857cc1f56c03190362fc428116150b05b059609aed41e3fb5d8295a67', NOW(), '20230428142539_event_type_workflow_uniqueness', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20230428142539_event_type_workflow_uniqueness');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT 'ffc27559-f097-4e2b-915b-1feaf7962dc7', '1457ae51a55e04be987cae6a47aa72134762af22a6d3bc3fa9f90977a657d758', NOW(), '20230513235419_add_booking_webhooks', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20230513235419_add_booking_webhooks');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT 'fc704761-3033-4383-b542-7bbeb7ce9721', '1f6d75c6d41ef48fdf417550c0727ddfd276b80fdb6efc26707ced381ba0d28c', NOW(), '20230515121841_add_team_webhooks', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20230515121841_add_team_webhooks');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT 'bcad7142-99c8-4a0e-995b-620e4ed2957a', 'd037e242858b6ad1366edcc6f66a00a71c151ddf40a048a4fd2eb34e582c55ee', NOW(), '20230518084145_add_feature_flag_google_workspace', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20230518084145_add_feature_flag_google_workspace');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT 'be284d54-6be8-4ca6-bd0b-ba240812a35d', 'cc6dbb0db7740bae8395aa80b3d92cd127491e110e81b41a6de6c09c78ba3c6a', NOW(), '20230522115850_add_enum_booking_requested_booking_rejected', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20230522115850_add_enum_booking_requested_booking_rejected');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT 'ff5fa256-d79b-4043-8f8d-7ab671305eee', 'b3b107afb4d555d456c6388eb5c254aea1ead094b9954a86bf244023acb21488', NOW(), '20230523101834_email_verification_feature_flag', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20230523101834_email_verification_feature_flag');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT 'dde271dd-ec87-4fcf-8784-94f65902c0ab', '6329fbcd3849dc81ac7bf74c3b775e968c9ff723b74b3db56eca1689ca85c484', NOW(), '20230524105015_added_newbooker_feature_flag', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20230524105015_added_newbooker_feature_flag');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT 'a69c1ff3-0de8-4fb3-b069-e8c2bc8df3be', 'cd7c51241ed280e9b0ff58875e38408b6ba7734213b1eb6bfff341325fa1edb8', NOW(), '20230531133843_organizations', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20230531133843_organizations');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT '11701451-4782-4678-8d9e-3c052bbe5cf6', '6ebfb0b9abe8a95f734207cedd1aeb91f6892dd33f1f38f7fcee111161ae8eff', NOW(), '20230601141825_add_locale_timezone_timeformat_in_team', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20230601141825_add_locale_timezone_timeformat_in_team');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT 'e7135b88-5ba5-46fa-8f86-4ff8e10e44ab', '245f18ff4c991debf3cf15cf8073a451623f3e35dc8fa0e73e0eb2b65cd4afc6', NOW(), '20230601181657_disable_signup_feature_flag', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20230601181657_disable_signup_feature_flag');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT '23fb1f3f-8038-4716-8813-c205b726f673', '0813c9408b509f1f12c9804acb2d11baf51019dcfbbb5eeb0031ac7ed2293752', NOW(), '20230603115613_reorganise_app_categories', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20230603115613_reorganise_app_categories');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT '91697362-dbe3-4596-8611-908ae47e1dac', '333072f5bc5e28744ede076a5016d58698ae6db072c066ef6851af6dfed92a65', NOW(), '20230605142353_team_routing_forms', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20230605142353_team_routing_forms');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT '3a63e03c-f84d-4aaa-9fb8-e148f2539cb1', '75abc34dafb0102e378b39dd49b35ae4415540596ee882ff5a1078165bda6b8c', NOW(), '20230606202918_add_team_id_to_credential', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20230606202918_add_team_id_to_credential');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT '2af36201-7a9b-4922-b42e-2826df2d9e77', '3e19b017b77d3ed355955974fd48099835176627d0d988b2174e3253551f58c5', NOW(), '20230622164946_remove_host_remnants_from_old_team_members', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20230622164946_remove_host_remnants_from_old_team_members');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT '7e8c724c-5e93-46a7-ac92-64e385587126', 'a1f88d289d0e8a201a434cd2df31012216167a87c184208c66c6438512e1b25b', NOW(), '20230629083927_add_team_id_in_api_key', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20230629083927_add_team_id_in_api_key');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT '91f45ec3-c61b-4a35-9f09-af73b2ae61ca', '4c0f0dbf2baa2f1fc869e7ae7fd837c86262cfb8d547683f432adce14527bc15', NOW(), '20230629124638_membership_autoinc_id', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20230629124638_membership_autoinc_id');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT 'ab1f2d46-6c1a-42e3-812b-fcd3a3a54a89', '97b8b0bf0d74a7e80663a10503c9eb5cbed2461ebc1d8575176735d35e53dbad', NOW(), '20230701125542_add_is_private', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20230701125542_add_is_private');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT 'cedb7e7a-dbe4-4bd9-a804-9dc79330793f', 'abb89f271c9ca8b65653179b8c33d2d864028934c086a5cf243eb8b2cb54c24c', NOW(), '20230712192734_fixes_team_verification_tokens', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20230712192734_fixes_team_verification_tokens');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT 'ee5c2864-70d5-4d84-8522-1e284b177ae4', '7333a68f364fe841130a2504ab07687ada9d63e380fe04b7e09bb0b9d89cf8cc', NOW(), '20230717175901_add_booker_email_verification', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20230717175901_add_booker_email_verification');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT 'd2ce7193-e7e8-4031-b702-f202761b0454', '818551cc996e629b94c338bf6e5e2a62b5091cdff8074f17e04c7f5cbcedd105', NOW(), '20230719214513_update_booking_time_status_fields_event_parent_id', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20230719214513_update_booking_time_status_fields_event_parent_id');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT 'd252ec6c-c3f9-4368-bbd0-18d3b923e3ca', '38cd9689bb88ca026178703a7246f5d60b80f76817d56b56b883e852cc02dbe9', NOW(), '20230726083334_fix_workflow_reminders_not_canceled_for_canceled_seats', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20230726083334_fix_workflow_reminders_not_canceled_for_canceled_seats');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT 'c9dc89e7-b52a-4b36-9ed2-b22f6616e207', '334fa382ed20f03915288606f5f52686acb437b6d8433ce8246b03b30dc332b4', NOW(), '20230803132959_adds_field_for_seo_indexing_checking', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20230803132959_adds_field_for_seo_indexing_checking');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT 'db3bd2c2-1962-4c13-8963-e77f11187b79', '0b9063478c94981ad7a3be41aac45416c43d924deaf7fd4fdaede8f3718e5e28', NOW(), '20230804153419_add_backup_codes', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20230804153419_add_backup_codes');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT '0a3e35c9-cbe6-46f9-9eb6-8114041bfa68', '12391bb2b5c327bc31db0b623395910e537c70848e09b167a10b43225ffba218', NOW(), '20230815080823_zapier_scheduled_triggers', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20230815080823_zapier_scheduled_triggers');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT 'c84f9404-1178-4ecd-82b3-4c13ddf34ea9', '213ec9b6005263d4293ab9194c83aa58a6fc949c0bb53c3889da8704b4fd3f56', NOW(), '20230815131901_add_position_column_to_routing_forms_and_workflows', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20230815131901_add_position_column_to_routing_forms_and_workflows');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT 'ef89099c-4403-47cd-ae11-9f03a5ab329a', '7abbeaeaecfe2c342fd44aa548e01ef09bb0941fa36d7a3ff6d51c417b64035a', NOW(), '20230828094603_add_include_calendar_event', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20230828094603_add_include_calendar_event');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT '7410181d-592f-4c2b-8e93-c58fd96b682e', '643c192479d942d25e934028bafa7e2d0e953be3ba15ee7fb8c9bbbd51ac1dfd', NOW(), '20230828175052_', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20230828175052_');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT 'c98f9519-40c4-43fd-9974-dbc4a21da98c', 'ddc19898cb1ba171397e210104d096e34126e543b31527771c5788ea3f4b9a03', NOW(), '20230902163155_add_seats_show_availability_count_field', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20230902163155_add_seats_show_availability_count_field');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT 'a7a3e4b1-4aaa-491f-b06c-856a9d28e15b', '497f1088aa8a3f45dd8e6d923e47b3a81f2c3abe53ef96c23448c2b6d3bbe480', NOW(), '20230904102526_add_booking_payment_initiated', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20230904102526_add_booking_payment_initiated');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT 'add41ac0-d35c-4961-b535-cf2366e7d8d1', 'eb4b3db41df8bd9e3f920f17ad946479faf05a81c0832819473f671742dc3f53', NOW(), '20230907002853_add_calendar_cache', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20230907002853_add_calendar_cache');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT 'e5bc41f7-220d-4303-9738-a7aa015babd1', '679e3cfd4cac8603e40bbac1b2b2368a3e08073285d09dd621a934e9beab2755', NOW(), '20230911172537_connect_selected_calendar_to_credential', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20230911172537_connect_selected_calendar_to_credential');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT 'dcad7cc2-765c-4bb5-9013-ec235850b5f3', '5b84d1604352e70b9da4386ad2f734d872feed57afd261ce410afd418736a135', NOW(), '20230920175742_add_oauth_model', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20230920175742_add_oauth_model');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT 'd6ca6ec8-b46a-487d-80b8-6d4d1f427f5b', '81b8c1c34313cf29509999e3e448eadd7c657b5ca03138911c1a6225022f5fa9', NOW(), '20230921002822_fix_booking_time_status', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20230921002822_fix_booking_time_status');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT '8b1e5c81-d58a-4580-8191-e115d602b747', '0d48fc3df2ae7f6bb4fc8df2e6a5f2607f97fb5fa99ed42da78c934993feeaf8', NOW(), '20231001101010_add_user_email_to_booking_time_status', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20231001101010_add_user_email_to_booking_time_status');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT '9c718271-fd4c-4414-af50-356d013de17d', 'd477ce6d40573336a6300c338a8da32b740fc7ed096cbebde1bcf7d4c3b5f92f', NOW(), '20231014180034_add_temp_org_redirect', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20231014180034_add_temp_org_redirect');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT 'fc2f9045-5379-45c9-942c-7deff92d8f05', 'f512f09c1ca249a4a5ced28e66e703ef5b3564153604aa0655575c38700aa97f', NOW(), '20231016125421_add_username_idx', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20231016125421_add_username_idx');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT 'd529fd97-496b-492d-96be-be7d982069d1', '75795d680d5aa54366c17724a9cc7ef3670efd04353b779d6b115926928e329d', NOW(), '20231016153526_add_workflow_reminder_indexes', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20231016153526_add_workflow_reminder_indexes');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT '7eed0ca7-6bbf-40e4-a649-d2fb71cd96a5', '1ffec53a031fe1f9569aee2e5f363bc7a5a27e47acf32d8c9a2a3fd57772c8ca', NOW(), '20231020090443_add_lock_timezone_toggle', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20231020090443_add_lock_timezone_toggle');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT '2b2fd2d7-b48f-4d52-8b86-a814c4fe6afc', '2d5a8c37661021bcc8415bbb7117e2b831990879c79008dae22f3b066a026523', NOW(), '20231024173642_idx_booking_status_starttime_endtime', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20231024173642_idx_booking_status_starttime_endtime');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT '250e17b7-4f3e-4cbd-ac1f-07b967d1b8f2', '7ec9af694ebc89605dabe057cb64501d7be05c760bfdd661061c0bbe975a9fd0', NOW(), '20231110122349_paid_apps', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20231110122349_paid_apps');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT '9d719ffc-a886-4f53-9395-ae3df849d001', '8901f67caa54eb863d4bd150632fec2a85cb53ca8975655c811cbb402bb813aa', NOW(), '20231113131945_idx_teamid_verification_token', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20231113131945_idx_teamid_verification_token');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT '19f86d7a-f542-45e6-a734-331da10a61cd', '6a5859be963ea199120225cbc1d2d1e45a082f90f1ebd13baf9e57f7b7aa3c26', NOW(), '20231113202947_add_ical_columns_to_booking', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20231113202947_add_ical_columns_to_booking');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT 'd39c41d9-5431-4312-92ac-4812e51c9182', 'b4e9a43dda108465642b425f0d984a364f93f42cc774f8d7320df406a2376266', NOW(), '20231114090318_add_avatar_url', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20231114090318_add_avatar_url');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT 'bf83ede6-037d-44e8-a215-40b147b9b58c', '8d070c7c5737b88c283ec9f6b6be809faee07fe33add54455fb97e80d06ab5e8', NOW(), '20231117002911_add_users_locked', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20231117002911_add_users_locked');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT 'a2610243-7668-48eb-8e65-48b21571c738', '43fe53ce7a5ae414e14078f9ca81d53374fba4854967a44a7a8572b6539b49a0', NOW(), '20231117081852_idx_eventtype_scheduleid', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20231117081852_idx_eventtype_scheduleid');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT 'c6f837a7-85c2-4f84-93d7-99ec3b53fb1c', 'a40aa85b3cde123fda52e9d386ea8a54a0767f423af695154311c8d09d411af6', NOW(), '20231201233433_add_new_user_field_app_theme', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20231201233433_add_new_user_field_app_theme');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT 'fb3d8504-08b2-4f9e-b0db-48dae1284b3c', 'cd012d8f3395f92d2cbfbe63d228ab2b7753bacb9f6fa86e571f6e37157e8425', NOW(), '20231202181233_adding_show_first_available_timeslot', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20231202181233_adding_show_first_available_timeslot');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT '098224ae-44a0-49f6-90a2-1e86d4efb0e5', 'e9e2f691a212f3099cb186e89e639407d4fb8e625b5986ca4e58982f29d5a28d', NOW(), '20231203154633_adding_is_mandatory_reminder_field_for_mandatory_reminders', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20231203154633_adding_is_mandatory_reminder_field_for_mandatory_reminders');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT 'ae736f6e-65f7-4450-8033-aa37fa3843d9', 'c53df02ff4eb1387a6fa3de5153166f99f6deb34707f7cf4cc4de3f4203edb67', NOW(), '20231206191034_add_cal_video_logo', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20231206191034_add_cal_video_logo');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT '51fe6caf-1fca-41fd-921f-989b31a96fb7', '366c0899058a7a19d546809a8f0c50cf11ca6a28488cda123495f4d944b655a0', NOW(), '20231206220118_add_recurring_event_id', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20231206220118_add_recurring_event_id');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT 'e7176265-88ae-4487-8fe2-757f4b045fdb', '3ccc09979c83723a643b50576d46638a7bb94c0a0f41b84e24945d9baf0dcc69', NOW(), '20231213083720_add_meeting_started_webhook', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20231213083720_add_meeting_started_webhook');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT '770fb7c7-41fe-4812-93cf-246fbe490bb3', '36a8d8f99ecfb497b8cb10421d60a97a494c9aefc22554e15d8198c3740a9154', NOW(), '20231213153230_add_instant_meeting', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20231213153230_add_instant_meeting');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT '43fc7225-9046-486e-b1ba-72da915dd893', '99ec87c0e3f617d5a1d6c4e504aec10cc7a9e2d6fe4038ec793ba6d625aa257a', NOW(), '20231220152005_add_email_in_destination_calendar', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20231220152005_add_email_in_destination_calendar');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT '855059e9-9a74-4a69-807c-d918b096d8bf', '356aa124c7229954274b90840e68974a500571e69e3f428803af61f639a15741', NOW(), '20240105110500_removed_newbooker_feature_flag', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20240105110500_removed_newbooker_feature_flag');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT '76216417-2dcb-4a9c-9ac6-5c5f35210e15', '3f1cf019aec263efc9d52d19c04b924db2b19322ad54ac5da3ba56ad36f67f0b', NOW(), '20240109041925_add_out_of_office_entry_table', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20240109041925_add_out_of_office_entry_table');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT 'ae54ff8e-2121-4bb2-89eb-54e0d1d9f76a', 'f94379e1d2c66ba82a5ed757c6e77d042cabfcf3c641b2cd3887fa1c2bf55f48', NOW(), '20240111075727_remove_brand_colours_default', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20240111075727_remove_brand_colours_default');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT 'd2d3a278-a5fd-4adc-870a-75216b6e7619', '0b0545cf1e7659188434b490ae4d6e72fe5be8ec1648621f39c8a78b3f2c2bfb', NOW(), '20240114195534_assign_all_team_members', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20240114195534_assign_all_team_members');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT '6a29a311-c938-4afd-a1b1-6a30ee8718ed', '51520d928d8e42c5e250169b98b1587e745650ee03ebb10fdcd89b21e9fdf483', NOW(), '20240116085902_add_pending_payment_column_to_teams', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20240116085902_add_pending_payment_column_to_teams');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT '75104d69-f724-4f0e-806b-9b591ec70e56', '734283c6775e05e7efa4e6fa9ac3142c9251b0d4f89f8684ab1afe6539261b97', NOW(), '20240117062434_move_org_metadata_to_org_settings', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20240117062434_move_org_metadata_to_org_settings');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT '2d92142d-8097-4e09-885e-d9e5860e4204', '60cb040e9502b4996e230ecfc52a821150578cfe9e1e9020e1fe18e7a0ab6625', NOW(), '20240130134919_add_profile_table_and_add_event_type_relation', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20240130134919_add_profile_table_and_add_event_type_relation');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT 'cba5efbf-0c89-4a39-be0f-2de192705cb4', '94db13d4294084baac9ff3c988cc631048976b3fe446e4df1fd0b13fd56ead85', NOW(), '20240131021824_revert_20230404202721_add_feature_flag_managed_event_types', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20240131021824_revert_20230404202721_add_feature_flag_managed_event_types');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT '3d8d250f-387a-49ef-a23a-93c5b2b02389', '195ce1bbbc0dc31e88672c07063f242af939a1a08e601629cf05e891cadd732a', NOW(), '20240205185412_add_email_field_in_booking', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20240205185412_add_email_field_in_booking');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT 'cca23603-e5ec-4ca8-abce-b10ed3a3692c', '229ec1477a0b7fb23972d19136a4ffaccfec5cda4140029cd70a4819f29d9b54', NOW(), '20240206162624_add_priority_field_to_host', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20240206162624_add_priority_field_to_host');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT 'e856a8f2-0b39-4de4-8f50-8b5f2d14cdfd', '44754b940d98295904804fc2165f166f55721d06e135b185c03726c8f8d16e2a', NOW(), '20240207222843_add_google_watched_calendars', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20240207222843_add_google_watched_calendars');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT 'e3a3032b-8d60-49d3-9311-457bcfb33f60', 'fd07a94d001fe8fa312cdf0978cddb459d03111e2f647c72f8c5a5d79a8012cb', NOW(), '20240208075646_use_event_type_destination_calendar', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20240208075646_use_event_type_destination_calendar');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT 'ddd6646f-d092-459d-aced-d4432ee4ba43', 'e4886e799162be90b08959f7797ac81933e2c5035ad4bce47ddfb52f4aadc9f8', NOW(), '20240209223121_adds_user_password', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20240209223121_adds_user_password');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT 'f83bb34e-3ae8-47cf-be73-78beb36d39c0', 'a65941ee41fa8feacff6177a5eb34d9a62d9e064470ce94f91b1d27e68ded7da', NOW(), '20240213081819_add_secondary_email', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20240213081819_add_secondary_email');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT 'e80af89a-74a2-4107-943e-67ed84cdac21', 'abf4570d261590dd92a6fceab5336eb68f32a125b529d392d98ce7f3904b2e81', NOW(), '20240213220617_drop_deprecated_passwords', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20240213220617_drop_deprecated_passwords');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT 'af01d0a5-dda3-496f-a550-6e9defd60b38', 'd4f1f0887f20149633abd8f3d1cca1749a2aaa0c5a20df14c85c813123927946', NOW(), '20240214093418_add_banner_url', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20240214093418_add_banner_url');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT '8ed621f9-7747-4f34-ac9c-d46a9dbdeced', '78fe196c67040f75e1006beca97966dc4d7c1bfbac06bf97174c0dcc053dce29', NOW(), '20240220151951_add_dsync_data', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20240220151951_add_dsync_data');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT '7b510594-ae40-442d-8c87-a48cc4e664b3', '9c0d30cbbf429b79a0c704822a524b0391fd1941e870079c46eb91862bc0fe5b', NOW(), '20240221051147_link_secondary_email_with_token', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20240221051147_link_secondary_email_with_token');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT 'c0f11e70-4b83-4cae-b0de-a29b41c9b833', '203f4e4c66deed80688952e5ae8bebe8d2038679f5391398add8a9e0ce138805', NOW(), '20240222120917_link_secondary_emails_with_events', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20240222120917_link_secondary_emails_with_events');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT '9d634a7b-f7b7-45c2-8159-a75a5c4a7eda', 'ae6a04b5d9555097d332a910d5aec09090f618aeeb04312fa8a3e747d2285011', NOW(), '20240223033247_add_dsync_team_group_mapping', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20240223033247_add_dsync_team_group_mapping');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT '841c9156-d5d0-4dd8-8524-1b1595c8c1b8', '44fce2dc7531a873679292987088df0c3dce77d92ec86b0083a637ea51589aa4', NOW(), '20240226125946_add_idempotency_key', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20240226125946_add_idempotency_key');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT 'c6503212-2ed6-4150-ad15-13fe57607848', '3919c5907a2b9983f78648ada89c1687e376fbddb1107dab06df7aaa8162f5ee', NOW(), '20240229154858_add_insights_db_indexes', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20240229154858_add_insights_db_indexes');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT '832dddec-9b23-467c-bbb2-c83d0105b2b3', 'a025a234bd097f14fb803284f53fccda563054d81ecaa86f1b75f363b2dcdfad', NOW(), '20240304093822_lock_eventtype_creation_for_orgs', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20240304093822_lock_eventtype_creation_for_orgs');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT 'e239f8a0-edcb-4b47-8d30-9f76fd43738f', 'fa009e6208d2e7cee8cd832e15effef03d79819ce9fa631239b554696eadf987', NOW(), '20240305054507_add_reasons_to_out_of_office_entries', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20240305054507_add_reasons_to_out_of_office_entries');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT '148ea662-7aba-4fd3-9979-fdaad1775b63', '288668ca25e2766a2103095f0c74d81299ec60fb0fac2e42a71ecf51e29bd03e', NOW(), '20240305054508_default_reasons_out_of_office', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20240305054508_default_reasons_out_of_office');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT 'daa1b197-7929-4d1c-860a-07a1acbab541', '4c27c94cefb400549a918f7036ee7f4a0af4aebb5af903d7bfc92e4f43750bd8', NOW(), '20240306041233_move_dsyncdata_to_organization_settings', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20240306041233_move_dsyncdata_to_organization_settings');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT 'ac927aff-95e9-4880-ba46-ec2024cce32d', 'b8cbf484af47963aa8c0083ea6de49cbb0b72738d6cdb4c09eb0a3c1b09e8c1f', NOW(), '20240307200336_rename_dsync_org_id_to_organization_id', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20240307200336_rename_dsync_org_id_to_organization_id');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT 'a1c47bc7-6f28-4191-a79d-b745263ec7a0', '907d79c1ed3c7f82ec237b504434aecd3536881b520a0537d36c999af080f965', NOW(), '20240307203026_rename_team_group_mapping_org_id_to_organization_id', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20240307203026_rename_team_group_mapping_org_id_to_organization_id');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT '72376b08-807a-4845-8a30-86959454d897', '1d3cc9d52d0348cc21d10d03e57fc618a54f3787ec5027bfbc50c9dcc907dd3a', NOW(), '20240308211937_add_notes_field_to_ooo_entry', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20240308211937_add_notes_field_to_ooo_entry');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT '8c6a8f58-8def-4cd1-b1ab-146036bc9fa2', '5864e07c2e5a71cfed494326a998167ca87eb470cf82297b7304cdd368de6d2f', NOW(), '20240308214010_add_is_banner_in_avatar', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20240308214010_add_is_banner_in_avatar');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT '67909058-52b8-4e12-bbdd-a628b2cdf5ce', '0170a76c5629d757d2dbabdab29b1838fb8b291cd08c054c7b1ef031d244ac17', NOW(), '20240313151954_connect_dsync_data_to_org_settings_org_id', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20240313151954_connect_dsync_data_to_org_settings_org_id');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT '9f5c885b-e97f-4b8b-9aca-53eb3218cc60', '750944028c69b9f239ab9452547d45d298379a9123e244a1e1ccc8d0c05e341c', NOW(), '20240314152130_platform_wide_webhooks', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20240314152130_platform_wide_webhooks');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT '8915b18b-9fb8-4080-809f-c8b1e370164a', 'b07cf4708a3ab39d27a063f232ac43224a8867fae24cab465ab6c447cf4f4334', NOW(), '20240318085938_add_provider_email', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20240318085938_add_provider_email');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT '6b2871a4-5c96-406b-a3e9-e3d06a72a14a', 'de6235ffe87e35f822742fd7e16c7bef589c9c89050ff6aedef0b866ac3fdeba', NOW(), '20240319144740_platform', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20240319144740_platform');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT 'c1b2b84b-4221-4651-be1d-fdbe29792613', 'a704caa99e98e9da8350b80d89554960de68ff7da8b7a2410f231311c8653a4c', NOW(), '20240321143215_move_avatars_cols_to_avatar_table', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20240321143215_move_avatars_cols_to_avatar_table');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT '3732e713-573e-4f1c-b129-64dca441f430', 'be6e88b48c28fdcc7dedaa4fd70559050eecad909eee00c8bee986ee3205a95a', NOW(), '20240321153033_add_travel_schedules', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20240321153033_add_travel_schedules');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT '46581b5a-b2a5-4efb-a82f-99a4f11e4d0d', '69088242ea04a18f281236ac02305ee992c299dc8e3970ee8351659c29560c3c', NOW(), '20240322152654_add_webhook_to_scheduled_webhook_triggers', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20240322152654_add_webhook_to_scheduled_webhook_triggers');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT 'e83a4766-f72c-4f6c-8e1c-80f90b944b2b', '373f844db8b2c42a622281e41e9ce8dd77bfe25c3d13fd43f07db921dda7f4a7', NOW(), '20240325082604_add_is_platform_flag_to_team', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20240325082604_add_is_platform_flag_to_team');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT '2becfa9c-d8cf-454f-adc2-3b92d1021249', '2c8129d47c019ccbe6533610200111290556e875b322196eac2e288eeefb47f9', NOW(), '20240325162556_add_user_is_platform_managed', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20240325162556_add_user_is_platform_managed');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT '02b68779-6779-4da0-824e-54c0c03a7f97', 'e23baf99809b2e7179869f5da64d2b34e0b31ff3118d6bb5387f715cc5fda97f', NOW(), '20240327121006_added_rating_workflow_template', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20240327121006_added_rating_workflow_template');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT 'fa10922c-ef80-4cf5-afe5-70a96d71cee4', '28164734d3c14ea0ea10a07b158b665109079028253e80d2651cd4431cccaf65', NOW(), '20240327130910_added_rating_feedback_and_noshowhost_for_booking', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20240327130910_added_rating_feedback_and_noshowhost_for_booking');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT '8755b6af-058e-49df-a604-4611103c969a', 'b024ef2703677c7820eed66bf4af2730083dab06ab9b1a9ab78c3fb193b8d959', NOW(), '20240327153218_adds_tasker_feature', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20240327153218_adds_tasker_feature');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT 'f29dd798-efb7-4b57-b6cb-13f3e7a3f7d8', '776284cc390740720698a1715e81a5f72572a44d2869d36a5da82fd62c81bc10', NOW(), '20240327165803_forward_parameters_on_success_redirect', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20240327165803_forward_parameters_on_success_redirect');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT 'cf0825bc-16cf-48a3-a322-2c9103c11a1f', 'c746e296da9f90b930961c0eaeb3d2690c40541929a9eed190e9981e2d96bb75', NOW(), '20240328080307_add_ai_phone_call_config', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20240328080307_add_ai_phone_call_config');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT 'f08f51ad-b625-4f2f-99b7-4c924138bb5b', 'cef3ea077c325db9635d699de5e93cf7f7003d5b3fb4dd72fa7b6ac92c4c0a21', NOW(), '20240329084749_platform_snake_case_to_pascal_case', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20240329084749_platform_snake_case_to_pascal_case');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT '4cd88e4a-0222-453a-9291-28181922f739', '93e1d812b1f7b0f438a7a22e1a198fc7f12811a77eb8a525b8332f6df2b5a544', NOW(), '20240401034329_add_admin_review_org', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20240401034329_add_admin_review_org');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT '09af6c51-bfd7-46a1-96b0-fdb0dc29a095', '8ae65ce196b67fd614c3e9198ad39fa9b559916ce42c5ef14e536cfbffafa4b1', NOW(), '20240404092234_add_guest_company_and_email', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20240404092234_add_guest_company_and_email');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT '878a9a18-22d1-42e5-b54b-d0dbe907db23', 'd35888a603132bce5688cfc3795fa05d712e2de1bf2e354e7b32fde2011dec17', NOW(), '20240405142908_make_guest_company_and_email_optional', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20240405142908_make_guest_company_and_email_optional');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT '59ba908c-6c3b-47ee-9b9c-faabb8d74091', 'b61f9426422015f6a85aa0276f981609994cba45c69235a119c0ea63aa7859fb', NOW(), '20240408155446_add_phone_number_in_attendee', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20240408155446_add_phone_number_in_attendee');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT '3975341b-e5cf-46fd-a627-d30904d975a9', 'fc7aacd6c77b50183c7bb3914b1c3615426eaba64fb87b354a2defaca1f5cde5', NOW(), '20240411114622_platform_urls_emails', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20240411114622_platform_urls_emails');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT '20c282e7-eb20-4030-ab24-21e24255d73f', 'a89cc4a6e06a618cb63a7e5a78a73582ebac7e09ae372bc37c1ba80b6cd69c5f', NOW(), '20240417175106_add_sms_lock_state', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20240417175106_add_sms_lock_state');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT '6c4d83bd-5770-49a3-a965-040c35c99d7d', 'c811a974423f25272f15f6d11de549016c06a04a2c10c41f261560ad9efc9d0f', NOW(), '20240419114622_add_ratings_to_insights', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20240419114622_add_ratings_to_insights');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT '48baa9e4-5ba0-4e5e-85f9-29cc902853f7', 'f3822f7de0f3573657145304fb0f7956eb7fbe9b13d8974fa7f1bb4e82c2f666', NOW(), '20240425121424_platform_billing', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20240425121424_platform_billing');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT '8238b48d-08b9-42c1-815f-d177d98bb4b3', '444a8f528aa73ab2e70f7b959014ab689d44fcbc423d56b28753aed2abe3f4e1', NOW(), '20240429100018_add_org_admin_no_slots_notification', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20240429100018_add_org_admin_no_slots_notification');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT '985c6e70-1861-46f3-88a6-0c20c3dc83bb', '299491ed525d779b7daeb3ba2fc7e80fc9c7e52d1149d005d9b22ea66162b3d7', NOW(), '20240502213807_add_webhook_scheduled_triggers_to_bookings', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20240502213807_add_webhook_scheduled_triggers_to_bookings');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT 'e0c7c0df-8e74-4f88-b0e2-aa1f918e8363', 'ad2c4dc709e00ac4f8940feec3b266ed0129257736d26936ede182d6f0b317bf', NOW(), '20240506065443_added_notifications_subscriptions_table', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20240506065443_added_notifications_subscriptions_table');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT '5b2fdc47-0ee8-4105-b987-1e076bc1b0ea', '5baf209213d007c4687fb84df357404348bee385c208b424036b02780e5979c2', NOW(), '20240506101739_add_rolling_window_period_type', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20240506101739_add_rolling_window_period_type');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT '37a1c393-b0a4-45ab-9cc9-2abfb7bfcdd7', '836d64055efea69586df812385de3f1f0a4a35e8ea2877ac1734d69d3b5d5e3e', NOW(), '20240508134359_add_retry_count_to_workflow_reminder', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20240508134359_add_retry_count_to_workflow_reminder');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT '78e0c8f8-64fe-40cd-9662-6605615c6f0c', '7ed9bb9599fd87b4fe71730ed85ffbdfa79fb486d86c1a2384a1f3481d298859', NOW(), '20240513101457_add_verified_emails', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20240513101457_add_verified_emails');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT '53e87810-8fbb-40e9-bb9c-3ecedee460d3', 'e5811e67d761624ef2a38ae349771305836129d7b01a3d918a629aee37be1f51', NOW(), '20240517144241_add_org_wide_workflows', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20240517144241_add_org_wide_workflows');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT 'd5e4efbb-7971-4736-82a6-4caa578d6457', '9f1544255e1c8c366c087664416cb6ecfb4e04cbdde357d01b15c7a57008ee07', NOW(), '20240531082824_add_meeting_attendee_no_show_column', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20240531082824_add_meeting_attendee_no_show_column');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT '45b604eb-0afa-46fc-a7ec-7d6e9dee94d0', '5d34da67730bd7131d2c828233b27828d3b1c06c72d598757bbf8d742eff9696', NOW(), '20240605135455_rescheduled_by_and_cancelled_by_for_bookings', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20240605135455_rescheduled_by_and_cancelled_by_for_bookings');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT '96c92c5b-a7a1-439c-b03d-f10315448318', 'c1ad71cd56050b0327760465229af5377d51a02e039b833fd18d5fabb73bb0e5', NOW(), '20240607082125_removal_of_logo_and_avatar', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20240607082125_removal_of_logo_and_avatar');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT 'df60c8ff-6919-4f61-ae41-b759ec88b875', '5ec5a2d81c8df845a5c907acd5e10455744b2f58431695e92531c5e6c345fc0d', NOW(), '20240610084425_add_cal_ai_template', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20240610084425_add_cal_ai_template');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT 'b6ececac-55f8-4123-b7c9-09c0f9ef0b67', '9ef31b4def73131050a0c5fb19a7dfca41f71cdcfd541044760f08bd09c88d55', NOW(), '20240611054408_add_ooo_created_as_webhook_enum', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20240611054408_add_ooo_created_as_webhook_enum');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT '2e8b6c17-7d63-4b6d-aec5-5e6f1fe0dfe4', '20cd0000c54aa5649ddd9c6f4114f6034b0bde1f73efa85a4b6eb24255e49153', NOW(), '20240619195146_add_booking_no_show_updated_webhook', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20240619195146_add_booking_no_show_updated_webhook');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT 'bf2e3b37-c6ec-4fd6-b211-eb441e1c6f85', 'a7100f14cadc1e61b1b867f4beabfc6935dd503be623198e6727befa3a393447', NOW(), '20240624195855_add_instant_meeting_expiry_offset', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20240624195855_add_instant_meeting_expiry_offset');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT '38dad856-7d5f-4ebf-901f-34bfdad23fbb', '6837ae6f78ad61e360a8ca2f16a117179f7c57ec3324f4919b57df96cbbd37ce', NOW(), '20240626171118_add_weights_to_host', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20240626171118_add_weights_to_host');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT '58a72302-08e2-4fef-8677-755e7e0b9d8a', '7dda340be293688f5e66025cdb3bf0f5c5569ba364b2349d516617acfbe37646', NOW(), '20240626191137_add_recording_transcription_ready_webhook', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20240626191137_add_recording_transcription_ready_webhook');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT 'ed36f80c-e502-470a-ac9b-041169952db1', '54e69885fa55ebd98f3febe912525dede7e59bda65e86145c91a83cd78190730', NOW(), '20240627170642_host_schedule', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20240627170642_host_schedule');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT '03192eac-0ed1-4a90-a969-b7f05c34bdbd', '05bce7d5d0d23fc86b16991d8a5f6781695a8c263809a403c8c8cc846cb02a5a', NOW(), '20240711080953_unique_username_in_org', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20240711080953_unique_username_in_org');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT 'b6f4e269-549a-48e2-b69d-7a0ed6d176b5', 'f91c5917dad9ccc31b2b8ebcaddf2dcf92c68fe2251157dae843c7ffa079b203', NOW(), '20240712162735_default_no_show_host_to_false', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20240712162735_default_no_show_host_to_false');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT '74961cb1-4e2d-4e75-9861-d33b7258b75e', '9ee034d77f528a1826c68122dc6140a77fb661d9e357457edd910cd639547138', NOW(), '20240722105401_add_is_admin_api_enabled_organization_setting', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20240722105401_add_is_admin_api_enabled_organization_setting');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT 'c7071810-66ff-4e28-92a8-311c2843a936', '59fcf67018b8832bf4fffe5f689c781cc0047aa9c0f3469ebfd98139fbd84f78', NOW(), '20240724124035_update_null_no_show_host_to_false', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20240724124035_update_null_no_show_host_to_false');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT '16da363f-eb09-4850-9d05-f78071b40515', '3bfecba1d655cf9d22cb085b74fccf7868b8f78f1737a79ee135494deb74cd5b', NOW(), '20240730122536_add_created_by_oauth_client_to_org_teams', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20240730122536_add_created_by_oauth_client_to_org_teams');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT '9f751288-614c-4d4c-b39a-b25ea601115e', 'cbb4f1633e6d7d515b9078e40a792ca7855d5e16076339ff33790cfe606139ea', NOW(), '20240730142744_delete_platform_team_when_oauth_client_deleted', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20240730142744_delete_platform_team_when_oauth_client_deleted');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT '8e6e8419-2ccd-44eb-bbaf-762f563cf68a', 'f9d8ccc2cdac0287ed6caee4df488592e56cfdca701dcddfef969626689f9e75', NOW(), '20240802053512_allow_rescheduling_with_same_round_robin_host', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20240802053512_allow_rescheduling_with_same_round_robin_host');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT 'dafa8bea-d8a0-4bf6-90eb-90ba969b7631', '28523acd764cba8728badbbdef959e1c1cd1ac1850b38f93df56616e9fb3a9a5', NOW(), '20240802124001_webhooks_oauth_client', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20240802124001_webhooks_oauth_client');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT '15753817-4a5d-48fc-ae1e-283e9dec7fa7', 'ada65cf89d0d93c0aaf7a95a651505d4f2baf801ef6b7db34e9d4c8b48a5dc15', NOW(), '20240804185106_add_sms_lock_reviewed_by_admin_flag_in_user_and_team_table', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20240804185106_add_sms_lock_reviewed_by_admin_flag_in_user_and_team_table');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT 'ab79310b-97f9-44d6-9d54-fa7a14d33eed', 'ee81f91745dd81d7f5605377fb022124a9d325b529a3e0068a2e0fe933fbf4bb', NOW(), '20240808084028_add_attribute_tables', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20240808084028_add_attribute_tables');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT 'fdb52854-1090-4898-a7ff-6d130396e02c', 'a6a8b36ce2b0e10324a5666cbdf9555a7fa6acc87ccef2c7bb2c613be6e46d1f', NOW(), '20240810164200_event_type_color', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20240810164200_event_type_color');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT '3f7dd523-8012-4124-8f3e-8176fe3716a7', '34fbf3ed14256ea445eef32f890095762be9d1f53c170baf1c6ff46595f4dfc1', NOW(), '20240813102151_add_allow_seo_indexing_and_org_profile_redirects_to_verified_domain_to_organization_settings_table', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20240813102151_add_allow_seo_indexing_and_org_profile_redirects_to_verified_domain_to_organization_settings_table');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT 'bf4d1e2d-79c4-4de2-98ae-c4d6cb61005b', '0a5b9346e365cf553fea6188211138f23c88b953922a4a35150d36d7524fa451', NOW(), '20240816083533_attribute_feature_flag', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20240816083533_attribute_feature_flag');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT '0528bcfb-f5b7-4628-9ba3-936bd9081bed', '61cc335027bd18d970fe6b5e64b61693629d4a55ebb28aa0aa783a11148a0e8a', NOW(), '20240816160101_support_multiple_hashed_links_for_an_event_type', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20240816160101_support_multiple_hashed_links_for_an_event_type');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT '3540bd7c-e748-4225-928b-fbe98de0c5fd', 'd8d1c4a03fed50ce78290fcaed6662cc965eda9a29bfb68ee8bde0453c47058e', NOW(), '20240823033245_booking_one_time_password', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20240823033245_booking_one_time_password');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT '9f18f1eb-e51f-4d6b-9728-30e166583b2b', '895518f998f878f052d806e982b541f82e4f9809207605788492c49a9bb2d7a0', NOW(), '20240823092832_add_requires_confirmation_will_block_slot', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20240823092832_add_requires_confirmation_will_block_slot');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT '1058bb20-cbca-4f74-90b4-c9626727a774', '736e9bf5e8746567a78c132460fdcc219b2351088eb5202ff7f94a233d689c03', NOW(), '20240830084943_add_instant_meeting_schedule', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20240830084943_add_instant_meeting_schedule');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT '6ca9c0a9-5ad5-4028-9c21-542ac21094b6', '2d79071cf53abd7ce0e58cfbb0fc3330143c697c562195d53e9f8d714c8e8721', NOW(), '20240909084221_add_referal_link_id', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20240909084221_add_referal_link_id');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT '5b949abc-f8b3-4576-a9da-20f98f2655ec', 'd6abcd76f3fb9689d3a8ab46855242aefa1d9e88f17534c21d7e6e9d407e4409', NOW(), '20240909162522_union_insights_data', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20240909162522_union_insights_data');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT 'eabe696e-dd16-4d49-8739-a6194bc8c947', '1d0a6bca91faf011337b4f7e54037aa0223946655882b44840c3ac0a0468515f', NOW(), '20240910195018_add_event_type_show_optimized_slots', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20240910195018_add_event_type_show_optimized_slots');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT '4ee71685-4db9-4155-bb81-54dcbeb97395', '3e93d71c97e732645e45e1f57b98d1e85b7395c81ad2e6f6dd0d7e2882ff5c0f', NOW(), '20240912150824_add_booking_limits_to_team', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20240912150824_add_booking_limits_to_team');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT 'a8b8a5e9-b163-4b99-9ae0-8b4a6bb703f5', '76eb3d51ae7073ddc0d424e37111d3b4f43a005057fd843f29641023b6e10f96', NOW(), '20240918202101_adds_per_user_and_team_feature_flags', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20240918202101_adds_per_user_and_team_feature_flags');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT 'cd979670-16e4-4b8b-bb11-5ef326c139d3', '37da12d5a78470b262684526123d0c80d2a0be474a8f144dbfb3bffda02465fe', NOW(), '20240920000000_adds_feature_flag_organizer_request_email_v2', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20240920000000_adds_feature_flag_organizer_request_email_v2');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT 'bdf05e0a-4200-4091-8f80-9cb221a89178', 'ea19ee79fa0e520cca686f9065b95b6050441cd306a9c7fe9dffb4a07d60399e', NOW(), '20240920100549_add_daily_no_show', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20240920100549_add_daily_no_show');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT 'f89e4881-fec5-4994-835d-9b1db3f1c884', '3829fd85941379b539186eb93b75738d49b762fe80b944f6bf22f3c0bfd4dffd', NOW(), '20240920192534_add_no_show_daily_webhook_trigger', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20240920192534_add_no_show_daily_webhook_trigger');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT '1025308c-aef4-42ac-ad62-37f8ba7c8ebd', '6669ffa7253a18cd2fe70078f650734f32e3de1f6168598a60f74512a4a28358', NOW(), '20240920195815_add_time_unit_in_webhooks', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20240920195815_add_time_unit_in_webhooks');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT 'cec2c66c-415f-40e0-b1be-9283309f5d52', '8c6a6a8583bf292ffcc36a9ac3e2df95d44b743dec2bb44c2a0da8201ee372ec', NOW(), '20240924112248_booking_reference_null_credential_on_delete', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20240924112248_booking_reference_null_credential_on_delete');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT 'bdd6a952-3be0-4524-8508-af3b15dd9145', '4ec6e83244c0e9a14c9ccce2309b4408f6561fb626d68d5d6cd90b57602f19fb', NOW(), '20240925153154_add_hide_calendar_event_details', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20240925153154_add_hide_calendar_event_details');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT '7780b8a1-1d74-458c-9f2d-6b7ab545dcd4', 'ab3a9aa19c4009c103c57fd8b0443e0928c93329c91710cb9a4c3f12b2ba12e0', NOW(), '20241001091544_add_api_key_rate_limit', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20241001091544_add_api_key_rate_limit');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT 'bb06eb08-e777-404f-9f24-f2714e89d46a', '3c9d10afd9601084a486f0caf0b1d8954443ee94e3c955b15058c467350525a7', NOW(), '20241003145122_add_include_managed_events_in_limits_to_teams', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20241003145122_add_include_managed_events_in_limits_to_teams');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT 'c48f9f48-bcba-4e43-b073-05d506cf271f', '49617e795d28a220476d341ff3c8c8fb7404e43e7f40f9cc6c892d541c2a8696', NOW(), '20241007134700_add_connection_bw_booking_and_routing_form_response', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20241007134700_add_connection_bw_booking_and_routing_form_response');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT 'a6875aaa-7662-4e9d-aa16-594450ce1acd', '67dcf88250da6c6d0413c478d04b54c29d921007711ddd2cf4c391cb582c406f', NOW(), '20241008124232_remove_attribute_value_unique', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20241008124232_remove_attribute_value_unique');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT '0f338ed8-21dd-4b77-8aed-b9a344561373', '05a54f3f09b67d27732ea009a0044afa432987dada97e49ef85f1ea9a61267c2', NOW(), '20241010070020_add_active', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20241010070020_add_active');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT '79fba6f7-50ae-4656-8244-930085cbf39e', '9e8c95266c9befbf41d8d416b082288b4059d2dff79f86762267dc8e04dce99d', NOW(), '20241010171846_add_eventtype_parent_id_index', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20241010171846_add_eventtype_parent_id_index');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT 'ea40b9ad-0c1b-4ba0-93f4-82510ba28559', '569d4d52a844e2f1ffb048793af0579a4a30ddb1f00a48d38fdc29a56beffaf0', NOW(), '20241014202509_add_form_submitted_no_event_webhook', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20241014202509_add_form_submitted_no_event_webhook');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT '5e195b16-6bf8-4755-bf38-a6c5eecfd773', 'a2af6bbaeead7244eb3879cec7276a77ed2a3211775cd461b6aeba2d5ce539da', NOW(), '202410181114246_add_membership_indices', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '202410181114246_add_membership_indices');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT '991a9ea8-e3df-4d0c-aaf2-80fcd0169d2b', 'a88c830651593ffc9e5d5fc045392759774e4c5cb233d5a538253580f11a3a96', NOW(), '20241018121846_add_credentials_invalid_index', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20241018121846_add_credentials_invalid_index');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT '79b6f14a-5e65-4284-972c-ec9afaae6c19', '508742154444653afb5d8ba42cfc46a62dc3cabebb4a95286d7f0877fd6c94ab', NOW(), '20241023041541_add_user_last_active_at', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20241023041541_add_user_last_active_at');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT 'a8d5bd28-c979-4186-91e1-beee8bb9d860', 'd8569728117c6657276ba807074daef2286e9cddff077ff4e207c43400a5d3f8', NOW(), '20241025143558_add_reassign_reason_to_booking', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20241025143558_add_reassign_reason_to_booking');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT '468ac4aa-358e-4cac-82ca-3b75f7ddfbea', '9eeeabaaf711e26c9f8e2bdf9292d5b6ebfe53efa6b8c637619d8bae111eac71', NOW(), '20241028103610_add_segment_related_assignment_columns_event_type', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20241028103610_add_segment_related_assignment_columns_event_type');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT 'dfb2f204-4fbd-49a3-96fb-99f0132708d5', '8060407ee70109a7a73f8d993a179667bb70dca64d6699467d381a7c8bd1fdbb', NOW(), '20241031084229_add_reassign_by_column_to_booking', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20241031084229_add_reassign_by_column_to_booking');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT 'd4e89789-87f9-49c9-98f6-febe8025eb4a', '20bc09c5109603c419a662316c966d81110beb5feacf2aaed43776a473a50727', NOW(), '20241101180315_add_created_at_to_host', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20241101180315_add_created_at_to_host');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT '720f6e0b-5a0a-4e3e-8295-e0a55995bbb8', 'd2303d5b9a71f93a4a79aa9dc3d91223e614a25304ee26c22bcb2fc5785f17ed', NOW(), '20241108222820_add_weights_to_attribute', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20241108222820_add_weights_to_attribute');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT '624b0f3b-6ea4-458c-8d96-136faeb3c0a5', 'af7e7bd8481f318228b9cee7b3568efc6e03b961d80a0f5aa6d2d1b8ffceaf53', NOW(), '20241114154333_add_max_lead_threshold', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20241114154333_add_max_lead_threshold');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT '07bfd959-cb47-44f8-9d54-7197708ac36c', 'a2da478e383b8ce6d506447e0435dc406ccc60808a59f2a66450090b28c8e61c', NOW(), '20241114174956_add_instant_meeting_parameters', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20241114174956_add_instant_meeting_parameters');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT 'd68fc2f8-4fe5-4af9-9129-9b8fac4c7b1a', '97e23941a52e1a60644d8e76c30f1364913b5382e5e7ee57cde537250582dc2c', NOW(), '20241114210330_add_event_type_translation_model', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20241114210330_add_event_type_translation_model');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT '2468a94d-d115-47e4-8fd1-611b32aa516d', '5c5c7fa8e0f9d376a6d2af6067d312b0f5883c36be1881cbcf5cbe883f3c5fb8', NOW(), '20241116180203_add_missing_profile_id_idx', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20241116180203_add_missing_profile_id_idx');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT '90742d2f-9280-4538-927c-ac20f72ca793', '8d6e8f440aec79e162a93b4045d041b9e19fa2f30073ee7eb0914430997de248', NOW(), '20241118085804_add_booking_seat_metadata', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20241118085804_add_booking_seat_metadata');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT 'b53c2040-f9a6-4b96-8842-c29db81a14c5', 'e35413f9942b8f4e104c864bd2be9c410f141776cbd2858978e5e379147bd9aa', NOW(), '20241119132536_add_source_locale_and_target_locale', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20241119132536_add_source_locale_and_target_locale');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT '146f9d38-a72d-497d-9277-ca011e49fe23', '5519e4fdf93fb1249928ed6204df2362c62ba80db1211c075929758cae543697', NOW(), '20241119185538_add_index_for_user_and_team_features', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20241119185538_add_index_for_user_and_team_features');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT '6a701c08-bae8-46ca-bae7-d818f0742511', '286f17ba1190af3ed38317dd644c9f6e1254025b88fe8a6a24e444504f1a1cbc', NOW(), '20241120161007_update_event_type_translation', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20241120161007_update_event_type_translation');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT '78ac8361-b758-4d5f-9a4c-eba1d5fc4c62', '25d856e1292d023038c45b1489ec48b588347e1e5840d7fc8999473d9fc6dc41', NOW(), '20241121043631_add_assignment_reason_table', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20241121043631_add_assignment_reason_table');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT 'a2eb2795-9b11-4e0c-8362-ea5227d72f0f', '4eb0b64b7e929e88ca28124f3fc5d858cb59d2e39d665ba58fcde4058ba0e8a0', NOW(), '20241122050747_add_title_to_event_type_auto_translated_field', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20241122050747_add_title_to_event_type_auto_translated_field');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT '51e8503b-196c-42fd-889d-25b3532b4830', '1f45499a602812ee460c56cf85282243bd2743d1a74173989301b8c627dca1ed', NOW(), '20241126132214_scim_attributes_sync_related_attrs_added', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20241126132214_scim_attributes_sync_related_attrs_added');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT '6e7ec632-c916-4ab1-b944-3beb30cb1f15', '3a77e0d452e80877cc6b3515c914219bfbbc8ddf9b5b9772d088bc099bb2ef43', NOW(), '20241127102756_remove_fields_from_evenet_type_translation', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20241127102756_remove_fields_from_evenet_type_translation');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT 'c799d95d-3e29-40bd-892b-e3021d13f250', 'e6d9c78c11be46280d0ff50f12686077348428e0ed53cdadd72a4ce29cfa9238', NOW(), '20241129194340_add_requires_confirmation_for_free_email_to_eventtype', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20241129194340_add_requires_confirmation_for_free_email_to_eventtype');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT 'eee7ead8-8ee5-4365-b857-e798305995b2', '26565ad3f506c5be48904c50836685c5bd9fc335da511b77e0bacc4128e49e30', NOW(), '20241202182411_add_watchlist', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20241202182411_add_watchlist');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT '14f7dff2-be05-4555-9d2e-156d85c05104', '4502cb45d9e5de358bc5bbbe4490f7f285ee71c7cea9d0559a2ac483cc96eff5', NOW(), '20241203184322_add_watchlist_severity', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20241203184322_add_watchlist_severity');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT '434881dc-49c0-4c0e-a444-5593e4c0ac4f', '4e565201272bac2c36a1042a7873e8d027ac308139f64d142c92c8042d570b02', NOW(), '20241205095738_add_feature_flag_domain_wide_delegation', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20241205095738_add_feature_flag_domain_wide_delegation');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT '2c9160a5-1c18-4a1f-b1f6-4f4210d5e259', 'c04e30e9f86cba453e3734ce74498904c0e0b0193b63aa46e130efefbf74777d', NOW(), '20241206131352_add_dwd', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20241206131352_add_dwd');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT '45fd3ed0-f1af-4106-b195-a0fa3595fb80', '0e89fce565041c7cc9b58335ab49f32c35de79be8f0cc9d92c2ad584bba3afee', NOW(), '20241212164338_create_routing_form_response', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20241212164338_create_routing_form_response');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT 'c5ea88c5-bfab-4f2d-9779-b58cfd91d238', 'fc14cc2c7bf9765de0d51d0218b7f4cd18e16363d464e69f3639d82f21c7408e', NOW(), '20241216000000_add_calendar_cache_serve', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20241216000000_add_calendar_cache_serve');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT 'd607d31a-23db-4e2e-9e73-272d326ea49b', '6d68c69b4c47b8db3a0d26b63ac2880ab1f43418d81d0849f24b730cddaed6d4', NOW(), '20241218125130_add_optional_uuid_two_step_primary_key', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20241218125130_add_optional_uuid_two_step_primary_key');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT 'e3441ef6-964a-49f4-a0a4-d3e6c2b0af42', '0b10415341e9eae08355fb1acf172a405f3adac8d403cdeb0bd73f6fa711262c', NOW(), '20241218143848_add_event_to_selected_calendar_make_id_required', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20241218143848_add_event_to_selected_calendar_make_id_required');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT 'dbcbce59-a03a-41bb-bc6f-79cce7130662', '4b01ac965181de84a6ba93ef9d6fb5f31d6ecdb8a51fb64e5c88a89898bb3f97', NOW(), '20241218164539_add_selected_calendar_error', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20241218164539_add_selected_calendar_error');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT '2032402d-aedd-4f79-9d15-ad477818da25', '5de9b529d8582ed500233f634408f844f0066c473a99a0d991334eba20d89c06', NOW(), '20241223163249_allow_rescheduling_past_booking_setting', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20241223163249_allow_rescheduling_past_booking_setting');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT 'a203c6f9-82f2-427e-80f9-9d402e87f63e', 'c6545c208366e792dd49745093ca1caeb6c9fb2e303ff1837d41b1e3fe9d4db0', NOW(), '20241224023424_add_index_team_id_on_attribute', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20241224023424_add_index_team_id_on_attribute');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT 'd67d7e57-33a6-49ec-8c5d-d7c76c0e4516', 'a0b6402bf430204c945bc20c0faf1cffe8b76cbc13ea2c3b479e57132b6955bc', NOW(), '20241230140747531_add_salesforce_crm_tasker', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20241230140747531_add_salesforce_crm_tasker');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT '4fc6e30d-9394-42cb-bd51-b442688cbc0d', 'd01512f8b6e55b86db2fffc216d14118b886390242e42f6d37ba930fdccd0dcb', NOW(), '20250101000000_add_calendar_cache_and_sync_fields', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20250101000000_add_calendar_cache_and_sync_fields');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT 'afbdb22c-2c62-4470-9b50-d3c44cc60695', '3966119f8ffb70562d1802679138930ea2d7dccd44848d52d92f9fa244de4660', NOW(), '20250108095727_assignment_reason_index', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20250108095727_assignment_reason_index');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT 'b427ae0c-66e8-43a9-b886-502a1345cce3', '3d3751382d12eda6007e2af63ca6d9aaba6c099de234a66454cda4eb11d9d342', NOW(), '20250109145213_update_routing_form_response', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20250109145213_update_routing_form_response');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT '3814edf4-2eee-486f-b3de-67bc37ea6acd', 'f4277136789f313a5829adbdb24eaae62daa5c48947fd670ba75666bd7f7d1b8', NOW(), '20250109161330_update_routing_form_response', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20250109161330_update_routing_form_response');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT '19514d45-a64a-4992-85da-6537ff1ae36d', '0d7fb3b6637053ab89777d658aaa4a5493c9748994dd98860a5dd7693bc6e63f', NOW(), '20250113170733_add_routingforms_incompletebooking_action_table', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20250113170733_add_routingforms_incompletebooking_action_table');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT 'b159c9e2-9665-499b-97c8-c064d8561662', '6727ca97c1d002bf84089e30822c653a7a287aa8d5a5e6d8bfdb79462ecb6220', NOW(), '20250117091620_event_type_add_interface_language', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20250117091620_event_type_add_interface_language');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT 'b533a153-4a45-449a-847f-d518eefb1b8d', 'bfffdc71cc075d90be87e0f88c12dace0e85131a63b8bd95ac0ad8be15e883e7', NOW(), '20250120135752_add_creation_source_for_bookings_and_users', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20250120135752_add_creation_source_for_bookings_and_users');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT '56450bf1-760d-420d-95be-85464d53adb8', 'f478ff15caf436ddac0b7adc09b1a00bbdf380fa2b1dc7a37a143769764e8485', NOW(), '20250122083420_create_internal_notes_tables', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20250122083420_create_internal_notes_tables');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT '73fd9394-6ca4-4632-aab9-100d588a385b', 'ee1658283d9cbaeb9190232d8b65f748303f08b64e102b2b06765faa5aa4f157', NOW(), '20250123170615_add_workflowstep_safe', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20250123170615_add_workflowstep_safe');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT 'ecb37a31-de0f-4c10-8c8b-9dad0b79e566', 'b7710e743789e1b76ab154049122b87a869d48120c0aaa1c7a7f4bd3e6d982db', NOW(), '20250203180603_add_can_send_transcription_email', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20250203180603_add_can_send_transcription_email');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT 'efe88a31-37b7-48de-8245-a37179bdc448', '2ae05a7ea4621fa843537102f7cc6427e280bc1b142b885013ba46e9b1ee64a3', NOW(), '20250204105304_add_updated_by_to_routing_form', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20250204105304_add_updated_by_to_routing_form');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT '361f6395-5841-460f-8bf7-3616a9eadb56', 'ca677f18e6c045a25c6270913b45c887257fe25acc72f73ca3b72916ec4ceff5', NOW(), '20250209012421_add_rr_reassign_reason', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20250209012421_add_rr_reassign_reason');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT 'a99214cd-684e-4197-9648-c58799f787e6', '3f5f39702bbfe3efb98eec8e91e7c7db14e56aac34610330cfc6376fc78eeba3', NOW(), '20250210114958_add_default_event_types_enabled_to_platform_oauth_client', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20250210114958_add_default_event_types_enabled_to_platform_oauth_client');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT 'b3718871-8fba-4b9d-94da-04b6437794fd', '5b2e7f13380523241f5cc36ee88e49cbc6343bb4159da980cbc636074e940863', NOW(), '20250213092458_allow_non_unique_platform_billing_customer_id', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20250213092458_allow_non_unique_platform_billing_customer_id');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT '3ab6fbd2-c369-4825-8562-534b0730e949', '3707e18351f0c09aa02543e88fa5e61568a9515e665d148689c8d3001ebb0532', NOW(), '20250213092715_add_platform_billing_managed_organizations_fields', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20250213092715_add_platform_billing_managed_organizations_fields');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT 'ab958212-c873-402c-87ea-35b9c64d074c', '4911896d39b0deef010667e60babc97a65de22562de983444ef3fbb664d8ce2c', NOW(), '20250213093931_create_managed_organization_table', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20250213093931_create_managed_organization_table');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT 'a1fc15c1-bb85-497d-aa8c-89f3081179b2', '9d1afc3df9ac427e97e420361a0fb03826431d88438997a2bbafce6bc8e01b7b', NOW(), '20250213144302_add_managed_organizations_unique_constraint', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20250213144302_add_managed_organizations_unique_constraint');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT '2b65a805-c7ae-41b6-b8a8-a2de5ea02c81', 'c8593f5a00f8382bb7a25fe6087411be2a136af282a63fe1b697bf2a2302f32b', NOW(), '20250218111500_add_org_onboarding', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20250218111500_add_org_onboarding');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT '0890f054-7632-4143-b2c4-a691105fbce9', 'c0d7f093bc9f44c8e23b4c6a5e4d8c04e92112f0a2894157b817dc2010c3a959', NOW(), '20250221140631_add_rr_reset_interval_to_team', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20250221140631_add_rr_reset_interval_to_team');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT '0014b92c-b1af-4c91-8438-0f845c01a5be', '1393b1eb3c05fa6930ca3ad54d6d16bd9c30fc182fe3f4237d4f1d8ce42e88ee', NOW(), '20250226133600_add_last_failed_attempt_to_task', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20250226133600_add_last_failed_attempt_to_task');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT '06810af2-a67e-4e2c-9ee9-42ea5a08d461', '1dac0460bb15c529fe3f7795bc37f9cf23509dc1117780c678b1527a1b61e04a', NOW(), '20250305114246_delegation_credentials_schema', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20250305114246_delegation_credentials_schema');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT '712d2858-054f-4aae-abe9-08cd49603a84', 'a6b51ff3c71be05f79c96098737b7676ef4ba91cd0af130d3bea9c0be2a2cd53', NOW(), '20250311134135_add_tracking_to_booking', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20250311134135_add_tracking_to_booking');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT '81ffa8a3-c0df-456b-9585-3b8f152cd9b1', '1b9a563eeafc4a01348dcaaa9882f59e06aa93de0c446051d86461dcaf67ea0e', NOW(), '20250312140531_add_filter_segment', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20250312140531_add_filter_segment');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT '86df42c8-8c7a-4f20-894a-7491e6d25feb', '9429e60dea6e7562135c8114b7e977248b8621d3a9a703a60891d992682aee87', NOW(), '20250313110448_update_routing_form_response', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20250313110448_update_routing_form_response');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT '27e9e4f6-665b-49aa-aabf-26581281a717', '16e515bbb09666d7cb49b0c4a6c191e13dcb9b512e17fde3e8787f41244b317e', NOW(), '20250324051542_add_hide_team_profile_link_in_team', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20250324051542_add_hide_team_profile_link_in_team');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT 'ecb0161b-ae68-418a-8aaf-a6263010eb77', 'c9bdf9d115e030cd447736fbc6537038593e8e84b72d28af6e0c2b989b762c2c', NOW(), '20250331140235_add_reference_uid_to_task', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20250331140235_add_reference_uid_to_task');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT '260c1453-5af1-4aee-b1d5-a279458aef03', '5afa5fdda2bd043225b7c98e0e57ffc82ebf36bd51589eaf6fe09309c9b1eca5', NOW(), '20250331185500_adding_disable_cancellation_and_disable_rescheduling', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20250331185500_adding_disable_cancellation_and_disable_rescheduling');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT 'f86ae112-e6d9-4d9c-a4e8-febc31370343', '3e234b622d39466e142328f266fd524ba72074b5d3ddf2a1f28197165486ace1', NOW(), '20250401191319_', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20250401191319_');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT '254eff75-77ac-4dac-baac-2a82714d4cd9', '20cc7c42bfc477d3c4781e0a9788efbfeaa8dd47922a62d177ca5bb5d2e81d8f', NOW(), '20250403094343_add_search_term_to_filter_segment', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20250403094343_add_search_term_to_filter_segment');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT '2eb16909-5c69-4bc0-819d-6ff63abb14ff', 'fecb2929c7f4c546529c5940319d13c5fda6e801c94d85bfe96fa7e755dcdfa8', NOW(), '20250407034337_add_id_field_calendar_cache', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20250407034337_add_id_field_calendar_cache');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT 'f0e28873-bc15-45c7-b151-fcb8efb03b8b', 'e5deff57be244c9cf6fba1526b6e8e2df9cad0501d15b9a9c173977dcbf2a3e2', NOW(), '20250407204810_add_membership_creation_date', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20250407204810_add_membership_creation_date');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT 'd2ce5117-c985-44d6-8133-8b16409530ec', '84426639f0b97a4cf6df866ca739aa5c9c6576767bc756c41a5b6dbda95802cc', NOW(), '20250409135411_updated_at_routing_form_response', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20250409135411_updated_at_routing_form_response');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT '1f0efc00-0aab-4b45-b16c-b91d30f28b0c', '70251da880bc7b39a3596d8908e765cf6817b333e0b0d846873bd4cb2d7be5e9', NOW(), '20250413115818_add_azure', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20250413115818_add_azure');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT '0b0a510b-a720-474f-acc2-8a9a62574a08', 'a92338a3e7582c6da8d5f969410f70ff2e71747d1ece0c031765dc764387b72d', NOW(), '20250415173346_add_whitelist_workflows_to_user', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20250415173346_add_whitelist_workflows_to_user');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT 'd2808406-f669-405d-9490-89f5301c172e', '367e2a8ac0146ee809011b46d9bc82f0115a2fa7d3807a53faee240b931db387', NOW(), '20250417131239_add_workflowoptoutcontact_table', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20250417131239_add_workflowoptoutcontact_table');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT '8fa8d906-47fb-47b6-8af6-ecaef2bf68b2', 'cf59760687d694eec6bd25d93ca85c021b382cb8a73eccdfc3475ea4fd876570', NOW(), '20250418155253_custom_reply_to_email', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20250418155253_custom_reply_to_email');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT '3c7e18d0-6452-4c29-9c6f-466fa0f39778', '6ed6e4d6ecf02d80edd1a8b7a960bdb1d260731e30c9cfb33ac193a4f79e00e9', NOW(), '20250419103412_delegation_credential_calendar_cache', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20250419103412_delegation_credential_calendar_cache');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT 'f54e2afb-e435-42d3-9ba7-fc2155f36894', 'edd1daf2ed29361bf5adcc5b6e03f3a9ae644472e74d685ac00b86143ba55e73', NOW(), '20250420171801_hide_organizer_email', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20250420171801_hide_organizer_email');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT 'c77231c0-b0b7-40db-b6ee-0ad8bc654e7e', '912a7366e85a2198f82ddbdd9fa3d204456ee895beb2ac8345fabc7263d51466', NOW(), '20250425220800_add_selected_calendar_credential_id_index', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20250425220800_add_selected_calendar_credential_id_index');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT '881a4d05-abdc-40d6-8b3c-ac7a973c011f', '4d546a5543e2c8a560239fca7f50114628f6285750fd64ba63ee3673efa3116c', NOW(), '20250430031041_add_include_no_show_in_rr_calculation', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20250430031041_add_include_no_show_in_rr_calculation');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT '5670c353-24b5-4d37-8064-f578e5fbb832', '0a706c070d79ee6ed0a8d8745c0c17ab2ec6e1f6f5bc88d91fee4b56da5ac0dc', NOW(), '20250430084050_disable_org_phone_only_sms', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20250430084050_disable_org_phone_only_sms');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT '3dc389f5-1f24-4ae5-8c29-0072752aacc4', '2735fb5ed10137829f1229a85d046856019a05d2619cdffbb777075a56eb43e1', NOW(), '20250502113653_create_denormalized_tables_for_routing_form_response', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20250502113653_create_denormalized_tables_for_routing_form_response');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT '1affd5a0-3a05-422b-9bf9-8209be2c7334', 'fb2e8b595b85daba3bac8c018b2107c6006289bb6408eb7c2727e436da9e094b', NOW(), '20250502113828_setup_triggers_for_routing_form_response_denormalized', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20250502113828_setup_triggers_for_routing_form_response_denormalized');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT 'e9b496b4-09d4-4524-8190-c8291e2f52da', '3badc0e74d72033c2228f72df8b588e31bf9fdec72c434addab151aa67af5ee1', NOW(), '20250502114245_setup_triggers_for_routing_form_response_field', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20250502114245_setup_triggers_for_routing_form_response_field');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT '7dcb56ff-b112-4013-bd34-b33c2b21ded2', '5a6f79bf846ab78c63fee1d560a250fc7eb52f9c11f3967bf002baac5d7de189', NOW(), '20250502130807_create_booking_denormalized', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20250502130807_create_booking_denormalized');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT '50877600-5988-4c7f-b778-567238cadeac', 'c65e45b89befe0cf69b60434fac9bf97b447c0525494d0f9045fd80804ed9391', NOW(), '20250502130843_setup_triggers_for_booking_denormalized', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20250502130843_setup_triggers_for_booking_denormalized');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT '974308f5-b43e-4697-95c1-3d8817a982b0', 'f7635165f57958ab1c989621eef7fabc996238c7311d5dd1e905131291de7de4', NOW(), '20250502154530900_add_login_overlay', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20250502154530900_add_login_overlay');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT 'b3da6fde-43b1-4b00-9973-7361e4224cc5', 'dc6ac1ae44dfd997fe0e81af44104a648bbc533975d4833fb05b1e8e5bafa5de', NOW(), '20250505135207_create_booking_time_status_denormalized', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20250505135207_create_booking_time_status_denormalized');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT 'ae88316c-951f-4cdb-a78f-fb80df6f12d3', 'd63c68116ae48692417dc82fd9e69badabd57d5c3ce94498fa6fc41ff0025f9c', NOW(), '20250506000000_remove_around_from_event_types', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20250506000000_remove_around_from_event_types');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT '1ad2339c-2dd2-4607-ae89-fac2db87ffd6', 'd772d54c6d17c447bb60ecb0ec7545ed5e508b979a33b29372d3972131c1a853', NOW(), '20250506000001_remove_around_credentials', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20250506000001_remove_around_credentials');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT 'f397c464-5756-4a4e-b0c4-075e0160a727', 'be1fcfadf841a2df426af6146f3524a81a9d9b654c6de4baa4f237bf6e8c7d0c', NOW(), '20250506000002_remove_around_app', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20250506000002_remove_around_app');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT '40fe8898-4a39-4296-96b5-73e2ed346c97', '501d48e3c268663fbc5bd11dde867dea2c7ec51efa964eb46e21ec3d52750302', NOW(), '20250506113723_add_credit_balance', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20250506113723_add_credit_balance');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT '7eff1cb8-66a6-43fb-85e0-e4040ed96691', '1c51b402acaf78464dd2fae726d5814a1bcb9b23f794141e2e92eb528cfefd6e', NOW(), '20250508131736_add_workflow_smtp_feature_flag', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20250508131736_add_workflow_smtp_feature_flag');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT 'ece36f46-2db0-4e59-baca-d5cadbe6fe36', '5bdb528fb5e4da840cb94f9247b53740a90e91f1367bbc3e37d6a27c97cdbf08', NOW(), '20250512153630_add_use_api_v2_for_team_slots_feature_flag', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20250512153630_add_use_api_v2_for_team_slots_feature_flag');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT '284ef7e2-65d9-4cbd-959a-284991a9e86d', 'bd907daa934bd00c57d1b7b5c28253a0e4dfe9b3cb3c47aca1dea289c6b85b11', NOW(), '20250512205531_upgrade_prisma_to_6_7_0', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20250512205531_upgrade_prisma_to_6_7_0');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT '5a3a9a12-0e25-42e4-8a14-2594628a85d0', 'b79120b849303d83613d36d84e3a8af08b09ede7887790ea8395b4f993e3e8f3', NOW(), '20250519083756_missing_migration_routing_form_response_denormalized', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20250519083756_missing_migration_routing_form_response_denormalized');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT '03a06f7d-4521-48f1-9470-e3fcce53c832', '0f3c4873781f516f76d59e67e52d991d57a8623cd3bb2c96befc070209ffb6af', NOW(), '20250519090442_add_schedule_restrictions', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20250519090442_add_schedule_restrictions');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT 'c76dd3c9-8acb-45f7-8523-21ffb2c27314', '090d7b758c94cffc9d2ca0c3cd7e83fc50a561746762ee925dfdf116235e932c', NOW(), '20250520071309_add_pbac_tables', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20250520071309_add_pbac_tables');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT '53aa3ce4-f459-450a-8634-7c43ca1db4fb', 'fa232707d1a0e0fe5d87cdc07106520f3e3d6f8e424d5d32022718ffe1783a34', NOW(), '20250520072457_add_more_error_tracking_fields_selected_calendar', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20250520072457_add_more_error_tracking_fields_selected_calendar');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT '1ec65f99-ead4-4b8a-86df-d36ea862156c', '1132cbc7aee2f19d4434c802306894aed3d37313dc6774770505cc9fa4ad17c3', NOW(), '20250520103718_add_last_enabled_at_disabled_at_to_delegation_credential', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20250520103718_add_last_enabled_at_disabled_at_to_delegation_credential');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT '2180ebab-237c-4cae-9d44-405d8d0f2691', '61b51ae58b100ec20b1d7806623d1e7b9a4882d38beee92a287f30f3d07effa2', NOW(), '20250520103801_add_missing_default_now_to_created_at_membership', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20250520103801_add_missing_default_now_to_created_at_membership');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT '71683cf8-0089-4f40-a797-9ab3be052552', 'cc382e59cc6083705089db77d26edc8d713298981dcb00d87bac19e26f26faf2', NOW(), '20250520143014_booking_denormalized_backfill', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20250520143014_booking_denormalized_backfill');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT 'f61c766f-7ae8-482f-975b-d622641bcd87', '4e3b764a3921d784e2a2b20287195c7911f78651e969e49235a0bf7887503208', NOW(), '20250521070158_add_pbac_feature_flags', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20250521070158_add_pbac_feature_flags');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT '8aadc7bc-98b3-4436-ba3e-502f8872d08d', '402a5289cdf2bf9fe4d606a6a114438a70363acbeb6f23f4dd1ff94a4639eeff', NOW(), '20250522083627_update_memberships_to_new_roles', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20250522083627_update_memberships_to_new_roles');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT '60d786d0-6ae8-491b-a88f-7ee7a87e5327', '2f7c94f5f3c2b6254900a6dc7aad5fd6cc13b55f79671751c894fab175f46d3e', NOW(), '20250523155738_add_cal_video_settings', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20250523155738_add_cal_video_settings');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT 'b09c3471-affd-40d0-8f2d-84553be61e9b', '045b3e4f3198edbd5cfe3900581eae27adffdeb4bf37d395f243377868cf984e', NOW(), '20250525034030_add_index_credential_delegation_credential_id', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20250525034030_add_index_credential_delegation_credential_id');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT 'd31935f6-b9e7-4c1a-b14d-5a0e56195b92', '0c2b06b92b6f954f090d28c2bc752c791945c8ef69a4ba08ceb648ae9a956e38', NOW(), '20250526143547_create_user_filter_segment_preference', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20250526143547_create_user_filter_segment_preference');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT '6716d38f-2c38-487b-8b93-e286114371bf', '8a7ac6170f1bf87be1d7bf1b486c7d1bfe7cedc291d42fa62905bebfb8dd5720', NOW(), '20250527091330_add_color_to_pbac_role', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20250527091330_add_color_to_pbac_role');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT 'e4adc16e-bcd6-43b6-b841-0f23af08da11', 'b88333fa9db2d84f3162b4a0cc5559437acef89de3debc5d3579741efccdaf3d', NOW(), '20250527092133_add_rr_timestamp_basis_to_team', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20250527092133_add_rr_timestamp_basis_to_team');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT '7dc12cde-f76d-492a-8343-1e4db171a8e3', '9f45ab6730a83478d928df1c906552c954dce5e10f3b7344279665374505a1b6', NOW(), '20250528061149_add_transcription_setting', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20250528061149_add_transcription_setting');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT '2630a6a6-2070-4299-9915-58689f597fb6', '92b7bff30deceb5d948d87c3806644603ef8fc8b9af9e6055362ce9017a25e39', NOW(), '20250529130535_add_index_restriction_schedule_id', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20250529130535_add_index_restriction_schedule_id');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT '692b8fa9-007d-4b00-b1c1-ca82afe10ac0', 'bd09df339bcb6f90696ea271d7e1ce343a7d9d2165614553fb1745e3a846c565', NOW(), '20250605102526_add_allow_reschedule_of_cancelled_column', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20250605102526_add_allow_reschedule_of_cancelled_column');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT '6b284329-a25c-49b4-a10f-842a058e8c3b', 'f17774983b531fd06f234befe4fc619ba4e93ea705009c5fd4fe075e5bb6208b', NOW(), '20250609132708_added_bookerbookinglimit', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20250609132708_added_bookerbookinglimit');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT '6ed05408-fe2d-40c0-a955-b98c6f84df63', '4e8329c078509d9cc94b005a8c5495e01e10f073bb787228b3d5a03cfd207a8d', NOW(), '20250610135051_add_transcription_cal_video_setting', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20250610135051_add_transcription_cal_video_setting');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT 'a5f3b9bc-e604-437d-8719-b47b211d18fa', 'eb1fbd20e87fc963a7de6cd5ed7f8719dc214ae7bb1f1f475e0dc8abd92a1cad', NOW(), '20250611095054_add_are_calendar_events_enabled_for_oauth_client', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20250611095054_add_are_calendar_events_enabled_for_oauth_client');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT 'c92bfc1f-6f59-4875-859d-ab0b498bd4ff', '7dd66b9be5b6a45bf3609c8bf4fe1f7d7dd30883a1e7b8f868923ffec5fcc522', NOW(), '20250611112835_add_credit_purchase_log', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20250611112835_add_credit_purchase_log');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT '409c0c14-f267-4fba-80b5-34f097bfa0c5', '05bb30df1e20830c08773579b7ce041d9401bccb9ec48d2d7409c62c295cb66a', NOW(), '20250611123345_add_sms_segments_to_credit_expense_log', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20250611123345_add_sms_segments_to_credit_expense_log');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT 'ddf98c52-57b1-4299-8cc4-6d0d42416b92', 'f43940f4e2a6bb8c4da2d6e7599523c90fa66492d3d9a8ff24e5d635ae3df250', NOW(), '20250612210429_remove_profile_cascade_delete_on_eventtype', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20250612210429_remove_profile_cascade_delete_on_eventtype');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT '48e0b8be-1add-482b-97bd-e2df6a370840', 'c9289f7266bf6a4959f54f7f7c730f1c0ccddc82047cbaf86db7b0968092960c', NOW(), '20250613224705_max_booker_booking_limit_offer_reschedule', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20250613224705_max_booker_booking_limit_offer_reschedule');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT '958f2ed7-8ee2-4829-a6a3-5618a2ea1962', 'd841814d35c91a57a0b45105791ecf3d7448e3a8201db653d7fc070fc4513118', NOW(), '20250617060130_add_queued_response_table', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20250617060130_add_queued_response_table');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT '5b94ac80-9c6c-4546-88e6-c5de3d85a837', '1c8fafcfc7074895ab90c7c358dc7edf90a15f124a32e6abe794a9226739e6d3', NOW(), '20250617070118_update_memberships_one_time', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20250617070118_update_memberships_one_time');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT '7459f459-030a-45ef-91ad-bf50e56bc3a9', '8b0cdf06590478df6b74dada11fb718db2196be0d7f22125cd2ff90ff2661dce', NOW(), '20250617092501_add_automatic_recording', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20250617092501_add_automatic_recording');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT 'f66e608f-d669-4301-ad7e-74c7c9edc45c', 'b91831091d25dfe6b38f5b4f1dca5729d5416a4c3e555585268c90c1f2ba1d8a', NOW(), '20250617123959_update_handle_routing_form_response_fields', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20250617123959_update_handle_routing_form_response_fields');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT 'a163cdd7-9fd8-4901-b8cb-cd40c230a68b', '349a37109b0f9abe4002e77b2e27883b3de4ea87985d166d45a9917ca9819629', NOW(), '20250618093846_routing_form_response_denormalize_backfill', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20250618093846_routing_form_response_denormalize_backfill');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT '044b0b47-24ce-4ce7-9774-d07f6e5ee102', 'f0d6a6b1cc62ac888357c79a0ff1ba6d3d28e372d08edae407f1861bdafe4950', NOW(), '20250618093923_routing_form_response_field_backfill', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20250618093923_routing_form_response_field_backfill');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT 'f95b3fa8-9a95-4a15-8a16-afe82d135c17', 'f71beb10fd63736a384aa199eb7c34018282566e8053c9ab79018b300829b637', NOW(), '20250618151833_add_uuid_to_app_routingforms_formresponse', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20250618151833_add_uuid_to_app_routingforms_formresponse');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT 'fc5672ae-f4f2-4574-8594-1dc04dca3c1d', '9756a01d920a810aadd70586fd86b162d61451ca1deb2670a408081b0e746912', NOW(), '20250626092518_app_routing_forms_form_response_uuid_nullable', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20250626092518_app_routing_forms_form_response_uuid_nullable');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT '8d526642-dd4e-45ff-861f-3e07041165ce', '2ce40e3ab5cab4bfedaa08d26dd89866b1bc466812bbe0a2534d255bedafe6dc', NOW(), '20250627091352_add_signature_token_to_deployment', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20250627091352_add_signature_token_to_deployment');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT 'fa689d96-9343-488b-97f0-91d1cadeee52', '4f1fbc8fe0e8ceb0e046f03a5aae7262440a8419da4ca2dcc0d91eb2cbc2e03d', NOW(), '20250627195833_add_date_fields_to_calendar_records', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20250627195833_add_date_fields_to_calendar_records');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT '63c93378-58a8-46b6-9c88-ac227e833528', 'd800861c8d01e47b1482042b43606ec18590af8d71eb3e8761d17136ccb5e993', NOW(), '20250704081718_add_host_groups', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20250704081718_add_host_groups');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT '463924fe-c961-4c62-9175-e9bcaa5ee638', '7943a9d2313f6a3ada5ccab1d892a485dd070d7d2a1f6ef2e8ec698b3328bfb4', NOW(), '20250707145503_add_private_links_expiration_capability', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20250707145503_add_private_links_expiration_capability');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT 'f97e4e39-b06e-4fbf-867a-6fd8048f9095', 'c0abbb41ebe0f4010f783a92d21e811a72642d8a6bdd3a7d109053aa4f967a2d', NOW(), '20250709150348_attributes_unique_on_slug_team_id', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20250709150348_attributes_unique_on_slug_team_id');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT 'cb8a8656-7460-4e05-bd3f-fcbd0b226f64', 'bccb117d3cb1a2a0590c5d741daa5705136a8f14d57691d498ea2e54784374b1', NOW(), '20250710172011_add_indexes_and_uniq_index_to_task_table', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20250710172011_add_indexes_and_uniq_index_to_task_table');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT '32e0b18d-09b5-45f9-8630-64e591639563', '66d7583100662402c1fa9cd55bd622b95ffcc0f6aff4e27bb07c8712449f8aed', NOW(), '20250711154030_setup_triggers_for_routing_form_response_denormalized_2', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20250711154030_setup_triggers_for_routing_form_response_denormalized_2');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT '86b1146a-6add-42a9-b21f-dc5b97bb1723', '4bba3bb77368a15b8b6ce042a48849c14518e958b2e34eeecd5a58bb3c25edbd', NOW(), '20250714075355_add_attributes_pbac_permissions', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20250714075355_add_attributes_pbac_permissions');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT '375d5d2f-7c3a-4ee2-911c-74a33f859ec1', '4231c72ace2585d11554ecdf48d026f66b31476ca042c827a2c3943ec93838d8', NOW(), '20250715154531_event_locked_timezone', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20250715154531_event_locked_timezone');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT 'debb8132-5776-46ac-b7e8-f3ac42ce0d85', '49cd6f39b0ddb9bb5e3840c4e87ebac2dd20dc3bab0f32a9eee98d8827cf4438', NOW(), '20250715160635_add_calendar_cache_updated_at', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20250715160635_add_calendar_cache_updated_at');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT 'f8c1fc3c-5b4e-4f31-8dec-856778075a1c', '3077b89358b44f361edcc29a0c8964f2efd1a548bd1f150dfe6818cfe0e32607', NOW(), '20250716135157_team_booking_page_cache_feature_flag', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20250716135157_team_booking_page_cache_feature_flag');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT '26db6b7a-1c65-4970-8f28-79124b49aa83', '939ba7f79de225783824c8da797a8479a1078d37dbc960638349224a0f8d508d', NOW(), '20250730091450_add_host_many_to_member_one_relation', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20250730091450_add_host_many_to_member_one_relation');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT '5b6b683c-4803-4dcf-b679-02d8d2130337', '09864934e7a74ae4cd06829e0fa362283c5637452a69e46bdb46ae1b84f065e4', NOW(), '20250731135727_add_phone_email_to_expense_log', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20250731135727_add_phone_email_to_expense_log');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT 'da4f765e-6e1e-4563-b54e-14bcb86cab8a', '32461ad899f1e3f17e721109aa8d7115c4502c97f5f3ec07426e67cb6d74f30d', NOW(), '20250806093054_insert_role_permissions_for_routing_form_pbac', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20250806093054_insert_role_permissions_for_routing_form_pbac');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT 'c7e9a7d9-a1ca-46ce-9f3c-86e5ffc0c4da', 'd2d1d52f1add9804165eb2692383f7940ce24a75a8db9146a9c49b47b0f5ab3a', NOW(), '20250807134931_add_cal_ai_self_serve', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20250807134931_add_cal_ai_self_serve');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT '4bf1d693-a02b-47c5-8068-736ca3f77992', 'e2dacca9db1bf938f9830b8d90231a0bd1709cfb1fc3040e32348d34cfa69f9e', NOW(), '20250811123707_add_team_list_members_permission_to_admin_role', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20250811123707_add_team_list_members_permission_to_admin_role');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT '664f4b49-175b-4f78-971c-6bf61d886032', '3579d83e848a1e7a18520ea10d3cdd3e6ced2d353c830812849714eb79ae7939', NOW(), '20250812084523_add_system_segment_id', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20250812084523_add_system_segment_id');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT '9b696c4a-da63-43f8-afc2-1e9f895a91a8', '2e7712039d0f612708ffd13da1e1b29d158c6f60095fbc1fd91572ca26585a8e', NOW(), '20250812101632_add_impersonate_permissions_to_admin_role', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20250812101632_add_impersonate_permissions_to_admin_role');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT 'a3f9306a-9759-4f3d-9977-8b267353a2e2', '1b38eaa9a2b31d9f1717aff1a31612ab85dd7585aaae74700aed59fea270fdfe', NOW(), '20250813182504_adding_booking_triggers_to_workflows', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20250813182504_adding_booking_triggers_to_workflows');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT '914d833e-bed2-4606-ac15-b13aff3a7d98', 'e648ed8fb16f38c6e4769f445aa4ea8d3a50fc499f9ee120260078acf1c5fe15', NOW(), '20250817234749_add_cal_ai_voice_agents', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20250817234749_add_cal_ai_voice_agents');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT 'de704eb6-780a-437e-ad90-64b99721dd88', '9e4898e9a878c0ca201b596c2143e904e9b336ddc6dd14441b6120ebf5b9d9ff', NOW(), '20250818151914_routing_form_response_denormalized_backfill2', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20250818151914_routing_form_response_denormalized_backfill2');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT '1d4e81d7-44c7-4dde-ba95-9269839f13fa', 'f9fb3fa2d043a40d3c552bf32da2d88e83b8700b5042eeca1b1029b65631ac85', NOW(), '20250820094118_add_event_type_booking_requires_auth_column', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20250820094118_add_event_type_booking_requires_auth_column');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT '6459d165-6bf6-4c9d-83f3-643b514a0fe5', 'dbc4cc2bb08eccfddebc8b28df9e9098392c5accaef01fd13c34e078fbc9ce5b', NOW(), '20250821141229_add_external_ref_and_duration', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20250821141229_add_external_ref_and_duration');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT 'bce3391b-cda1-4305-abbf-2a306d4def1f', 'ecc7edbd4ff7c56e4bd624bc48b01d863dc1b17e484558e25b947267b9c8773c', NOW(), '20250829133535_add_member_defaults_permissions_teams', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20250829133535_add_member_defaults_permissions_teams');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT 'f73a8606-931b-40dd-aac6-fe2122de6b7e', '13e2fd359ad028de41cf7e5d94b28b9bcb2724120d67cf5e1e290c3c617a14c4', NOW(), '20250902070438_add_disable_autofill_org_setting', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20250902070438_add_disable_autofill_org_setting');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT '253f57cd-0d88-4100-92a3-9307fbd40c16', '208e7e5654bbbbf6e1360ea5553aba24a8ca5faefc54268a72ef3138680c5001', NOW(), '20250903165210_add_on_cascade', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20250903165210_add_on_cascade');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT '57a9b631-55af-4ce8-afde-a98ecde32d8c', '8f2e4c865ccdd7f42a018f22b796fd4d051dffff05ca80d1794cb1f8704a3bd3', NOW(), '20250905082756_change_internal_note_preset_team_fkey_to_cascade', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20250905082756_change_internal_note_preset_team_fkey_to_cascade');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT '089e9614-13bd-4d48-86f0-53eb7dde6889', 'ebf2354e206b74237ef249cd24261adaf4e5d1dc8211fede919d1a2233f2e2c0', NOW(), '20250905115031_add_webhooks_permissions_default_roles', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20250905115031_add_webhooks_permissions_default_roles');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT '9e5a32c9-2da4-46bb-a186-118ca40cc19b', 'a2a304eda15f2dd198c7858d01a64fd08870359edb2689db36d2e5a9ecb1b71c', NOW(), '20250905121358_add_feature_flag_tiered_support_chat', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20250905121358_add_feature_flag_tiered_support_chat');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT 'cefd74c9-c876-468f-9a2b-88ef0e43c9e4', '29fc08b1bccacf86958b18e2c78c970c276997713c92e4d360738afb162e8025', NOW(), '20250909093954_add_form_submitted_workflow_trigger', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20250909093954_add_form_submitted_workflow_trigger');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT '0a8a6a0e-01a0-4bc5-b6de-b51976a8966a', '0becc18e592da428dc16e9cf18beb1cdca5668df9e3741255fdddd46b66cb4e8', NOW(), '20250909134440_add_form_submitted_no_event', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20250909134440_add_form_submitted_no_event');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT '77b6e1bd-523d-47f1-95d7-6d426cfefcf6', '2943af21db2e5ca51a1a92d2441e7cc0a3eac052889f1f63a74d836624d0b6f0', NOW(), '20250911093331_pbac_team_billing', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20250911093331_pbac_team_billing');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT '8e602b0c-0670-4aec-8f19-fe6ba8a67836', '00f210e25e1838f7b90ec1db1be448a7614d4c0e2889ace068dd9cb63c5fc54c', NOW(), '20250919124540_booking_denormalized_starttime_endtime', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20250919124540_booking_denormalized_starttime_endtime');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT 'c8d4d03c-53b5-4dc3-ad39-3c8f851ab0ea', 'b1575daf02c07e72278b8ddfa08a98bca9e3498116469ffa16a900b11fe3e44d', NOW(), '20250919174231_add_event_type_timestamps', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20250919174231_add_event_type_timestamps');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT '598c018e-1d52-463c-816d-b5894d99bf29', '89b9f1635de1dcee41b4f85eac94d4fb4efebce5c8f144c768b970334ab9a379', NOW(), '20250923082416_add_spam_block', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20250923082416_add_spam_block');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT '3084f527-b7a5-441e-ae8a-c884d46d8f9d', 'a68e4bd0d03432f5087ea297741f76e659f0d0e8c639cf07b335bcd337d07ae5', NOW(), '20250923085350_add_list_members_private_permissions', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20250923085350_add_list_members_private_permissions');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT '3a7897f0-c948-4777-b888-1fdccfc854e7', 'd94e99926cb5f9a031b6e2c32bd9b70c2e9b2fc2f7c7989072937d7a58d96c4e', NOW(), '20250924082337_remove_booking_read_permission_from_member', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20250924082337_remove_booking_read_permission_from_member');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT '7e7c5efe-cff7-4413-9fa5-4d0e1c1bc178', 'c35e841efcea6b86a267fca38f08a1e891a37544961b312d935d788db060fa42', NOW(), '20250924091435_update_watchlist_created_by_id_fkey', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20250924091435_update_watchlist_created_by_id_fkey');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT 'aa777c9c-cf66-4c48-ba4e-dbcbba64481c', '88bcb2db31bcd9705eb534db54680914905f4d6b029afef86339c0a28b426d7a', NOW(), '20250924205500_calendar_subscription_features', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20250924205500_calendar_subscription_features');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT 'eb5d1ed3-1797-4bfe-b135-36046723df56', 'eb48f26a164e927aa0a421278f7073fc6146051631a5b09ca712d547840a7756', NOW(), '20250925122623_add_default_now_eventtype_table_created_at', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20250925122623_add_default_now_eventtype_table_created_at');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT 'a20aeb87-120b-4bd5-9674-3d37f829e034', '856cf2cf6086dc67f5c7a0de8886f36df07170cbcd052f61671b4bac7f098158', NOW(), '20250925134226_add_availability_ooo_permissions_default_roles', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20250925134226_add_availability_ooo_permissions_default_roles');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT 'f999ba9e-4f02-42eb-a0cf-7d6453c73d97', '868dd16e84540d85882b6d57d5850a8302b9ae224c5b4eff058b4dd70b2f47e6', NOW(), '20250926134500_update_watchlist_action_block_for_critical_severity', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20250926134500_update_watchlist_action_block_for_critical_severity');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT '70eb3158-72b5-4d80-98ca-c084d1dce9d5', '18ba5292140731287499f8d7c8dee84272532fd91637c48fb67a81be1f02f6bd', NOW(), '20250929190134_init_team_and_org_billing_tables', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20250929190134_init_team_and_org_billing_tables');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT '3355813e-c1c1-4a3e-81cc-0cfd52f149bd', 'a7e6db14215620a81676b805e8f8b8d56d4c4ff5f0543bde5b5642fca4c7366b', NOW(), '20250930135416_add_type_to_workflow', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20250930135416_add_type_to_workflow');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT '90cdf549-7cb7-4a25-afa9-cf9eaf87ac4e', 'b03a8895ad5854ed19cf24b0c318605451a436b84324b6ad0db93072da966910', NOW(), '20251002092823_add_booker_botid_feature_flag', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20251002092823_add_booker_botid_feature_flag');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT '656fbe18-5371-47f7-8cf0-bc2426d497c9', '37384314c42326bd78358e05dcf6f215101489990b4ecdcd2728a64f5705240f', NOW(), '20251003103832_upsert_watchlist_audit', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20251003103832_upsert_watchlist_audit');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT '1912d4c2-886a-4b67-90b2-5c02af476839', '819d0a0ac46ca214bbc042e97f32909b9c54a1800ccdfba80a7b4648c83d0d72', NOW(), '20251005102651_add_onboarding_v3_feature_flag', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20251005102651_add_onboarding_v3_feature_flag');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT '5ecd803f-1916-4db1-9f88-501dfa3b98f6', '662cf7a66fe746440846608dec398cac8697ab0c4e5ecf91c49fd0cf319a9161', NOW(), '20251006103705_add_inbound_agent', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20251006103705_add_inbound_agent');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT '8dbd4711-b6e5-4642-9136-793170b45e82', '433aeb24549ccb848260930df6f78712e04961e0d1a5060edf877b051a38ba68', NOW(), '20251006111422_add_requires_booker_email_verification', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20251006111422_add_requires_booker_email_verification');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT 'c487cdc7-7dc4-4eb4-a74a-2d33c41648c6', 'aa5b1d13d9a130b7fd15e565df35167ac364b7e1d01f88ec161e1ec8459141df', NOW(), '20251006191654_drop_watchlist_deleted_column_index', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20251006191654_drop_watchlist_deleted_column_index');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT 'b2e3cce8-b8e5-46e2-949b-25cd357d8297', 'd4d6fc3ed45627a955be6d53b8dd0db35f94b33b2cd553ba63234a9e88826b7d', NOW(), '20251007090722_modify_onboarding_table_orgs', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20251007090722_modify_onboarding_table_orgs');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT '136b6633-76c6-4efb-b01c-36242143a85d', '33eb5080236f6f382684af6e7edd158517c19b8d3df7180926d2e8b0d4e9cb81', NOW(), '20251010135752_billing_tables_add_dates', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20251010135752_billing_tables_add_dates');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT 'cfe5aceb-92cb-4b85-8d4a-15101af88be5', 'a95f64175c9f561be7dccc130d6524b536f9cf8438c5bf09c2f14e8f5437f3aa', NOW(), '20251013185902_add_booking_report', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20251013185902_add_booking_report');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT 'd82c93cf-300d-452d-9a16-50d9cf01f017', 'ed7ad98e9893c22ce303013e5a866a384871f82e46fb627f60ae7edb04224544', NOW(), '20251014143620_add_watchlist_audit_relation', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20251014143620_add_watchlist_audit_relation');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT '75e0f4e0-7a04-4901-8854-cd7c8809b9f7', 'd48455d323e56710560bd4b35c6626b24ec7b8f7321b4d3fb90a0fcfcecb914c', NOW(), '20251015211003000_add_watchlist_admin_permissions', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20251015211003000_add_watchlist_admin_permissions');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT '107f821e-28c1-46c4-9a6e-8b1c3fa0a817', 'c08049280d1c22af9cd6b87b72b97249decf470a2e60364e48d7165c5e81a64d', NOW(), '20251017161715_cleanup_future_events', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20251017161715_cleanup_future_events');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT 'bec1290d-030c-498e-9293-ddebc9e4c747', '39d0576fe97839f9cc4e6ead66cb3093af2c8985131d7952a38b01670c1187f6', NOW(), '20251023133244_add_user_uuid_column', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20251023133244_add_user_uuid_column');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT '42d76acb-608f-4f1c-bfd2-1ce24f36b726', 'c7e0b116406a649fa8031ca4c7faa9cee9e59964a3075fa3c1aaa030b01d5dba', NOW(), '20251024025759_add_webhook_version', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20251024025759_add_webhook_version');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT '052dd4de-1e84-44db-87bf-f6e6033c3053', 'cd1c7e8dab501088d19e01371c29d398a3fa2eafdd0e3e48826b3fff334210a2', NOW(), '20251027102656_add_video_call_guest', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20251027102656_add_video_call_guest');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT '1dd196f2-db5c-49c8-97b6-94fab959cb99', '32398dd93ffd07d54f52823e2ef8d88085a7c598cd91602ac0a95086cf877f87', NOW(), '20251028124351_add_partial_indexes_for_user_delete_cascade', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20251028124351_add_partial_indexes_for_user_delete_cascade');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT '00fae670-39af-4638-bd9f-6933851f25e4', '30bffc602f2a19ec677b5b8476b1e626679de152dca6cee15f9c1f4561d82f5c', NOW(), '20251029103123_add_booking_calendar_view_feature_flag', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20251029103123_add_booking_calendar_view_feature_flag');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT 'cc64b8cd-15b1-471a-bb08-004e8af2b467', '6d3bc3cf89992cfe14dafbb8c6fa695606db0201b83f50ebc26cbc78132efaac', NOW(), '20251030081154_add_report_status', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20251030081154_add_report_status');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT 'd9a0b65f-0ae1-4c9a-a38b-f8a40c90ca9e', 'b294fac28454242a9b8b217c23a80814317e1535dd1a72957af223783fea1244', NOW(), '20251103175338_make_user_uuid_required', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20251103175338_make_user_uuid_required');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT '13a6e09c-5862-4c21-a85e-5b8534516d38', 'e04cafbabe4a561879b0a7b64bc1d53b422513cfec164ce65ed3a237a66a9a49', NOW(), '20251110081648_add_delegation_credential_error_webhook_trigger', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20251110081648_add_delegation_credential_error_webhook_trigger');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT '07abd9fd-d0c2-433b-8b5e-2c2b4e69ec69', '0b1235c16c37fbcb74b94b4490f4b1cd97b98e139fd30d5ce684c7d5f8ebde70', NOW(), '20251110160435_add_outbound_event_type_id_to_agent', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20251110160435_add_outbound_event_type_id_to_agent');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT 'cd819fac-9d3b-4d28-9167-f06cb582ca3f', '49ad2fd557f8f1339d3419086f7201864ea65db4178a09c3d8bcdf427519fb3e', NOW(), '20251112171210_add_org_auto_join_on_signup_to_organization_settings', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20251112171210_add_org_auto_join_on_signup_to_organization_settings');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT 'df1eb054-f331-4fb8-9d0a-bc4b2360f8f1', 'e53e2c684999a148e215e0b389d848460da7351fc8b8b2beb2d4486791d94be7', NOW(), '20251114173403_add_bookings_v3_feature_flag', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20251114173403_add_bookings_v3_feature_flag');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT '09818386-395d-4836-9a99-a5327f6990be', '4e244452adf734a718fcbfe1ac126a7e893a3f0bf1b8d355e1c7af6c1fea71ad', NOW(), '20251115043236_add_audit_booking', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20251115043236_add_audit_booking');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT 'ede6c814-4762-4c0f-9aa1-98b2021f7483', 'b0d04f474acd1d3e8384e3ad83b0681b44675ace560ed07bef0c3bd82e8715d3', NOW(), '20251115054502_insert_system_actor', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20251115054502_insert_system_actor');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT '03270743-1be2-4da8-9505-436cca188b83', '2eede00befd65c4f1f0a3e37ddb0cb546b62907b811960538bdf26a6771c0287', NOW(), '20251118120422_add_attendee_email_setting', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20251118120422_add_attendee_email_setting');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT 'e276e0dc-a6b5-4ef3-ad79-263df1a9208b', '9d54b66540229f0b32a3b8eff165c78dc9cb001740a9f3bcb251ef12eb69281b', NOW(), '20251119124132_add_uuidv7_to_audit_actor', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20251119124132_add_uuidv7_to_audit_actor');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT 'dc5230fb-f6a2-4d3c-a71c-b44d26334193', '4f93ab08a324eb17761c14ff33fd377752afb2c93e04e426d51dd358aebdbc71', NOW(), '20251121114503_add_pkce_oauth_client_type', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20251121114503_add_pkce_oauth_client_type');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT 'c8d0cc97-1f8a-426a-9bed-c37d7b25fd32', '8344852d82c16d056a8e72e15f6b2ba2d68523602555bb2e6361baca57749af7', NOW(), '20251126085109_pbac_add_attributes_edit_users_permission', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20251126085109_pbac_add_attributes_edit_users_permission');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT '6b282874-02df-430e-a158-f6d824958e17', '99aef723e9d0173244cbe1b2a7107f2e8c3b7ae0b81c52288c166f5724ff6a7d', NOW(), '20251127102536_add_from_reschdule_index_to_booking', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20251127102536_add_from_reschdule_index_to_booking');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT '21cecbf4-9651-4910-894b-ee334d7a0ff3', '6ca247d0a446eb67ce84b5309d39b0a03374ff943c9650f6188840193863307c', NOW(), '20251129125459_add_show_note_publicly_to_ooo', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20251129125459_add_show_note_publicly_to_ooo');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT 'add3741a-581f-4d29-b694-debb6e063123', 'ab8061d3e1edf1b9d7b6601c8efb78f6c209d10ddd297dc562ab301b6f4a1d04', NOW(), '20251201113559_add_booking_audit_feature_flag', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20251201113559_add_booking_audit_feature_flag');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT 'f41b8d92-961b-435a-94f8-60e5f13a2dd8', '8105e28e7b36bf5c7a070873c1609c95d7bb266dcc77d376934bed8112366641', NOW(), '20251202143411_add_auto_translate_title_enabled', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20251202143411_add_auto_translate_title_enabled');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT '1c2a295e-aa6b-49b4-86bf-7362e27bf78a', '549053c7244c4f49070183706de1f96cf80596b6bdd8c7a5f18511ba9cc4bb27', NOW(), '20251202181340_add_user_holiday_settings', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20251202181340_add_user_holiday_settings');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT '78e69a36-f95b-4d88-913d-f9651c45d77e', 'a815e88e0407d25bbe7dd279f23a8e913854ea595fc579cd15040829666ec838', NOW(), '20251203000000_add_holiday_cache', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20251203000000_add_holiday_cache');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT 'db6fbe75-5927-478d-918c-5ed9e3925878', 'b2c89800d5e4edbd8d948b8fb3c4d20f96566056937af5c7f0ce0b840430e936', NOW(), '20251203102204_add_min_reschedule_period', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20251203102204_add_min_reschedule_period');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT '4ae122a2-789c-44da-a256-886b4923dbdb', '8ec86d7f0d0583d629e7e98834c1bbc0a936266b8e875d8d5fb79ba97ce6bbbd', NOW(), '20251205111359_add_is_trust_to_o_auth_client', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20251205111359_add_is_trust_to_o_auth_client');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT '14b8b39a-9e9a-4d39-8717-cf7b38425477', '452149cd246ebed79704e93d8e3fc91a00336661e7bba0397c33ff50f8442bd3', NOW(), '20251205150624_enable_host_subset', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20251205150624_enable_host_subset');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT 'ce2b62b3-4315-4bd8-8407-ac4891d1dd3a', '4993eb459ba6d44252f73309558dda21ad4a800c67bc01c1d5628991e639e5a2', NOW(), '20251208035931_watchlist_audit_on_delete_set_null', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20251208035931_watchlist_audit_on_delete_set_null');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT '1c00f9ae-4bbf-4730-bba8-3fff1c853dd3', 'e0b0e929ee722286de18edadfc8c74cfa8a8ff39266f5875bb957b59da4b2d98', NOW(), '20251210143104_add_enabled_to_user_and_team_features', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20251210143104_add_enabled_to_user_and_team_features');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT 'b17703fd-f985-45ff-98fc-ab4442d809f0', 'b6c81a6a733fa50fcdfd14927958b7d099a23995d03f88dadb46b17b29d44fc5', NOW(), '20251216074521_enhance_booking_audit_schema', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20251216074521_enhance_booking_audit_schema');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT '8de0585f-5182-4e52-a3c3-38d623367474', 'ddb2a607fd3cf682b69c2b6eb4d4987e0aae2c3d51cf91acde96392349930035', NOW(), '20251217090304_enhance_audit_schema', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20251217090304_enhance_audit_schema');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT 'f3c011fb-5fe7-4090-9104-63bf68e10c53', '2ad40aaa35a1df36f9d97a2b168b87c9466dbfdfa38e2dd0db0a9656ca58c08d', NOW(), '20251217155117_add_auto_opt_in_features', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20251217155117_add_auto_opt_in_features');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT '1ae95eba-8c5d-4f67-98f4-6e5d7ffc308a', '1011a27a913669d87bb0bcfa0ffc29b1830dcb4da6de6334725d49361136e1a9', NOW(), '20251218173119_add_global_watchlist', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20251218173119_add_global_watchlist');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT '262f9ed3-61dd-486c-9224-dd67169843b5', 'a670df80b7484c1134bdb20fc543c2aef1a4f36a2948ea83fc86596c3cf18f93', NOW(), '20251220034814_add_custom_calendar_reminder', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20251220034814_add_custom_calendar_reminder');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT '43e24a60-a53f-438e-b198-a843ae491885', 'c31ab2ad916b838de891a2ba4286dcde7e1d7ac02baf91534cf586df84f767f2', NOW(), '20251224092336_add_context_audit_action', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20251224092336_add_context_audit_action');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT 'c96ead6a-3ccd-47e9-b47c-0759a739da08', '55cfa9080c6bbe65e9b1b6069547640672faeb89ca2a5405b730787ce6dcc0da', NOW(), '20260105071846_update_watchlist_index_with_is_global', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20260105071846_update_watchlist_index_with_is_global');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT 'b02bf12e-b8e8-434e-bfd6-cf6f6bf96c2c', 'fcc837aa0e9f5d37584ae4a3034411f6900bb40d93890bd26bb354a202d0f6be', NOW(), '20260106093811_add_monthly_proration_tracking', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20260106093811_add_monthly_proration_tracking');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT '3b1dd836-7921-4a3d-af42-3306c527f1e9', '79ee0351a1318d01ffb19c00ccf15dead5a4416494b9eed6ea48718ba3227087', NOW(), '20260107093019_add_magic_link_source', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20260107093019_add_magic_link_source');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT 'edc374b2-a8c9-4458-ab11-a74185feafff', '3e283cd985ae582fa4e2b00d42859341cbb9bd62877c5c7d5a8f6f9ee1f59a1a', NOW(), '20260109090244_seed_sidebar_tips_feature', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20260109090244_seed_sidebar_tips_feature');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT '9fe060b1-49e5-4931-b62b-a8e1339a2dd7', 'b1a4051987d0344065b3f046619eb3c039905b0f17ade1731f758017df2f474d', NOW(), '20260112170655_pbac_add_feature_permissions', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20260112170655_pbac_add_feature_permissions');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT 'cc55a770-7bcc-400e-a793-0fac2d5752ed', 'ff1e171cc2ea799c8fed40160e72be2c492b6008361800c978c6f81ed7c4020d', NOW(), '20260112172746_add_integration_attribute_sync', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20260112172746_add_integration_attribute_sync');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT '7f84e103-d4a7-45ca-8e85-b21326283459', '381deb94a22cd26d931d0b866e1907aa31f769c6af43ae96fe17fb28b1405bab', NOW(), '20260113140724_add_missing_integrationattributesync_and_credential_index', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20260113140724_add_missing_integrationattributesync_and_credential_index');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT '0b893a24-23ff-4d5c-be91-016e4cd51684', 'b19b70ede512c3f8de60c73151cc9896b7d8b3897c37479603020eda6c97cd69', NOW(), '20260114154054_add_oauth_client_properties', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20260114154054_add_oauth_client_properties');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT 'e0aaeb7f-a7fe-42b8-a24a-aad27b5d6f4d', '1bde7f42a89a5ca1d6873b364ec18b4d2dd4bb6da2c68ed17cff64202c516757', NOW(), '20260115111819_add_cancellation_reason_require', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20260115111819_add_cancellation_reason_require');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT '1d7d3fe2-1b18-4d0f-85e1-4cce2372c434', '745ee578fb592ea8a8762454763f344a1bd9ced427ae8a387389c6c8029ae464', NOW(), '20260115155453_add_integration_sync_constraint_on_mapping_and_attribute', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20260115155453_add_integration_sync_constraint_on_mapping_and_attribute');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT 'c9ccb7ff-b17a-4066-9c13-80dd76cc37ac', '3245a4268fe5caabdc1d74d75d7c9fa2328af084f113153e957ad180fcd62137', NOW(), '20260116145525_add_custom_host_location', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20260116145525_add_custom_host_location');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT '96584958-b50f-4500-aed8-9e0e3da49936', '44ea3b6979df6dd3c3893de1b1f9b11d9ebd5b4ee6c0ec05533842a3d4c7c13c', NOW(), '20260119113000_add_system_source', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20260119113000_add_system_source');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT 'd69e4276-509c-4e04-a013-4c3af7f39328', '2910c353532f2d14ab302d14c5aa3e3ad10952da18334e5cde53b8f27153051d', NOW(), '20260119120000_add_seat_change_log_operation_id', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20260119120000_add_seat_change_log_operation_id');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT '3f343fd4-7576-4fc7-9d16-f951f0179c1e', '7dc74e94a8e892a84960149d20d25a180c3a95f1927d725508431ee2500bbc3c', NOW(), '20260119184420_add_calendar_subscription_error', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20260119184420_add_calendar_subscription_error');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT 'e461a4fc-c991-4750-9f82-432e1d9f4857', '1599240a6ab335a5fcb447e18283c927142ecb69e22faf594806afc8530c04ea', NOW(), '20260120093500_add_no_show_updated_audit_action', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20260120093500_add_no_show_updated_audit_action');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT '91fceecb-f7b7-46d0-baa8-04da017d06f0', 'baef8cffd9a4d459ca31afe919e973e962ee0bd6fd0713fcf9bfed38e9aeef61', NOW(), '20260121145242_add_workflow_step_translation', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20260121145242_add_workflow_step_translation');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT '0622d864-eec3-44b1-b209-78d1f85d8330', '0bafae9ddc3d97165346d0e2ab63cbb5442949e36d1707d37d3d1e68c9bac334', NOW(), '20260121191700_add_eventtype_parentid_teamid_index', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20260121191700_add_eventtype_parentid_teamid_index');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT 'fe2413ba-8a36-403d-9834-79daced971ed', '7d911449d8986ef5b2f211ca3f2fa8e6d2736d1edd7f2294cfd44f0b38c3a803', NOW(), '20260122133147_add_wrong_assignment_webhook', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20260122133147_add_wrong_assignment_webhook');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT '8a6c5dbf-5ec9-4ec6-bdc3-dee708557623', 'eaa76a3ba6f6bf92c5fb3390fae0e2bbb95ef1017f482816e3abb3e1933f7b0c', NOW(), '20260122140703_add_credential_teamid_index', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20260122140703_add_credential_teamid_index');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT '3b9a5906-daf3-4d92-a034-397d3b7b8ee3', 'c51d31ee94a695e5791199f4f3a1bd0d9c46366d1e789b6605631ba0aaa484c7', NOW(), '20260122145500_drop_user_starttime_endtime', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20260122145500_drop_user_starttime_endtime');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT '83ff863c-d06c-480c-83e8-c2dc14f79c5e', 'd2236cfa929fe50c32c61e1e7c10b458e745a4adf355c84fd45cf30e4e6436e6', NOW(), '20260122165837_add_encrypted_key_to_credential', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20260122165837_add_encrypted_key_to_credential');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT '83a1ec83-61a5-43d2-af07-8a5ce857bffa', 'f4f4e8b66357e478a0435b591104bf650d05de71c239b6159fff73ab2b60be52', NOW(), '20260126173100_add_form_response_formid_createdat_index', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20260126173100_add_form_response_formid_createdat_index');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT '9146234f-eb09-40ad-8e60-0f3ff3c25420', '444238b9afd620f74f7fbdcdec18015e0cc2d34ebf1007d521d6ed10b8d25345', NOW(), '20260127035022_add_routing_trace_tables', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20260127035022_add_routing_trace_tables');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT '365611fc-4bfd-468c-8f6b-925890b154fb', 'c481c1a8d3b91ebf491f50f5331f421ea027ad25abccad6299a5f1c98b3a1f3f', NOW(), '20260127140951_add_invoice_url_to_proration', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20260127140951_add_invoice_url_to_proration');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT '5313769f-4ede-40e4-ab15-3fb31ba70f70', '96071017b67e6e702ed3d2b08185e9986304055b41d0c33158f539e4dc2346ee', NOW(), '20260128004200_add_booking_composite_indexes', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20260128004200_add_booking_composite_indexes');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT '626f7d8b-f772-4a03-a415-d05478cd074d', '3a0d872b86beb1819b36b4cab464e96347e62bf390e64479591648cedaea240b', NOW(), '20260128170309_add_secondary_email_index', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20260128170309_add_secondary_email_index');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT '6dc1d163-9b7a-4c84-a4fc-b479d8b3de65', '99cbedb7f37ee35b68727bf86020fe19131fba78ab0fc231918e2f17f51c87a7', NOW(), '20260129090913_enable_pbac_globally', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20260129090913_enable_pbac_globally');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT 'ae7c47b6-1e5b-4266-83a2-82ec354c07b9', 'ba24f9018d49aad0f627dae2932230e36025fadb9ba877787ff6a92fd8b0e4e0', NOW(), '20260129170000_pbac_add_password_reset_permission', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20260129170000_pbac_add_password_reset_permission');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT '2f41ec99-9f05-47c0-ada6-5301b279fd93', '2bd31969990a6142896e72c261f06ed381c45b668c59031632b0f9642abf0b16', NOW(), '20260129205827_add_wrong_assignment_report_table', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20260129205827_add_wrong_assignment_report_table');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT '0f2f6b0e-bd91-4a1f-b10e-2d99a445c71f', '46b05b8506d6727645b4940a3468b514cf3fde69fb90f04c618daac881b90524', NOW(), '20260130000000_add_selected_calendar_channel_id_index', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20260130000000_add_selected_calendar_channel_id_index');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT 'b666c2fe-4011-4376-b083-a6f5bb9f0c34', '4eba626a57f0bb36a86e59cb38a77760d19bc428a8f487a2265f20be2635bb6e', NOW(), '20260130043627_add_reviewed_fields_to_wrong_assignment_report', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20260130043627_add_reviewed_fields_to_wrong_assignment_report');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT 'e84bcfde-8b71-4c06-a7da-428c3793ce95', '4fbd114a6912dffe2201286558012b956d059486d7a6629bb5dab5d6af95907e', NOW(), '20260130100000_add_high_water_mark_fields', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20260130100000_add_high_water_mark_fields');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT 'c869a19a-ae4d-43fb-8239-5fe38296485f', '96c9b65649e2edff733406a2e7c45f38b2c7ec110b7b53af3ed2cb5fcc8ca803', NOW(), '20260201053520_add_redirect_url_on_no_routing_form_response', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20260201053520_add_redirect_url_on_no_routing_form_response');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT '75c8637c-2757-46a0-abc9-b1251fc15def', '9eb19f63e6710043469fa1ce4a82d5ad204ef507a87ad2838b1029691c62e3c3', NOW(), '20260210000000_add_billing_mode', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20260210000000_add_billing_mode');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT '2c44eb7d-5d8c-4fb6-9b68-ec967fba1830', '4f94c9cde01e71a8dcfd03d2ab25bf147cd6a27c7f62fc132710891f16b0ec96', NOW(), '20260210142544_add_audit_logs_permissions_to_admin_role', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20260210142544_add_audit_logs_permissions_to_admin_role');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT 'd79427b8-cdab-4289-a3de-3105d29b7de4', 'd2ca9995c46432a1c1607cacd20d3f181a199f056d324513fa703fdf7b08d12d', NOW(), '20260211234000_add_composite_index_wrong_assignment_report', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20260211234000_add_composite_index_wrong_assignment_report');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT 'b0910eef-87d6-479f-b5ef-25388391b373', '67fcc17d19eb736e523167331d6c9b65c9a414e9872bf0a0226cbf78b8a07974', NOW(), '20260212202500_add_signup_watchlist_review_feature', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20260212202500_add_signup_watchlist_review_feature');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT '895474c9-9621-4fdb-899b-db55a27d80a4', '158f7958067ef6ea032e80f85661fee207c548bd81b4fca6f8f6aa5de299dbd7', NOW(), '20260213000000_enable_onboarding_v3_globally', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20260213000000_enable_onboarding_v3_globally');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT '1e302776-f9aa-4781-89b6-d5bd4f705530', 'b41f3168d16c8cb627c1c882267e91f1025697c6b33c12e2de5c6d3c24012887', NOW(), '20260218000000_add_routing_form_fallback_hit_webhook_trigger', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20260218000000_add_routing_form_fallback_hit_webhook_trigger');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT 'c67fc392-c40e-4cfe-aa53-78be6d2a067c', 'a40e5389ebfdf6fc3a8d83c47a1c6b54e28b98b7e55fc6b31321f867be496373', NOW(), '20260219000000_add_fallback_action_to_queued_form_response', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20260219000000_add_fallback_action_to_queued_form_response');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT 'b6ffafbb-6cb9-40e9-a20c-a0311cbd00c6', '816a6479dd21ee67aaa10b1d834790238efde3736a05681225e13ca8e0e7a6c5', NOW(), '20260226000000_seed_sink_shortener_feature', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20260226000000_seed_sink_shortener_feature');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT '3931a453-cfa4-4b31-84bc-644ac6486db8', '149d961f16fdf74ae7cec157ae9d8069e3d3d1be9a6fcf9afbacbf87785012b2', NOW(), '20260305043434_remove_routing_forms', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20260305043434_remove_routing_forms');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT 'e9649d2a-1cdb-4d0b-8aab-8f5f611cc68a', '6f1762d606d414b0aecebc2d0d70d847c12b7dbfc5e6282a504f2ef8fa5cdde3', NOW(), '20260319000000_drop_workflow_tables', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20260319000000_drop_workflow_tables');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT '57efd527-cec0-45d6-a84f-bab450118a90', '02727c4d2faf0a6aa2c75970b7bef4a168dc7cd79eb7fd3e4bf00bd83a5c61cf', NOW(), '20260319100000_drop_impersonations_table', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20260319100000_drop_impersonations_table');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT '38c46517-e397-4f4a-b7ef-2976d2a4499d', '8dbf0521cfd138f939adfd9f25d05953adb13a829dba5c4d35bac317e65cf5e5', NOW(), '20260319161640_drop_domain_wide_delegation', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20260319161640_drop_domain_wide_delegation');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT 'b54199a4-5b5d-4224-b665-9744076cee9c', '525774ee77395e54b482abd711710c9ef0255237c7414ece515ee8cfa27cc00e', NOW(), '20260430000000_drop_instant_meeting_webhook_trigger', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20260430000000_drop_instant_meeting_webhook_trigger');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT '2dbb45e6-e7e5-4c93-8534-6f359edc1f06', '85fe5dca5aa9224a3b99510444672f9f99ce46c5b55dc4f3aed9e94c2312fe90', NOW(), '20260703230000_dental_practice_encryption', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20260703230000_dental_practice_encryption');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT 'b71f087e-4d2f-4233-9c9d-e0bb7cc38536', '173a48fa025c725cf615183aca0c2c0997d1b4699591bf352edb7ea7994e1fe2', NOW(), '20260703230100_dental_disable_booking_denormalized', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20260703230100_dental_disable_booking_denormalized');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT 'a28332d8-d870-4e91-9f6c-ee4e70114f1f', 'df04a7c13152dfc65c3b6708287f9c250a4efac35aeba84d68e4efb09fbd3ad1', NOW(), '20260703230200_dental_treatment_resources', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20260703230200_dental_treatment_resources');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT 'c6ddcb4e-1d15-4144-ac8d-dc6e4bf3be7f', '06a3dbe8d6c2b572e6bc436aa9d5a2a8d0bff4f213ae20b6d8595bc3f8ac3763', NOW(), '20260703240000_smart_fill_ai', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20260703240000_smart_fill_ai');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT '3d161a73-720d-4f04-848c-8048f4fc26a8', 'fd2c8f82c25ae8c91dd8e5aa240a1b9fc2dbc5acf720e6012c7a96b978b7fe33', NOW(), '20260703260000_pvs_sync_outbox', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20260703260000_pvs_sync_outbox');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT '8a20b5f6-133d-4901-856c-f129a5bba62e', '249496f3f3ed5cc829522e509681cd5dec0c3772b45c828116e5be4da2339cbb', NOW(), '20260703270000_pvs_connector_credential', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20260703270000_pvs_connector_credential');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT '9bfbda9b-ec0e-45b9-be38-25d2b8e2e323', 'a006206b85dc69c852d9405cc977030ef9f329c6f7301354feb90ed75382b5ad', NOW(), '20260703280000_dental_recall', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20260703280000_dental_recall');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT '7b1d1054-d5ec-4def-b41e-bde335367151', '7fb8d8d9f4b731e5b6111817ed3361160e46217c7f335571afc44d9281fe569e', NOW(), '20260704000000_smart_fill_patient_encryption', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20260704000000_smart_fill_patient_encryption');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT 'ed26987e-90ef-4c2b-87ea-5a758fc5932b', '0b9bc8973371d9d68c809ef219be0558bf357e6e2a993cea0f4534533e73900f', NOW(), '20260704110000_practice_trial', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20260704110000_practice_trial');

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT 'f2d6ff61-9741-46b7-ac21-23823702e18e', '29830a3a475ee8dff1c5d07d4a12fdebfd55e3e50e2dae536d9915a035a18fe5', NOW(), '20260704120000_smart_fill_email_invites', NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20260704120000_smart_fill_email_invites');
