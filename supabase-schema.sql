-- Arcana Echo Database Schema
-- Run this in your Supabase SQL Editor (https://supabase.com/dashboard/project/rafibhakwxqmjoxfmnkb/sql)

-- User Profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  name TEXT,
  focus_areas TEXT[] DEFAULT '{}',
  reading_style TEXT DEFAULT 'gentle',
  intentions TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Reading History table
CREATE TABLE IF NOT EXISTS readings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  journal_entry TEXT,
  spread_name TEXT NOT NULL,
  drawn_cards JSONB NOT NULL,
  reading JSONB NOT NULL,
  is_turning_point BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Card Notes table (personal notes for each card)
CREATE TABLE IF NOT EXISTS card_notes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  card_name TEXT NOT NULL,
  note TEXT,
  resonance TEXT CHECK (resonance IN ('love', 'neutral', 'shadow')),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, card_name)
);

-- Custom Spreads table
CREATE TABLE IF NOT EXISTS custom_spreads (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  theme TEXT NOT NULL,
  spread_name TEXT NOT NULL,
  description TEXT,
  number_of_cards INTEGER NOT NULL,
  positions TEXT[] NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE readings ENABLE ROW LEVEL SECURITY;
ALTER TABLE card_notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE custom_spreads ENABLE ROW LEVEL SECURITY;

-- Policies: Users can only access their own data
CREATE POLICY "Users can view own profile" ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON profiles FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can view own readings" ON readings FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own readings" ON readings FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own readings" ON readings FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own readings" ON readings FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "Users can view own card notes" ON card_notes FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own card notes" ON card_notes FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own card notes" ON card_notes FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own card notes" ON card_notes FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "Users can view own custom spreads" ON custom_spreads FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own custom spreads" ON custom_spreads FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own custom spreads" ON custom_spreads FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own custom spreads" ON custom_spreads FOR DELETE USING (auth.uid() = user_id);

-- Function to auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id)
  VALUES (NEW.id);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create profile on signup
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_readings_user_id ON readings(user_id);
CREATE INDEX IF NOT EXISTS idx_readings_created_at ON readings(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_card_notes_user_id ON card_notes(user_id);
CREATE INDEX IF NOT EXISTS idx_custom_spreads_user_id ON custom_spreads(user_id);
