create policy "Give anon users access to JPG images in folder radwn2_0"
on "storage"."objects"
as permissive
for select
to anon, authenticated
using (((bucket_id = 'main-bucket'::text) AND (lower((storage.foldername(name))[1]) = 'photos'::text)));


create policy "Give anon users access to JPG images in folder radwn2_1"
on "storage"."objects"
as permissive
for insert
to anon, authenticated
with check (((bucket_id = 'main-bucket'::text) AND (lower((storage.foldername(name))[1]) = 'photos'::text)));


create policy "Give anon users access to JPG images in folder radwn2_2"
on "storage"."objects"
as permissive
for update
to anon, authenticated
using (((bucket_id = 'main-bucket'::text) AND (lower((storage.foldername(name))[1]) = 'photos'::text)));


create policy "Give anon users access to JPG images in folder radwn2_3"
on "storage"."objects"
as permissive
for delete
to anon, authenticated
using (((bucket_id = 'main-bucket'::text) AND (lower((storage.foldername(name))[1]) = 'photos'::text)));



