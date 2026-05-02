// Force dynamic
export const dynamic = "force-dynamic";

import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function GET() {
  const destinations = await prisma.destination.findMany({
    include: { packages: { orderBy: { duration: 'asc' } } },
    orderBy: { name: 'asc' },
  });
  return NextResponse.json(destinations);
}
