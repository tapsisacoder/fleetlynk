-- Fix 1: Restrict profiles SELECT policy to only own profile (prevents company-wide PII harvesting)
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
CREATE POLICY "Users can view own profile" ON public.profiles
    FOR SELECT USING (user_id = auth.uid());

-- Fix 2: Create a role-based access function for manager/admin roles to view driver data
-- First, create a helper function to check if user has elevated role
CREATE OR REPLACE FUNCTION public.has_elevated_role(_user_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role IN ('admin', 'owner', 'manager')
  )
$$;

-- Fix 3: Update drivers policy to restrict sensitive data access to elevated roles only
-- Drop existing policies
DROP POLICY IF EXISTS "Users can view company drivers" ON public.drivers;

-- Create new policy: Only users with elevated roles can view all driver data
-- Regular users can only see basic info (handled via application views)
CREATE POLICY "Elevated roles can view company drivers" ON public.drivers
    FOR SELECT USING (
        company_id = get_user_company_id() 
        AND (
            has_elevated_role(auth.uid()) 
            OR user_id = auth.uid()  -- Drivers can see their own record
        )
    );

-- Create a public view for basic driver info (name only) that regular users can query
CREATE OR REPLACE VIEW public.drivers_basic
WITH (security_invoker = on) AS
SELECT 
    id,
    company_id,
    full_name,
    is_active,
    employment_status
FROM public.drivers;

-- Grant access to the view
GRANT SELECT ON public.drivers_basic TO authenticated;