-- Run schema.sql first. Default demo admin: admin@ewacon.sa / ChangeMe123!
INSERT INTO admins(full_name,email,password_hash,role) VALUES('EWACON Super Admin','admin@ewacon.sa','$2b$10$5w9xY0YwQ7w2r7t4uJ7v5u7GmB6r8M4y9G3x0h8l8Yv5n2wK4pK7G','super_admin') ON CONFLICT(email) DO NOTHING;
-- Example exhibition inventory; replace dimensions/names after final booth plan is approved.
INSERT INTO booths(booth_no,booth_type,location,width_m,depth_m) SELECT 'B-'||lpad(i::text,2,'0'),'standard','Exhibition Hall',3,3 FROM generate_series(1,18)i ON CONFLICT(booth_no) DO NOTHING;
