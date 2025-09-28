-- Location: supabase/migrations/20250927014933_devolusat_auth_with_tax_system.sql
-- Schema Analysis: Fresh Supabase project with no existing schema
-- Integration Type: Complete new schema for DevoluSAT AI tax refund system
-- Dependencies: None (new project)

-- 1. Create custom types for the tax system
CREATE TYPE public.user_role AS ENUM ('taxpayer', 'admin', 'accountant', 'reviewer');
CREATE TYPE public.refund_type AS ENUM ('iva', 'isr', 'salarios', 'otros');
CREATE TYPE public.refund_status AS ENUM ('borrador', 'enviado', 'en_proceso', 'aprobado', 'rechazado', 'completado');
CREATE TYPE public.document_type AS ENUM ('cfdi', 'recibo', 'comprobante', 'anexo', 'identificacion', 'otro');
CREATE TYPE public.document_status AS ENUM ('subiendo', 'validado', 'rechazado', 'procesando');

-- 2. Core user profiles table (intermediary between auth.users and public schema)
CREATE TABLE public.user_profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL UNIQUE,
    full_name TEXT NOT NULL,
    rfc TEXT UNIQUE,
    curp TEXT,
    phone TEXT,
    role public.user_role DEFAULT 'taxpayer'::public.user_role,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 3. Tax refund requests table
CREATE TABLE public.refund_requests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    folio TEXT UNIQUE NOT NULL,
    user_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE,
    refund_type public.refund_type NOT NULL,
    tax_year INTEGER NOT NULL,
    tax_period TEXT,
    requested_amount DECIMAL(15,2),
    approved_amount DECIMAL(15,2),
    status public.refund_status DEFAULT 'borrador'::public.refund_status,
    submission_date TIMESTAMPTZ,
    completion_date TIMESTAMPTZ,
    estimated_completion_date DATE,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 4. Documents table for file management
CREATE TABLE public.documents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    refund_request_id UUID REFERENCES public.refund_requests(id) ON DELETE CASCADE,
    user_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE,
    file_name TEXT NOT NULL,
    file_size INTEGER,
    file_type TEXT,
    document_type public.document_type NOT NULL,
    document_status public.document_status DEFAULT 'subiendo'::public.document_status,
    file_path TEXT,
    validation_notes TEXT,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 5. Activity timeline for tracking request progress
CREATE TABLE public.activity_timeline (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    refund_request_id UUID REFERENCES public.refund_requests(id) ON DELETE CASCADE,
    user_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE,
    activity_type TEXT NOT NULL,
    description TEXT NOT NULL,
    metadata JSONB,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 6. Create essential indexes for performance
CREATE INDEX idx_user_profiles_user_id ON public.user_profiles(id);
CREATE INDEX idx_user_profiles_rfc ON public.user_profiles(rfc);
CREATE INDEX idx_refund_requests_user_id ON public.refund_requests(user_id);
CREATE INDEX idx_refund_requests_status ON public.refund_requests(status);
CREATE INDEX idx_refund_requests_folio ON public.refund_requests(folio);
CREATE INDEX idx_documents_refund_request_id ON public.documents(refund_request_id);
CREATE INDEX idx_documents_user_id ON public.documents(user_id);
CREATE INDEX idx_activity_timeline_refund_request_id ON public.activity_timeline(refund_request_id);

-- 7. Create storage buckets for document management
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
    'tax-documents',
    'tax-documents', 
    false,
    10485760, -- 10MB limit
    ARRAY['application/pdf', 'application/xml', 'text/xml', 'image/jpeg', 'image/png', 'application/zip']
);

INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
    'profile-images',
    'profile-images',
    false,
    5242880, -- 5MB limit
    ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/jpg']
);

-- 8. Enable RLS on all tables
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.refund_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.activity_timeline ENABLE ROW LEVEL SECURITY;

-- 9. Helper functions for RLS policies
CREATE OR REPLACE FUNCTION public.is_admin_user()
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
SELECT EXISTS (
    SELECT 1 FROM auth.users au
    WHERE au.id = auth.uid() 
    AND (au.raw_user_meta_data->>'role' = 'admin' 
         OR au.raw_app_meta_data->>'role' = 'admin')
)
$$;

-- 10. RLS Policies following safe patterns

-- Pattern 1: Core user table (user_profiles) - Simple only, no functions
CREATE POLICY "users_manage_own_user_profiles"
ON public.user_profiles
FOR ALL
TO authenticated
USING (id = auth.uid())
WITH CHECK (id = auth.uid());

-- Admin access to all profiles
CREATE POLICY "admins_view_all_profiles"
ON public.user_profiles
FOR SELECT
TO authenticated
USING (public.is_admin_user());

-- Pattern 2: Simple user ownership for refund requests
CREATE POLICY "users_manage_own_refund_requests"
ON public.refund_requests
FOR ALL
TO authenticated
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

-- Admin access to all refund requests
CREATE POLICY "admins_manage_all_refund_requests"
ON public.refund_requests
FOR ALL
TO authenticated
USING (public.is_admin_user())
WITH CHECK (public.is_admin_user());

-- Pattern 2: Simple user ownership for documents
CREATE POLICY "users_manage_own_documents"
ON public.documents
FOR ALL
TO authenticated
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

-- Admin access to all documents
CREATE POLICY "admins_manage_all_documents"
ON public.documents
FOR ALL
TO authenticated
USING (public.is_admin_user())
WITH CHECK (public.is_admin_user());

-- Pattern 2: Simple user ownership for activity timeline
CREATE POLICY "users_view_own_activity"
ON public.activity_timeline
FOR SELECT
TO authenticated
USING (user_id = auth.uid());

-- Admin access to all activities
CREATE POLICY "admins_view_all_activities"
ON public.activity_timeline
FOR SELECT
TO authenticated
USING (public.is_admin_user());

-- 11. Storage RLS policies for tax documents
CREATE POLICY "users_view_own_tax_documents"
ON storage.objects
FOR SELECT
TO authenticated
USING (bucket_id = 'tax-documents' AND owner = auth.uid());

CREATE POLICY "users_upload_own_tax_documents" 
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
    bucket_id = 'tax-documents' 
    AND owner = auth.uid()
    AND (storage.foldername(name))[1] = auth.uid()::text
);

CREATE POLICY "users_update_own_tax_documents"
ON storage.objects
FOR UPDATE
TO authenticated
USING (bucket_id = 'tax-documents' AND owner = auth.uid())
WITH CHECK (bucket_id = 'tax-documents' AND owner = auth.uid());

CREATE POLICY "users_delete_own_tax_documents"
ON storage.objects
FOR DELETE
TO authenticated
USING (bucket_id = 'tax-documents' AND owner = auth.uid());

-- 12. Storage RLS policies for profile images
CREATE POLICY "users_view_own_profile_images"
ON storage.objects
FOR SELECT
TO authenticated
USING (bucket_id = 'profile-images' AND owner = auth.uid());

CREATE POLICY "users_upload_own_profile_images"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
    bucket_id = 'profile-images' 
    AND owner = auth.uid()
    AND (storage.foldername(name))[1] = auth.uid()::text
);

CREATE POLICY "users_update_own_profile_images"
ON storage.objects
FOR UPDATE
TO authenticated
USING (bucket_id = 'profile-images' AND owner = auth.uid())
WITH CHECK (bucket_id = 'profile-images' AND owner = auth.uid());

CREATE POLICY "users_delete_own_profile_images"
ON storage.objects
FOR DELETE
TO authenticated
USING (bucket_id = 'profile-images' AND owner = auth.uid());

-- 13. Function to generate unique folio numbers
CREATE OR REPLACE FUNCTION public.generate_folio()
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    year_suffix TEXT;
    sequence_num INTEGER;
    new_folio TEXT;
BEGIN
    year_suffix := TO_CHAR(CURRENT_DATE, 'YYYY');
    
    -- Get next sequence number for this year
    SELECT COALESCE(MAX(CAST(SUBSTRING(folio FROM 'DEV-' || year_suffix || '-(\d+)') AS INTEGER)), 0) + 1
    INTO sequence_num
    FROM public.refund_requests
    WHERE folio LIKE 'DEV-' || year_suffix || '-%';
    
    new_folio := 'DEV-' || year_suffix || '-' || LPAD(sequence_num::TEXT, 6, '0');
    
    RETURN new_folio;
END;
$$;

-- 14. Function for automatic profile creation when user signs up
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
SECURITY DEFINER
LANGUAGE plpgsql
AS $$
BEGIN
    INSERT INTO public.user_profiles (id, email, full_name, role)
    VALUES (
        NEW.id, 
        NEW.email, 
        COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1)),
        COALESCE(NEW.raw_user_meta_data->>'role', 'taxpayer')::public.user_role
    );
    RETURN NEW;
END;
$$;

-- 15. Trigger for new user creation
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 16. Function to update updated_at timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$;

-- 17. Add update triggers to tables with updated_at
CREATE TRIGGER update_user_profiles_updated_at
    BEFORE UPDATE ON public.user_profiles
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

CREATE TRIGGER update_refund_requests_updated_at
    BEFORE UPDATE ON public.refund_requests
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

CREATE TRIGGER update_documents_updated_at
    BEFORE UPDATE ON public.documents
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

-- 18. Create mock data for testing
DO $$
DECLARE
    admin_uuid UUID := gen_random_uuid();
    taxpayer_uuid UUID := gen_random_uuid();
    refund1_uuid UUID := gen_random_uuid();
    refund2_uuid UUID := gen_random_uuid();
    refund3_uuid UUID := gen_random_uuid();
BEGIN
    -- Create auth users with required fields
    INSERT INTO auth.users (
        id, instance_id, aud, role, email, encrypted_password, email_confirmed_at,
        created_at, updated_at, raw_user_meta_data, raw_app_meta_data,
        is_sso_user, is_anonymous, confirmation_token, confirmation_sent_at,
        recovery_token, recovery_sent_at, email_change_token_new, email_change,
        email_change_sent_at, email_change_token_current, email_change_confirm_status,
        reauthentication_token, reauthentication_sent_at, phone, phone_change,
        phone_change_token, phone_change_sent_at
    ) VALUES
        (admin_uuid, '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated',
         'admin@devolusat.mx', crypt('admin123', gen_salt('bf', 10)), now(), now(), now(),
         '{"full_name": "Administrador SAT", "role": "admin"}'::jsonb, '{"provider": "email", "providers": ["email"]}'::jsonb,
         false, false, '', null, '', null, '', '', null, '', 0, '', null, null, '', '', null),
        (taxpayer_uuid, '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated',
         'usuario@ejemplo.mx', crypt('usuario123', gen_salt('bf', 10)), now(), now(), now(),
         '{"full_name": "Juan Pérez González", "role": "taxpayer"}'::jsonb, '{"provider": "email", "providers": ["email"]}'::jsonb,
         false, false, '', null, '', null, '', '', null, '', 0, '', null, null, '', '', null);

    -- Create sample refund requests
    INSERT INTO public.refund_requests (id, folio, user_id, refund_type, tax_year, tax_period, requested_amount, status, estimated_completion_date)
    VALUES
        (refund1_uuid, 'DEV-2024-001234', taxpayer_uuid, 'iva'::public.refund_type, 2024, '2024-01', 45000.00, 'en_proceso'::public.refund_status, CURRENT_DATE + INTERVAL '15 days'),
        (refund2_uuid, 'DEV-2024-001189', taxpayer_uuid, 'isr'::public.refund_type, 2023, '2023-12', 28500.00, 'aprobado'::public.refund_status, CURRENT_DATE),
        (refund3_uuid, 'DEV-2024-001156', taxpayer_uuid, 'salarios'::public.refund_type, 2024, '2024-02', 12300.00, 'enviado'::public.refund_status, CURRENT_DATE + INTERVAL '20 days');

    -- Create sample documents
    INSERT INTO public.documents (refund_request_id, user_id, file_name, document_type, document_status)
    VALUES
        (refund1_uuid, taxpayer_uuid, 'cfdi_enero_2024.xml', 'cfdi'::public.document_type, 'validado'::public.document_status),
        (refund1_uuid, taxpayer_uuid, 'comprobante_gastos.pdf', 'comprobante'::public.document_type, 'validado'::public.document_status),
        (refund2_uuid, taxpayer_uuid, 'declaracion_anual_2023.pdf', 'anexo'::public.document_type, 'validado'::public.document_status),
        (refund3_uuid, taxpayer_uuid, 'recibos_nomina.pdf', 'recibo'::public.document_type, 'procesando'::public.document_status);

    -- Create sample activities
    INSERT INTO public.activity_timeline (refund_request_id, user_id, activity_type, description)
    VALUES
        (refund1_uuid, taxpayer_uuid, 'solicitud_creada', 'Solicitud de devolución IVA creada'),
        (refund1_uuid, taxpayer_uuid, 'documentos_subidos', 'Se subieron 2 documentos para validación'),
        (refund1_uuid, taxpayer_uuid, 'en_proceso', 'La solicitud está siendo procesada por el SAT'),
        (refund2_uuid, taxpayer_uuid, 'solicitud_creada', 'Solicitud de devolución ISR creada'),
        (refund2_uuid, taxpayer_uuid, 'aprobado', 'Solicitud aprobada, se procesará el depósito'),
        (refund3_uuid, taxpayer_uuid, 'solicitud_creada', 'Solicitud de devolución por salarios creada');

EXCEPTION
    WHEN foreign_key_violation THEN
        RAISE NOTICE 'Foreign key error: %', SQLERRM;
    WHEN unique_violation THEN
        RAISE NOTICE 'Unique constraint error: %', SQLERRM;
    WHEN OTHERS THEN
        RAISE NOTICE 'Unexpected error: %', SQLERRM;
END $$;