MATCH (o:Overlays)-[r:belongs_to]->(s:Scenarios)
WITH count(r) AS full_count
MATCH (o:Overlays)-[r:belongs_to]->(s:Scenarios)
RETURN
    full_count,
    ID(o) AS overlay_id,
    o.created AS overlay_created,
    o.updated AS overlay_updated,
    o.o_id AS o_id,
    o.name AS overlay_name,
    o.description AS overlay_description,
    o.category AS overlay_category,
    o.url AS overlay_url,
    ID(r) AS relationship_id,
    r.created AS relationship_created,
    r.updated AS relationship_updated,
    ID(s) AS scenario_id,
    s.created AS scenario_created,
    s.updated AS scenario_updated,
    s.s_id AS s_id,
    s.name AS scenario_name,
    s.description AS scenario_description
ORDER BY s.name, o.name ASC
SKIP toInt({skip})
LIMIT toInt({limit});
