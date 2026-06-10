-- Elimina precios hardcodeados de los CTAs en el contenido de los posts
-- Patrones: (149.90 €), (49.90 €), (16.90 €), (9.95 €), (19.95 €), (49.95 €)
UPDATE "Post"
SET content = regexp_replace(
  regexp_replace(
    regexp_replace(
      regexp_replace(
        regexp_replace(
          regexp_replace(
            content,
            ' \(149\.90 €\)', '', 'g'
          ),
          ' \(49\.90 €\)', '', 'g'
        ),
        ' \(16\.90 €\)', '', 'g'
      ),
      ' \(9\.95 €\)', '', 'g'
    ),
    ' \(19\.95 €\)', '', 'g'
  ),
  ' \(49\.95 €\)', '', 'g'
)
WHERE content ~ '\([0-9]+\.[0-9]+ €\)';

SELECT COUNT(*) as "posts_con_precios_restantes"
FROM "Post"
WHERE content ~ '\([0-9]+\.[0-9]+ €\)';
