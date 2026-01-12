import { NextResponse } from 'next/server';

export async function POST(req: Request) {
    try {
        const { projectType, description } = await req.json();

        // In a real app, call OpenAI here.
        // const completion = await openai.chat.completions.create({...})

        // Mock response for MVP
        const milestones = [
            { title: "Site Survey & Clearing", offsetStart: 0, duration: 5 },
            { title: "Foundation Pour", offsetStart: 7, duration: 3 },
            { title: "Framing & Structural", offsetStart: 12, duration: 10 },
            { title: "Electrical & Plumbing Rough-in", offsetStart: 25, duration: 7 },
            { title: "Final Inspection", offsetStart: 40, duration: 1 }
        ];

        return NextResponse.json({ milestones });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to generate' }, { status: 500 });
    }
}
