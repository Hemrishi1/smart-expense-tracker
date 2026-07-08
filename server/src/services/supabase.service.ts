import { createClient } from '@supabase/supabase-js';

// These will be loaded from process.env, but we don't throw an error immediately 
// so the app doesn't crash if they aren't set yet.
const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_KEY || '';

export const supabase = (supabaseUrl && supabaseKey) 
  ? createClient(supabaseUrl, supabaseKey) 
  : null;

export const uploadAvatarToSupabase = async (base64Image: string, userId: string): Promise<string> => {
  if (!supabase) {
    throw new Error('Supabase is not configured. Please add SUPABASE_URL and SUPABASE_KEY to your .env file.');
  }

  // Make sure it's a base64 image
  if (!base64Image.startsWith('data:image/')) {
    return base64Image; // Might already be a URL
  }

  // Extract base64 data and mime type
  // Format: data:image/jpeg;base64,/9j/4AAQSkZJRg...
  const matches = base64Image.match(/^data:([A-Za-z-+/]+);base64,(.+)$/);
  
  if (!matches || matches.length !== 3) {
    throw new Error('Invalid base64 image string');
  }

  const mimeType = matches[1];
  const base64Data = matches[2];
  const buffer = Buffer.from(base64Data, 'base64');
  
  // Extract extension from mime type (e.g. image/jpeg -> jpeg)
  const ext = mimeType.split('/')[1] || 'jpeg';
  // Create a unique filename: avatars/userId_timestamp.ext
  const fileName = `${userId}_${Date.now()}.${ext}`;

  const { data, error } = await supabase
    .storage
    .from('avatars')
    .upload(fileName, buffer, {
      contentType: mimeType,
      upsert: true, // Overwrite if same name exists (though timestamp prevents this)
    });

  if (error) {
    console.error('Supabase upload error:', error);
    throw new Error(`Failed to upload avatar: ${error.message}`);
  }

  // Get public URL
  const { data: { publicUrl } } = supabase
    .storage
    .from('avatars')
    .getPublicUrl(fileName);

  return publicUrl;
};
