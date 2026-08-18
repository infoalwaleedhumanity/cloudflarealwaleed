-- كود إنشاء جدول الطلبات في قاعدة بيانات Supabase
-- قم بتنفيذ هذا الكود في محرر الـ SQL الخاص بـ Supabase (SQL Editor)

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

CREATE TABLE IF NOT EXISTS applications (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
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

-- إنشاء سياسات أمان (RLS Policies)
-- تفعيل RLS على الجدول
ALTER TABLE applications ENABLE ROW LEVEL SECURITY;

-- سياسة للسماح للمستخدمين (مجهولين أو مسجلين) بإضافة طلبات جديدة
CREATE POLICY "Allow public insert on applications"
ON applications FOR INSERT
TO public
WITH CHECK (true);

-- ⚠️ تنبيه أمني هام:
-- لا تُنشئ سياسة SELECT عامة (USING (true)) على هذا الجدول أبدًا.
-- الجدول يحتوي بيانات حساسة (رقم الهوية، رقم الآيبان، اسم البنك، رقم الهاتف)
-- وأي سياسة SELECT مفتوحة تسمح لأي زائر يملك مفتاح anon (وهو مفتاح عام
-- موجود داخل كود الموقع نفسه) بسحب بيانات كل المتقدمين دفعة واحدة عبر واجهة
-- Supabase مباشرة، بدون حتى المرور بالموقع.
--
-- الحل الآمن: لا تسمح بقراءة الجدول مباشرة إطلاقًا (لا توجد سياسة SELECT هنا)،
-- واستخدم بدلاً من ذلك الدالة الآمنة التالية للبحث عن طلب واحد فقط في كل مرة.

-- دالة آمنة للبحث عن طلب محدد (برقم التتبع أو رقم الهوية) فقط،
-- بدل السماح بقراءة الجدول كاملاً
CREATE OR REPLACE FUNCTION get_application_status(p_value TEXT, p_type TEXT)
RETURNS SETOF applications
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF p_type = 'tracking_number' THEN
    RETURN QUERY
      SELECT * FROM applications
      WHERE tracking_number = p_value
      ORDER BY created_at DESC
      LIMIT 1;
  ELSIF p_type = 'id_number' THEN
    RETURN QUERY
      SELECT * FROM applications
      WHERE id_number = p_value
      ORDER BY created_at DESC
      LIMIT 1;
  END IF;
END;
$$;

-- السماح للزوار المجهولين باستدعاء دالة البحث المحدد فقط (وليس قراءة الجدول كاملاً)
GRANT EXECUTE ON FUNCTION get_application_status(TEXT, TEXT) TO anon, authenticated;

-- ============================================
-- جدول رسائل نموذج التواصل (Contact Messages)
-- ============================================
CREATE TABLE IF NOT EXISTS contact_messages (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(50),
    subject VARCHAR(150) NOT NULL,
    message TEXT NOT NULL,
    status VARCHAR(50) DEFAULT 'جديدة' NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;

-- السماح بإرسال رسالة فقط (بدون قراءة رسائل الآخرين)
CREATE POLICY "Allow public insert on contact_messages"
ON contact_messages FOR INSERT
TO public
WITH CHECK (true);
-- ملاحظة: عمدًا لا توجد سياسة SELECT هنا؛ الوصول لقراءة الرسائل يجب أن
-- يتم من لوحة تحكم Supabase مباشرة (بصلاحية service_role) لا من المتصفح.
CREATE TABLE IF NOT EXISTS newsletter_subscribers (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    subscribed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

ALTER TABLE newsletter_subscribers ENABLE ROW LEVEL SECURITY;

-- السماح للزوار بالاشتراك فقط (بدون قراءة قائمة المشتركين)
CREATE POLICY "Allow public insert on newsletter_subscribers"
ON newsletter_subscribers FOR INSERT
TO public
WITH CHECK (true);
-- ملاحظة: عمدًا لا توجد سياسة SELECT هنا لمنع أي زائر من الاطلاع على
-- قائمة بريد باقي المشتركين.
