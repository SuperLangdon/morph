/*
    Morph: drop the government-specific Singpass identity column.
    Reverses 20250410071738_add_user_singpass_uuid.
*/
ALTER TABLE "User" DROP COLUMN IF EXISTS "singpassUuid";
