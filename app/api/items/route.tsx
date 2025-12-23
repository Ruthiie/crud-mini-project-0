import { NextResponse } from "next/server";

let items = [
  { id: 1, name: "Item One" },
  { id: 2, name: "Item Two" },
  { id: 3, name: "Item Three" },
  { id: 4, name: "Item Four" },
  { id: 5, name: "Item Five" },
  { id: 6, name: "Item Six" },
  { id: 7, name: "Item Seven" },
  { id: 8, name: "Item Eight" },
];

// GET all items
export async function GET() {
  return NextResponse.json(items);
}

// CREATE new item
export async function POST(req: Request) {
  const body = await req.json();

  if (!body.name) {
    return NextResponse.json(
      { error: "Name is required" },
      { status: 400 }
    );
  }

  const newItem = {
    id: Date.now(),
    name: body.name,
  };

  items.push(newItem);

  return NextResponse.json(newItem);
}

// UPDATE item
export async function PUT(req: Request) {
  const { id, name } = await req.json();

  items = items.map((item) =>
    item.id === id ? { ...item, name } : item
  );

  return NextResponse.json({ success: true });
}

// DELETE item
export async function DELETE(req: Request) {
  const { id } = await req.json();
  items = items.filter((item) => item.id !== id);
  return NextResponse.json({ success: true });
}
