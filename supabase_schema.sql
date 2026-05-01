-- Create Projects Table
CREATE TABLE IF NOT EXISTS projects (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  short_description TEXT,
  overview TEXT,
  challenge TEXT,
  services TEXT[], -- Array of strings
  technical_stack TEXT[], -- Array of strings
  image_url TEXT,
  cover_image TEXT,
  project_url TEXT,
  website TEXT,
  category TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create Blogs Table
CREATE TABLE IF NOT EXISTS blogs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  short_description TEXT,
  category TEXT,
  date TEXT,
  image_url TEXT,
  cover_image TEXT,
  content TEXT,
  author TEXT DEFAULT 'Abdellah S.DEV',
  tags TEXT[],
  related_posts UUID[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE blogs ENABLE ROW LEVEL SECURITY;
ALTER TABLE tools ENABLE ROW LEVEL SECURITY;

-- Public Read Access
CREATE POLICY "Public Read Access" ON projects FOR SELECT USING (true);
CREATE POLICY "Public Read Access" ON blogs FOR SELECT USING (true);
CREATE POLICY "Public Read Access" ON tools FOR SELECT USING (true);

-- Admin Full Access (Only authenticated users)
CREATE POLICY "Admin Full Access" ON projects FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin Full Access" ON blogs FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin Full Access" ON tools FOR ALL USING (auth.role() = 'authenticated');
