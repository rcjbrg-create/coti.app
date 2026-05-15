INSERT INTO public.categories (name, slug, description, display_order) VALUES
('BASE DE SOBREMESAS', 'base-de-sobremesas', 'Preparos base para sobremesas', 1),
('BASE DE CEREAIS', 'base-de-cereais', 'Preparos base com cereais', 2),
('BASE DE NHOQUES', 'base-de-nhoques', 'Massas e nhoques', 3),
('BASE DE TEMPEROS', 'base-de-temperos', 'Temperos e molhos base', 4),
('BASE DE PROTEINAS', 'base-de-proteinas', 'Preparos de proteinas', 5),
('PRATO EXECUTIVO', 'prato-executivo', 'Pratos do menu executivo', 6),
('PRATO EXEC. PARA 2P.', 'prato-executivo-2p', 'Prato executivo para duas pessoas', 7),
('ENTRADAS', 'entradas', 'Entradas e aperitivos', 8),
('SOBREMESAS', 'sobremesas', 'Sobremesas e doces', 9)
ON CONFLICT (slug) DO NOTHING;
