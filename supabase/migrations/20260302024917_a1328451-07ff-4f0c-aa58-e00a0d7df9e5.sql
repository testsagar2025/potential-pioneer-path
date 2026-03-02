
-- Drop ALL existing policies and recreate as PERMISSIVE (default)
-- profiles
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;

CREATE POLICY "Users can view own profile"
ON public.profiles FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all profiles"
ON public.profiles FOR SELECT
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Users can insert own profile"
ON public.profiles FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own profile"
ON public.profiles FOR UPDATE
USING (auth.uid() = user_id);

-- student_onboarding
DROP POLICY IF EXISTS "Students can manage own onboarding" ON public.student_onboarding;
DROP POLICY IF EXISTS "Admins can view all onboarding" ON public.student_onboarding;

CREATE POLICY "Students can manage own onboarding"
ON public.student_onboarding FOR ALL
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can view all onboarding"
ON public.student_onboarding FOR SELECT
USING (public.has_role(auth.uid(), 'admin'));

-- test_results
DROP POLICY IF EXISTS "Students can view own results" ON public.test_results;
DROP POLICY IF EXISTS "Students can insert own results" ON public.test_results;
DROP POLICY IF EXISTS "Admins can view all results" ON public.test_results;

CREATE POLICY "Students can view own results"
ON public.test_results FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Students can insert own results"
ON public.test_results FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can view all results"
ON public.test_results FOR SELECT
USING (public.has_role(auth.uid(), 'admin'));

-- user_roles
DROP POLICY IF EXISTS "Users can view own roles" ON public.user_roles;

CREATE POLICY "Users can view own roles"
ON public.user_roles FOR SELECT
USING (auth.uid() = user_id);

-- Recreate the trigger for auto-creating profiles on signup
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
