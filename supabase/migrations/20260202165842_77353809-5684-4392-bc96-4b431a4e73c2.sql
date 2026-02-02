-- Drop the existing restrictive policy
DROP POLICY IF EXISTS "Users can create company during onboarding" ON companies;

-- Create a permissive policy for company creation during onboarding
CREATE POLICY "Users can create company during onboarding"
ON companies
FOR INSERT
TO authenticated
WITH CHECK (
  auth.uid() IS NOT NULL 
  AND NOT EXISTS (
    SELECT 1 FROM profiles 
    WHERE profiles.user_id = auth.uid() 
    AND profiles.company_id IS NOT NULL
  )
);

-- Create trigger to auto-create profile when user signs up (if not exists)
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();