-- Enable realtime for carbon_projects table for live inventory updates
ALTER TABLE carbon_projects REPLICA IDENTITY FULL;

-- Add table to realtime publication if not already added
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables 
    WHERE pubname = 'supabase_realtime' 
    AND tablename = 'carbon_projects'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE carbon_projects;
  END IF;
END $$;