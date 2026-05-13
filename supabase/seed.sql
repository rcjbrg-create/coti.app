-- Seed: Praças operacionais (3 conforme o plano)
INSERT INTO public.stations (name, slug, description, display_order) VALUES
  ('Fogão',        'fogao',        'Praça de cocção e preparos quentes',         1),
  ('Garde Manger', 'garde-manger', 'Praça de preparos frios, saladas e entradas', 2),
  ('Confeitaria',  'confeitaria',  'Praça de sobremesas e panificação',           3);

-- Seed: Categorias de pratos (4 conforme o plano)
INSERT INTO public.categories (name, slug, description, display_order) VALUES
  ('Entradas',         'entradas',         'Entradas e aperitivos',              1),
  ('Pratos Principais','pratos-principais', 'Pratos principais do cardápio',      2),
  ('Sobremesas',       'sobremesas',        'Sobremesas e doces',                 3),
  ('Bebidas',          'bebidas',           'Bebidas e drinques do cardápio',     4);
