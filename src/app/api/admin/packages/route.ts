// Force dynamic
export const dynamic = "force-dynamic";

import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin";
import { NextResponse } from "next/server";

export async function GET() {
  const { error } = await requireAdmin();
  if (error) return error;
  const packages = await prisma.package.findMany({ include: { destination: true }, orderBy: { createdAt: "desc" } });
  return NextResponse.json({ packages });
}

export async function POST(request: Request) {
  const { error } = await requireAdmin();
  if (error) return error;
  try {
    const body = await request.json();
    const pkg = await prisma.package.create({
      data: {
        destinationId: body.destinationId, title: body.title, description: body.description || "",
        duration: parseInt(body.duration), pricePerPerson: parseInt(body.pricePerPerson),
        meals: body.meals, tours: parseInt(body.tours),
        airportTransfer: body.airportTransfer === "true", privateCab: body.privateCab === "true",
        flights: body.flights === "true", label: body.label || null,
      },
      include: { destination: true },
    });
    return NextResponse.json({ pkg });
  } catch (e: any) { return NextResponse.json({ error: e.message }, { status: 500 }); }
}

export async function PUT(request: Request) {
  const { error } = await requireAdmin();
  if (error) return error;
  try {
    const body = await request.json();
    const pkg = await prisma.package.update({
      where: { id: body.id },
      data: {
        title: body.title, description: body.description || "",
        duration: parseInt(body.duration), pricePerPerson: parseInt(body.pricePerPerson),
        meals: body.meals, tours: parseInt(body.tours),
        airportTransfer: body.airportTransfer === "true", privateCab: body.privateCab === "true",
        flights: body.flights === "true", label: body.label || null,
      },
      include: { destination: true },
    });
    return NextResponse.json({ pkg });
  } catch (e: any) { return NextResponse.json({ error: e.message }, { status: 500 }); }
}

export async function DELETE(request: Request) {
  const { error } = await requireAdmin();
  if (error) return error;
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    if (!id) return NextResponse.json({ error: "ID required" }, { status: 400 });
    await prisma.package.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (e: any) { return NextResponse.json({ error: e.message }, { status: 500 }); }
}
