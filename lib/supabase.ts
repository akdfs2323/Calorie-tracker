import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Auth helpers
export const signUp = async (email: string, password: string, fullName: string) => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: fullName,
      },
    },
  });
  return { data, error };
};

export const signIn = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  return { data, error };
};

export const signOut = async () => {
  const { error } = await supabase.auth.signOut();
  return { error };
};

export const getCurrentUser = async () => {
  const { data: { user } } = await supabase.auth.getUser();
  return user;
};

// Profile helpers
export const getUserProfile = async (userId: string) => {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('user_id', userId)
    .maybeSingle();
  return { data, error };
};

export const upsertUserProfile = async (profile: any) => {
  const { data, error } = await supabase
    .from('profiles')
    .upsert(profile)
    .select()
    .single();
  return { data, error };
};

// Calorie entries helpers
export const addCalorieEntry = async (entry: any) => {
  const { data, error } = await supabase
    .from('calorie_entries')
    .insert(entry)
    .select()
    .single();
  return { data, error };
};

export const getCalorieEntries = async (userId: string, date?: string) => {
  let query = supabase
    .from('calorie_entries')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (date) {
    query = query.eq('entry_date', date);
  }

  const { data, error } = await query;
  return { data, error };
};

export const getDailyStats = async (userId: string, startDate: string, endDate: string) => {
  const { data, error } = await supabase
    .from('calorie_entries')
    .select('*')
    .eq('user_id', userId)
    .gte('entry_date', startDate)
    .lte('entry_date', endDate)
    .order('entry_date', { ascending: true });
  return { data, error };
};

// Chat helpers
export const saveChatMessage = async (message: any) => {
  const { data, error } = await supabase
    .from('chat_messages')
    .insert(message)
    .select()
    .single();
  return { data, error };
};

export const getChatHistory = async (userId: string, limit = 50) => {
  const { data, error } = await supabase
    .from('chat_messages')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: true })
    .limit(limit);
  return { data, error };
};
