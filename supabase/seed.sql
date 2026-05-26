-- Optional EDEN starter catalog. Run after schema.sql in a new environment.
INSERT INTO categories (name, slug, description)
VALUES
  ('Statement Plants', 'statement-plants', 'Architectural specimens for luminous interior spaces.'),
  ('Air Purifiers', 'air-purifiers', 'Calm, resilient botanicals chosen for restful rooms.')
ON CONFLICT (slug) DO NOTHING;

INSERT INTO products (
  name, slug, description, story, price, image_url, category_id, stock_quantity,
  care_level, sunlight, water_frequency, indoor, is_pet_friendly, is_published, is_featured, display_order
)
VALUES
  ('Monstera Deliciosa', 'monstera-deliciosa', 'A sculptural canopy with dramatic split leaves.', 'Raised beneath dappled conservatory light, this monstera unfurls new silhouettes with every season.', 89, '/plants/monstera.jpg', (SELECT id FROM categories WHERE slug = 'statement-plants'), 12, 'Moderate', 'Bright indirect', 'Weekly', TRUE, FALSE, TRUE, TRUE, 1),
  ('Fiddle Leaf Fig', 'fiddle-leaf-fig', 'Tall, architectural foliage for sunlit corners.', 'A living column of deep green leaves, selected for proportion and quiet grandeur.', 124, '/plants/fiddle-leaf.jpg', (SELECT id FROM categories WHERE slug = 'statement-plants'), 7, 'Moderate', 'Bright indirect', 'Every 7-10 days', TRUE, FALSE, TRUE, TRUE, 2),
  ('Calathea Orbifolia', 'calathea-orbifolia', 'Silver-striped leaves with an elegant rhythmic pattern.', 'Its leaves rise and settle with the day, a small forest ritual for calm interiors.', 64, '/plants/calathea.jpg', (SELECT id FROM categories WHERE slug = 'air-purifiers'), 16, 'Expert', 'Filtered light', 'Keep lightly moist', TRUE, TRUE, TRUE, TRUE, 3),
  ('Peace Lily', 'peace-lily', 'Glossy foliage crowned by soft white blooms.', 'A serene flowering companion that brings luminous detail into shaded rooms.', 48, '/plants/peace-lily.jpg', (SELECT id FROM categories WHERE slug = 'air-purifiers'), 20, 'Easy', 'Low to medium', 'Weekly', TRUE, FALSE, TRUE, FALSE, 4),
  ('Snake Plant', 'snake-plant', 'Upright patterned foliage made for modern rooms.', 'Steady and resilient, this specimen keeps its clean geometry in almost any interior light.', 42, '/plants/snake-plant.jpg', (SELECT id FROM categories WHERE slug = 'air-purifiers'), 24, 'Easy', 'Low to bright', 'Every 2-3 weeks', TRUE, FALSE, TRUE, FALSE, 5)
ON CONFLICT (slug) DO UPDATE SET
  image_url = EXCLUDED.image_url,
  story = EXCLUDED.story,
  is_published = EXCLUDED.is_published,
  is_featured = EXCLUDED.is_featured,
  display_order = EXCLUDED.display_order;
