import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { createServiceClient } from '@/lib/supabase/server'

function getExpectedToken() {
  return Buffer.from(`65d-admin:${process.env.ADMIN_PASSWORD}`).toString('base64')
}

async function checkAuth() {
  const cookieStore = await cookies()
  return cookieStore.get('admin-session-v1')?.value === getExpectedToken()
}

export async function GET(_req: NextRequest) {
  if (!await checkAuth()) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const supabase = createServiceClient()
  const { data, error } = await supabase
    .from('subscriptions')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data ?? [])
}
