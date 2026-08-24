-- Alexa user IDs can exceed the previous VARCHAR(200) limit.
-- This is an in-place type widening; existing records are preserved.
ALTER TABLE "alexa_trivia_results"
ALTER COLUMN "alexa_user_id" TYPE TEXT;
