-- Migration: Database triggers and utility functions
-- Description: Automatic timestamp updates and helper functions
-- Author: KOMOT Team
-- Date: 2026-11-16

-- ============================================================================
-- AUTOMATIC TIMESTAMP UPDATE FUNCTION
-- ============================================================================

CREATE OR REPLACE FUNCTION komot.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ============================================================================
-- APPLY UPDATE TRIGGERS TO TABLES WITH updated_at COLUMNS
-- ============================================================================

CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON komot.profiles
  FOR EACH ROW
  EXECUTE FUNCTION komot.update_updated_at_column();

CREATE TRIGGER update_connections_updated_at
  BEFORE UPDATE ON komot.connections
  FOR EACH ROW
  EXECUTE FUNCTION komot.update_updated_at_column();

-- ============================================================================
-- UTILITY FUNCTION: Generate random QR token
-- ============================================================================

CREATE OR REPLACE FUNCTION komot.generate_qr_token()
RETURNS TEXT AS $$
DECLARE
  chars TEXT := 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_';
  result TEXT := '';
  i INTEGER;
BEGIN
  FOR i IN 1..32 LOOP
    result := result || substr(chars, floor(random() * length(chars) + 1)::int, 1);
  END LOOP;
  RETURN result;
END;
$$ LANGUAGE plpgsql;

-- ============================================================================
-- UTILITY FUNCTION: Create notification
-- ============================================================================

CREATE OR REPLACE FUNCTION komot.create_notification(
  p_user_id UUID,
  p_type TEXT,
  p_title TEXT,
  p_message TEXT DEFAULT NULL,
  p_link TEXT DEFAULT NULL
)
RETURNS UUID AS $$
DECLARE
  notification_id UUID;
BEGIN
  INSERT INTO komot.notifications (user_id, type, title, message, link)
  VALUES (p_user_id, p_type, p_title, p_message, p_link)
  RETURNING id INTO notification_id;

  RETURN notification_id;
END;
$$ LANGUAGE plpgsql;

-- ============================================================================
-- TRIGGER: Notify on connection request
-- ============================================================================

CREATE OR REPLACE FUNCTION komot.notify_connection_request()
RETURNS TRIGGER AS $$
DECLARE
  requester_name TEXT;
BEGIN
  -- Get requester's name
  SELECT COALESCE(full_name, username) INTO requester_name
  FROM komot.profiles
  WHERE id = NEW.requester_id;

  -- Create notification for recipient
  PERFORM komot.create_notification(
    NEW.recipient_id,
    'connection_request',
    'New connection request',
    requester_name || ' wants to connect with you',
    '/dashboard/connections'
  );

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER on_connection_request
  AFTER INSERT ON komot.connections
  FOR EACH ROW
  WHEN (NEW.status = 'pending')
  EXECUTE FUNCTION komot.notify_connection_request();

-- ============================================================================
-- TRIGGER: Notify on connection accepted
-- ============================================================================

CREATE OR REPLACE FUNCTION komot.notify_connection_accepted()
RETURNS TRIGGER AS $$
DECLARE
  recipient_name TEXT;
BEGIN
  -- Get recipient's name
  SELECT COALESCE(full_name, username) INTO recipient_name
  FROM komot.profiles
  WHERE id = NEW.recipient_id;

  -- Create notification for requester
  PERFORM komot.create_notification(
    NEW.requester_id,
    'connection_accepted',
    'Connection accepted',
    recipient_name || ' accepted your connection request',
    '/dashboard/connections'
  );

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER on_connection_accepted
  AFTER UPDATE ON komot.connections
  FOR EACH ROW
  WHEN (OLD.status = 'pending' AND NEW.status = 'accepted')
  EXECUTE FUNCTION komot.notify_connection_accepted();

-- ============================================================================
-- COMMENTS
-- ============================================================================

COMMENT ON FUNCTION komot.update_updated_at_column() IS 'Automatically update updated_at timestamp';
COMMENT ON FUNCTION komot.generate_qr_token() IS 'Generate secure random token for QR codes';
COMMENT ON FUNCTION komot.create_notification(UUID, TEXT, TEXT, TEXT, TEXT) IS 'Helper function to create user notifications';
COMMENT ON FUNCTION komot.notify_connection_request() IS 'Trigger function to notify users of connection requests';
COMMENT ON FUNCTION komot.notify_connection_accepted() IS 'Trigger function to notify users when connections are accepted';
