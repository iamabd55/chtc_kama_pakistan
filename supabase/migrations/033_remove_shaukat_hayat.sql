-- Remove Shaukat Hayat from the team_members table
-- Run this in the Supabase SQL Editor (Dashboard → SQL Editor)

DELETE FROM team_members
WHERE id = '11111111-1111-1111-1111-111111111204';

-- Fix display_order gap: shift M. Izhar Ul Haq from 5 → 4
UPDATE team_members
SET display_order = 4, updated_at = now()
WHERE id = '11111111-1111-1111-1111-111111111205';
