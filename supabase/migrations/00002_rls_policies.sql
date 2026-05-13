-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.stations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.dishes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.dish_ingredients ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.dish_steps ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.dish_media ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mise_en_place_checklists ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mise_en_place_items ENABLE ROW LEVEL SECURITY;

-- PROFILES
CREATE POLICY "profiles_select_own" ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "profiles_admin_all" ON public.profiles FOR ALL USING (public.is_admin(auth.uid()));

-- STATIONS - Public read active
CREATE POLICY "stations_public_read" ON public.stations FOR SELECT USING (is_active = true);
CREATE POLICY "stations_admin_all" ON public.stations FOR ALL USING (public.is_admin(auth.uid()));

-- CATEGORIES - Public read active
CREATE POLICY "categories_public_read" ON public.categories FOR SELECT USING (is_active = true);
CREATE POLICY "categories_admin_all" ON public.categories FOR ALL USING (public.is_admin(auth.uid()));

-- DISHES - Public read published+active
CREATE POLICY "dishes_public_read" ON public.dishes FOR SELECT USING (is_active = true AND is_published = true);
CREATE POLICY "dishes_admin_all" ON public.dishes FOR ALL USING (public.is_admin(auth.uid()));

-- DISH_INGREDIENTS - Public read via published dish
CREATE POLICY "ingredients_public_read" ON public.dish_ingredients FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.dishes WHERE dishes.id = dish_ingredients.dish_id AND dishes.is_active = true AND dishes.is_published = true)
);
CREATE POLICY "ingredients_admin_all" ON public.dish_ingredients FOR ALL USING (public.is_admin(auth.uid()));

-- DISH_STEPS - Public read via published dish
CREATE POLICY "steps_public_read" ON public.dish_steps FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.dishes WHERE dishes.id = dish_steps.dish_id AND dishes.is_active = true AND dishes.is_published = true)
);
CREATE POLICY "steps_admin_all" ON public.dish_steps FOR ALL USING (public.is_admin(auth.uid()));

-- DISH_MEDIA - Public read via published dish
CREATE POLICY "media_public_read" ON public.dish_media FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.dishes WHERE dishes.id = dish_media.dish_id AND dishes.is_active = true AND dishes.is_published = true)
);
CREATE POLICY "media_admin_all" ON public.dish_media FOR ALL USING (public.is_admin(auth.uid()));

-- CHECKLISTS - Public read active
CREATE POLICY "checklists_public_read" ON public.mise_en_place_checklists FOR SELECT USING (
  is_active = true AND EXISTS (SELECT 1 FROM public.stations WHERE stations.id = mise_en_place_checklists.station_id AND stations.is_active = true)
);
CREATE POLICY "checklists_admin_all" ON public.mise_en_place_checklists FOR ALL USING (public.is_admin(auth.uid()));

-- CHECKLIST ITEMS - Public read via active checklist
CREATE POLICY "checklist_items_public_read" ON public.mise_en_place_items FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM public.mise_en_place_checklists c
    JOIN public.stations s ON s.id = c.station_id
    WHERE c.id = mise_en_place_items.checklist_id AND c.is_active = true AND s.is_active = true
  )
);
CREATE POLICY "checklist_items_admin_all" ON public.mise_en_place_items FOR ALL USING (public.is_admin(auth.uid()));
