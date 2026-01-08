import { createClient } from '@/lib/supabase/server'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { FileText, Download } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export default async function DocumentsPage() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    // Fetch documents (mocked or real)
    // Ideally we join with projects to get project name
    const { data: documents } = await supabase
        .from('documents')
        .select(`
        *,
        projects ( name )
    `)
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false })

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Documents</h1>
                <p className="text-muted-foreground">Manage all your generated permits, contracts, and bids.</p>
            </div>

            {documents && documents.length > 0 ? (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {documents.map((doc: any) => (
                        <Card key={doc.id} className="hover:bg-accent/50 transition-colors">
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">
                                    {doc.title || doc.type.toUpperCase()}
                                </CardTitle>
                                <FileText className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold truncate">{doc.projects?.name}</div>
                                <p className="text-xs text-muted-foreground capitalize">
                                    {doc.type} • {new Date(doc.created_at).toLocaleDateString()}
                                </p>
                                <Button variant="outline" size="sm" className="mt-4 w-full" asChild>
                                    <Link href={doc.pdf_url || '#'} target="_blank">
                                        <Download className="mr-2 h-4 w-4" /> Download PDF
                                    </Link>
                                </Button>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center h-[400px] border border-dashed rounded-lg">
                    <div className="text-center space-y-2">
                        <FileText className="h-10 w-10 text-muted-foreground mx-auto" />
                        <h3 className="text-lg font-semibold">No documents yet</h3>
                        <p className="text-muted-foreground">Go to a Project to generate your first document.</p>
                        <Button asChild className="mt-4">
                            <Link href="/dashboard/projects">View Projects</Link>
                        </Button>
                    </div>
                </div>
            )}
        </div>
    )
}
