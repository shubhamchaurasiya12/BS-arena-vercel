// app/api/notes/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { supabase } from '@/lib/supabase';

export async function GET(req: NextRequest) {
  try {
    // 🔐 Auth check (NextAuth session)
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    // 📥 Query params
    const { searchParams } = new URL(req.url);
    const subjectId = searchParams.get('subjectId');
    const phase = searchParams.get('phase');

    // ✅ week param removed — we fetch all weeks at once now
    if (!subjectId || !phase) {
      return NextResponse.json(
        { message: 'Missing query parameters' },
        { status: 400 }
      );
    }

    // 📚 Fetch ALL weeks for this subject in one query
    const { data, error } = await supabase
      .from('notes')
      .select('*')
      .eq('subject_id', subjectId)
      .eq('phase', phase)
      .eq('published', true)           // ✅ Only return published notes
      .order('week', { ascending: true }); // ✅ Return weeks in order

    if (error) {
      console.error('Notes API error:', error);
      return NextResponse.json(
        { message: 'Failed to fetch notes' },
        { status: 500 }
      );
    }

    return NextResponse.json(data ?? []);
  } catch (error) {
    console.error('Error fetching notes:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}