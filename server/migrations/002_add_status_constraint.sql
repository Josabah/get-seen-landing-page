-- Add status constraint for existing tables created without it
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conrelid = 'subscribers'::regclass AND conname = 'subscribers_status_check'
  ) THEN
    ALTER TABLE subscribers ADD CONSTRAINT subscribers_status_check CHECK (status IN ('subscribed', 'unsubscribed'));
  END IF;
END $$;
