REVOKE INSERT, UPDATE, DELETE ON public.orders FROM anon, authenticated;

CREATE POLICY "No public inserts on orders"
ON public.orders FOR INSERT
TO anon, authenticated
WITH CHECK (false);

CREATE POLICY "No public updates on orders"
ON public.orders FOR UPDATE
TO anon, authenticated
USING (false)
WITH CHECK (false);

CREATE POLICY "No public deletes on orders"
ON public.orders FOR DELETE
TO anon, authenticated
USING (false);