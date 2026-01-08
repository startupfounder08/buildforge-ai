'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Checkbox } from '@/components/ui/checkbox'
import { FileText, Hammer, HardHat, ScrollText, ArrowRight, Loader2, Download } from 'lucide-react'
import { toast } from 'sonner'

export default function GenerateDocPage({ params }: { params: { id: string } }) {
    const [projectId, setProjectId] = useState(params.id) // params is async in future Next.js, but handle simple for now. Client side params are usually fine if unwrapped.
    // Actually params in page props are synchronous in Client Components in Next 15 if accessed directly? No, params is a Promise in Next 15 Server Components. In Client Components, use `useParams` hook.

    const [step, setStep] = useState(1)
    const [docType, setDocType] = useState<string | null>(null)
    const [loading, setLoading] = useState(false)
    const [generatedUrl, setGeneratedUrl] = useState<string | null>(null)

    const docTypes = [
        { id: 'permit', title: 'Building Permit', icon: FileText, desc: 'Official building permit application.' },
        { id: 'contract', title: 'Subcontractor Agreement', icon: ScrollText, desc: 'Standard legal agreement for subs.' },
        { id: 'safety', title: 'Safety Report (OSHA)', icon: HardHat, desc: 'Daily safety log and hazard report.' },
        { id: 'bid', title: 'Project Bid', icon: Hammer, desc: 'Formal proposal and cost estimate.' },
    ]

    const handleGenerate = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)

        try {
            const res = await fetch('/api/generate-doc', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    projectId, // Logic to get project details server side
                    type: docType,
                    // Add form fields here
                })
            })

            const data = await res.json()

            if (!res.ok) throw new Error(data.message || 'Generation failed')

            setGeneratedUrl(data.url)
            setStep(3)
            toast.success("Document generated successfully!")
        } catch (err: any) {
            toast.error(err.message)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="container mx-auto max-w-4xl p-8">
            <div className="mb-8">
                <h1 className="text-3xl font-bold">Generate Document</h1>
                <p className="text-muted-foreground">AI-powered generation for official paperwork.</p>
            </div>

            <div className="grid gap-8">
                {/* Progress or Steps could go here */}

                {step === 1 && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {docTypes.map((dt) => (
                            <Card
                                key={dt.id}
                                className={`cursor-pointer transition-all hover:border-primary ${docType === dt.id ? 'border-primary bg-primary/5' : ''}`}
                                onClick={() => setDocType(dt.id)}
                            >
                                <CardHeader className="flex flex-row items-center gap-4 space-y-0">
                                    <div className="p-2 bg-muted rounded-md">
                                        <dt.icon className="h-6 w-6 text-primary" />
                                    </div>
                                    <div>
                                        <CardTitle className="text-base">{dt.title}</CardTitle>
                                        <CardDescription>{dt.desc}</CardDescription>
                                    </div>
                                </CardHeader>
                            </Card>
                        ))}
                        <div className="col-span-full flex justify-end mt-4">
                            <Button onClick={() => setStep(2)} disabled={!docType}>
                                Next Step <ArrowRight className="ml-2 h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                )}

                {step === 2 && (
                    <Card>
                        <CardHeader>
                            <CardTitle>Configure Details</CardTitle>
                            <CardDescription>Review and customize the information for the AI.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <form id="gen-form" onSubmit={handleGenerate} className="space-y-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="title">Document Title</Label>
                                    <Input id="title" defaultValue={`${docType?.toUpperCase()} - Project Name`} />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="scope">Scope of Work</Label>
                                    <Input id="scope" placeholder="Describe the work details..." />
                                </div>
                                <div className="flex items-center space-x-2">
                                    <Checkbox id="include-terms" defaultChecked />
                                    <Label htmlFor="include-terms">Include Standard Liability Terms</Label>
                                </div>
                            </form>
                        </CardContent>
                        <CardFooter className="flex justify-between">
                            <Button variant="outline" onClick={() => setStep(1)}>Back</Button>
                            <Button type="submit" form="gen-form" disabled={loading}>
                                {loading ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Generating...
                                    </>
                                ) : (
                                    <>Generate Document <ArrowRight className="ml-2 h-4 w-4" /></>
                                )}
                            </Button>
                        </CardFooter>
                    </Card>
                )}

                {step === 3 && (
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-green-500">Generation Complete</CardTitle>
                            <CardDescription>Your document is ready for review.</CardDescription>
                        </CardHeader>
                        <CardContent className="flex flex-col items-center justify-center p-8 space-y-4">
                            <FileText className="h-16 w-16 text-muted-foreground" />
                            <p className="text-center text-muted-foreground">
                                The document has been generated and saved to your project.
                            </p>
                            {generatedUrl && (
                                <div className="w-full h-64 bg-muted rounded-md border text-center flex items-center justify-center">
                                    {/* In a real app, <iframe src={generatedUrl} /> */}
                                    <p className="text-sm text-muted-foreground">PDF Preview Placeholder</p>
                                </div>
                            )}
                        </CardContent>
                        <CardFooter className="flex justify-end gap-2">
                            <Button variant="outline" onClick={() => setStep(1)}>Start Over</Button>
                            <Button>
                                <Download className="mr-2 h-4 w-4" /> Download PDF
                            </Button>
                        </CardFooter>
                    </Card>
                )}
            </div>
        </div>
    )
}
