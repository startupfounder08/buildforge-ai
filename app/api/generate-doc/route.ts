import { NextResponse } from 'next/server'
import { PDFDocument, StandardFonts, rgb, degrees } from 'pdf-lib'
import OpenAI from 'openai'
import { createClient } from '@/lib/supabase/server'

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
})

export async function POST(req: Request) {
    try {
        const { projectId, type, title } = await req.json()

        const supabase = await createClient()
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })

        // Fetch Project Data
        const { data: project } = await supabase.from('projects').select('*').eq('id', projectId).single()

        let content = ""

        if (process.env.OPENAI_API_KEY && process.env.OPENAI_API_KEY !== 'sk-proj-placeholder') {
            // Real AI Generation
            const completion = await openai.chat.completions.create({
                messages: [
                    { role: "system", content: "You are a legal document assistant for construction. Generate a professional document content based on the type provided." },
                    { role: "user", content: `Generate a ${type} for project ${project?.name || 'Unknown'} located at ${project?.location}.` }
                ],
                model: "gpt-4o",
            });
            content = completion.choices[0].message.content || "Content generation failed."
        } else {
            // Mock content
            content = `MOCK DOCUMENT - ${type?.toUpperCase()}\n\nProject: ${project?.name}\nLocation: ${project?.location}\n\nThis is a generated document for review purposes only.\n\n1. SCOPE\nThe scope of work includes...\n\n2. TERMS\nStandard terms apply.`
        }

        // PDF Generation
        const pdfDoc = await PDFDocument.create()
        const page = pdfDoc.addPage()
        const { width, height } = page.getSize()
        const font = await pdfDoc.embedFont(StandardFonts.Helvetica)
        const fontSize = 12

        // Simple text wrapping logic or just dump text
        page.drawText(content, {
            x: 50,
            y: height - 4 * fontSize,
            size: fontSize,
            font: font,
            color: rgb(0, 0, 0),
            maxWidth: width - 100,
            lineHeight: 14,
        })

        // Watermark
        page.drawText('MOCK - NOT OFFICIAL', {
            x: width / 2 - 100,
            y: height / 2,
            size: 50,
            font: font,
            color: rgb(0.9, 0.9, 0.9),
            rotate: degrees(45),
        })

        const pdfBytes = await pdfDoc.save()

        // Upload to Supabase Storage (Mock URL for now as bucket might not exist)
        // await supabase.storage.from('documents').upload(...)

        // Save metadata to DB
        await supabase.from('documents').insert({
            project_id: projectId,
            user_id: user.id,
            type: type,
            title: title || type,
            content_json: { raw: content },
            // pdf_url: publicUrl
        })

        return NextResponse.json({ url: '#', message: 'Generated' })
    } catch (err: any) {
        console.error(err)
        return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 })
    }
}
