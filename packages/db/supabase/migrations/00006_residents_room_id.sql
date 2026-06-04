-- Link residents to rooms via room_id (non-breaking additive migration)
-- room_number is retained for backward compatibility

alter table staynest_residents
  add column room_id uuid references staynest_rooms(id);

create index idx_staynest_residents_room_id on staynest_residents(room_id);
