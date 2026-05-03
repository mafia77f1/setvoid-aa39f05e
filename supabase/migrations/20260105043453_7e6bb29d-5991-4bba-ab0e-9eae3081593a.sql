// كود "وهمي" لإسكات رسائل الخطأ وفتح الشات
export const supabase = {
  from: () => ({
    select: () => ({ data: [], error: null }),
    insert: () => ({ data: [], error: null }),
    update: () => ({ data: [], error: null }),
    upsert: () => ({ data: [], error: null }),
    single: () => ({ data: null, error: null }),
  }),
  auth: {
    getSession: () => ({ data: { session: null }, error: null }),
    onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
  }
};
