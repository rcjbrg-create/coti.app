-- View: public_dish_cards
-- Listagem rápida para galeria de pratos (somente publicados e ativos)
CREATE OR REPLACE VIEW public.public_dish_cards AS
SELECT
  d.id          AS dish_id,
  d.name        AS dish_name,
  d.slug        AS dish_slug,
  c.id          AS category_id,
  c.name        AS category_name,
  c.slug        AS category_slug,
  s.id          AS station_id,
  s.name        AS station_name,
  s.slug        AS station_slug,
  d.thumbnail_path,
  d.short_description
FROM public.dishes d
JOIN public.categories c ON c.id = d.category_id
JOIN public.stations   s ON s.id = d.station_id
WHERE d.is_active = true
  AND d.is_published = true
ORDER BY c.display_order, d.name;

-- View: public_dish_details
-- Ficha técnica completa agregando prato, ingredientes, passos e mídias
CREATE OR REPLACE VIEW public.public_dish_details AS
SELECT
  d.id,
  d.name,
  d.slug,
  d.short_description,
  d.yield_info,
  d.plating_notes,
  d.prep_time_minutes,
  d.serves_quantity,
  d.hero_image_path,
  d.thumbnail_path,
  d.created_at,
  d.updated_at,
  -- Category
  c.id   AS category_id,
  c.name AS category_name,
  c.slug AS category_slug,
  -- Station
  s.id   AS station_id,
  s.name AS station_name,
  s.slug AS station_slug,
  -- Ingredients ordered
  COALESCE(
    (
      SELECT json_agg(
        json_build_object(
          'id',               di.id,
          'ingredient_name',  di.ingredient_name,
          'quantity',         di.quantity,
          'unit',             di.unit,
          'preparation_note', di.preparation_note,
          'display_order',    di.display_order
        ) ORDER BY di.display_order
      )
      FROM public.dish_ingredients di
      WHERE di.dish_id = d.id
    ),
    '[]'::json
  ) AS ingredients,
  -- Steps ordered
  COALESCE(
    (
      SELECT json_agg(
        json_build_object(
          'id',            ds.id,
          'title',         ds.title,
          'instruction',   ds.instruction,
          'time_hint',     ds.time_hint,
          'image_path',    ds.image_path,
          'display_order', ds.display_order
        ) ORDER BY ds.display_order
      )
      FROM public.dish_steps ds
      WHERE ds.dish_id = d.id
    ),
    '[]'::json
  ) AS steps,
  -- Media (primary first)
  COALESCE(
    (
      SELECT json_agg(
        json_build_object(
          'id',             dm.id,
          'media_type',     dm.media_type,
          'storage_bucket', dm.storage_bucket,
          'storage_path',   dm.storage_path,
          'file_name',      dm.file_name,
          'mime_type',      dm.mime_type,
          'file_size_bytes',dm.file_size_bytes,
          'duration_seconds',dm.duration_seconds,
          'is_primary',     dm.is_primary
        ) ORDER BY dm.is_primary DESC, dm.created_at
      )
      FROM public.dish_media dm
      WHERE dm.dish_id = d.id
    ),
    '[]'::json
  ) AS media
FROM public.dishes d
JOIN public.categories c ON c.id = d.category_id
JOIN public.stations   s ON s.id = d.station_id
WHERE d.is_active = true
  AND d.is_published = true;
