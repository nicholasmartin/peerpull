-- Add email_public flag so users can control email visibility on their profile
ALTER TABLE profiles ADD COLUMN email_public boolean NOT NULL DEFAULT false;
