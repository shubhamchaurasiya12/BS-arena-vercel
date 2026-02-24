// app/api/theme/route.ts
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { supabase } from '@/lib/supabase';
import { success, failure } from '@/lib/apiResponse';
import { NextResponse } from 'next/server';

/**
 * GET /api/theme
 * Fetch current user's theme preference
 */
export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Fetch user's theme from database
    const { data: user, error } = await supabase
      .from('users')
      .select('theme')
      .eq('email', session.user.email)
      .maybeSingle();

    if (error) {
      console.error('Supabase error:', error);
      return NextResponse.json(
        { success: false, message: 'Failed to fetch theme' },
        { status: 500 }
      );
    }

    // Default to 'light' if no theme set, support all three themes
    const theme = user?.theme || 'light';

    return NextResponse.json(
      success({ theme }),
      { status: 200 }
    );
  } catch (error) {
    console.error('GET /api/theme error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/theme
 * Save or update user's theme preference
 */
export async function PUT(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Parse request body
    let body: { theme?: string };
    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        { success: false, message: 'Invalid request body' },
        { status: 400 }
      );
    }

    const { theme } = body;

    // UPDATED: Validate theme value - now supports 'light', 'dark', and 'terminal'
    const validThemes = ['light', 'dark', 'terminal'];
    if (!theme || !validThemes.includes(theme)) {
      return NextResponse.json(
        { 
          success: false, 
          message: 'Invalid theme. Must be "light", "dark", or "terminal"' 
        },
        { status: 400 }
      );
    }

    // Get user ID from email
    const { data: user, error: fetchError } = await supabase
      .from('users')
      .select('id')
      .eq('email', session.user.email)
      .maybeSingle();

    if (fetchError || !user) {
      console.error('User fetch error:', fetchError);
      return NextResponse.json(
        { success: false, message: 'User not found' },
        { status: 404 }
      );
    }

    // Update user's theme in database
    const { data, error } = await supabase
      .from('users')
      .update({ theme })
      .eq('id', user.id)
      .select()
      .single();

    if (error) {
      console.error('Supabase update error:', error);
      return NextResponse.json(
        { success: false, message: 'Failed to save theme' },
        { status: 500 }
      );
    }

    // Create response with cookie
    const response = NextResponse.json(
      success({
        theme: theme,  // Return the theme we sent
        message: 'Theme updated successfully',
      }),
      { status: 200 }
    );

    // Set cookie that expires in 1 year for faster initial load
    response.cookies.set('theme', theme, {
      maxAge: 60 * 60 * 24 * 365, // 1 year
      path: '/',
      sameSite: 'lax',
    });

    return response;
  } catch (error) {
    console.error('PUT /api/theme error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}