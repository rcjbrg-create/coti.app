-- Create storage buckets
INSERT INTO storage.buckets (id, name, public) VALUES ('dish-images', 'dish-images', true);
INSERT INTO storage.buckets (id, name, public) VALUES ('dish-videos', 'dish-videos', true);
INSERT INTO storage.buckets (id, name, public) VALUES ('dish-thumbnails', 'dish-thumbnails', true);
INSERT INTO storage.buckets (id, name, public) VALUES ('step-images', 'step-images', true);
INSERT INTO storage.buckets (id, name, public) VALUES ('category-covers', 'category-covers', true);

-- Public read for all buckets
CREATE POLICY "public_read_dish_images" ON storage.objects FOR SELECT USING (bucket_id = 'dish-images');
CREATE POLICY "public_read_dish_videos" ON storage.objects FOR SELECT USING (bucket_id = 'dish-videos');
CREATE POLICY "public_read_dish_thumbnails" ON storage.objects FOR SELECT USING (bucket_id = 'dish-thumbnails');
CREATE POLICY "public_read_step_images" ON storage.objects FOR SELECT USING (bucket_id = 'step-images');
CREATE POLICY "public_read_category_covers" ON storage.objects FOR SELECT USING (bucket_id = 'category-covers');

-- Admin upload/update/delete for all buckets
CREATE POLICY "admin_write_dish_images" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'dish-images' AND public.is_admin(auth.uid()));
CREATE POLICY "admin_update_dish_images" ON storage.objects FOR UPDATE USING (bucket_id = 'dish-images' AND public.is_admin(auth.uid()));
CREATE POLICY "admin_delete_dish_images" ON storage.objects FOR DELETE USING (bucket_id = 'dish-images' AND public.is_admin(auth.uid()));

CREATE POLICY "admin_write_dish_videos" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'dish-videos' AND public.is_admin(auth.uid()));
CREATE POLICY "admin_update_dish_videos" ON storage.objects FOR UPDATE USING (bucket_id = 'dish-videos' AND public.is_admin(auth.uid()));
CREATE POLICY "admin_delete_dish_videos" ON storage.objects FOR DELETE USING (bucket_id = 'dish-videos' AND public.is_admin(auth.uid()));

CREATE POLICY "admin_write_dish_thumbnails" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'dish-thumbnails' AND public.is_admin(auth.uid()));
CREATE POLICY "admin_update_dish_thumbnails" ON storage.objects FOR UPDATE USING (bucket_id = 'dish-thumbnails' AND public.is_admin(auth.uid()));
CREATE POLICY "admin_delete_dish_thumbnails" ON storage.objects FOR DELETE USING (bucket_id = 'dish-thumbnails' AND public.is_admin(auth.uid()));

CREATE POLICY "admin_write_step_images" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'step-images' AND public.is_admin(auth.uid()));
CREATE POLICY "admin_update_step_images" ON storage.objects FOR UPDATE USING (bucket_id = 'step-images' AND public.is_admin(auth.uid()));
CREATE POLICY "admin_delete_step_images" ON storage.objects FOR DELETE USING (bucket_id = 'step-images' AND public.is_admin(auth.uid()));

CREATE POLICY "admin_write_category_covers" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'category-covers' AND public.is_admin(auth.uid()));
CREATE POLICY "admin_update_category_covers" ON storage.objects FOR UPDATE USING (bucket_id = 'category-covers' AND public.is_admin(auth.uid()));
CREATE POLICY "admin_delete_category_covers" ON storage.objects FOR DELETE USING (bucket_id = 'category-covers' AND public.is_admin(auth.uid()));
