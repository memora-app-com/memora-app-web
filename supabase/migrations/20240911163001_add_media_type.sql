create type "public"."media_type" as enum ('image', 'video');

alter table "public"."photos" drop constraint "photos_user_id_fkey";

alter table "public"."photos" add column "type" media_type not null default 'image'::media_type;

alter table "public"."photos" alter column "user_id" drop default;

create policy "Enable delete for users based on user_id"
on "public"."photos"
as permissive
for delete
to public
using (((( SELECT auth.uid() AS uid) = user_id) OR (( SELECT galleries.host_id
   FROM galleries
  WHERE (galleries.id = photos.gallery_id)) = auth.uid())));



