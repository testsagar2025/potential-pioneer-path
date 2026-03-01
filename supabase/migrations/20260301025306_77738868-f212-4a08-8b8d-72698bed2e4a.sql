
-- Fix profiles RLS: policies should be PERMISSIVE (OR logic), not RESTRICTIVE (AND logic)
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;

CREATE POLICY "Users can view own profile"
ON public.profiles FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all profiles"
ON public.profiles FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Users can insert own profile"
ON public.profiles FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own profile"
ON public.profiles FOR UPDATE
TO authenticated
USING (auth.uid() = user_id);

-- Fix student_onboarding RLS
DROP POLICY IF EXISTS "Students can manage own onboarding" ON public.student_onboarding;
DROP POLICY IF EXISTS "Admins can view all onboarding" ON public.student_onboarding;

CREATE POLICY "Students can manage own onboarding"
ON public.student_onboarding FOR ALL
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can view all onboarding"
ON public.student_onboarding FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Fix test_results RLS
DROP POLICY IF EXISTS "Students can view own results" ON public.test_results;
DROP POLICY IF EXISTS "Students can insert own results" ON public.test_results;
DROP POLICY IF EXISTS "Admins can view all results" ON public.test_results;

CREATE POLICY "Students can view own results"
ON public.test_results FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Students can insert own results"
ON public.test_results FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can view all results"
ON public.test_results FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Fix user_roles RLS
DROP POLICY IF EXISTS "Users can view own roles" ON public.user_roles;

CREATE POLICY "Users can view own roles"
ON public.user_roles FOR SELECT
TO authenticated
USING (auth.uid() = user_id);
