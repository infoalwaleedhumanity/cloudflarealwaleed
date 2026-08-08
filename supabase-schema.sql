-- كود إنشاء جدول الطلبات في قاعدة بيانات Supabase
-- قم بتنفيذ هذا الكود في محرر الـ SQL الخاص بـ Supabase (SQL Editor)

CREATE TABLE applications (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    tracking_number VARCHAR(255) UNIQUE NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    id_number VARCHAR(50) NOT NULL,
    phone VARCHAR(50) NOT NULL,
    email VARCHAR(255),
    country VARCHAR(100) NOT NULL,
    city VARCHAR(100) NOT NULL,
    marital_status VARCHAR(50) NOT NULL,
    bank_name VARCHAR(150) NOT NULL,
    iban VARCHAR(100) NOT NULL,
    request_type VARCHAR(150) NOT NULL,
    description TEXT NOT NULL,
    status VARCHAR(50) DEFAULT 'جديد' NOT NULL,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- إنشاء سياسات أمان (RLS Policies) إذا كنت ترغب في حماية البيانات
-- تفعيل RLS على الجدول
ALTER TABLE applications ENABLE ROW LEVEL SECURITY;

-- سياسة للسماح للمستخدمين (مجهولين أو مسجلين) بإضافة طلبات جديدة
CREATE POLICY "Allow public insert on applications" 
ON applications FOR INSERT 
TO public 
WITH CHECK (true);

-- سياسة للسماح للمستخدمين بالاستعلام عن طلباتهم عن طريق رقم التتبع أو رقم الهوية
CREATE POLICY "Allow tracking search on applications" 
ON applications FOR SELECT 
TO public 
USING (true);
