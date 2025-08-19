import { put } from '@vercel/blob';
import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/services/clerk';
import { canAccessAdminPages } from '@/permissons/general';
import { env } from '@/data/env/server';

export async function POST(request: NextRequest) {
  try {
    // Check authentication and permissions
    const currentUser = await getCurrentUser({ allData: true });
    
    if (!currentUser || !currentUser.user) {
      return NextResponse.json({ error: 'You must be logged in to upload images' }, { status: 401 });
    }

    if (!canAccessAdminPages({ role: currentUser.role })) {
      return NextResponse.json({ error: 'You do not have permission to upload images' }, { status: 403 });
    }

    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      return NextResponse.json({ error: 'File must be an image' }, { status: 400 });
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json({ error: 'File size must be less than 5MB' }, { status: 400 });
    }

    // Generate unique filename
    const timestamp = Date.now();
    const sanitizedName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
    const filename = `articles/${timestamp}_${sanitizedName}`;

    // Upload to Vercel Blob
    const blob = await put(filename, file, {
      access: 'public',
      token: env.BLOB_READ_WRITE_TOKEN,
    });

    return NextResponse.json({ 
      url: blob.url,
      filename: blob.pathname 
    });

  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 });
  }
}