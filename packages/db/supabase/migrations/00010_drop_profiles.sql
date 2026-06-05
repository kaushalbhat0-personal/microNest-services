-- Drop the auto-profile trigger and function (vestigial — onboarding uses organizations + organization_members)
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS handle_new_user();

-- Drop the profiles table
DROP TABLE IF EXISTS profiles CASCADE;
