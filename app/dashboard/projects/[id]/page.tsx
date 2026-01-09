import { getProject } from '../actions'
import { notFound } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { FileText, AlertTriangle, ChevronLeft } from 'lucide-react'
import Link from 'next/link'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ProjectTimeline } from '@/components/projects/ProjectTimeline'

export default async function ProjectPage({ params }: { params: { id: string } }) {
    const { id } = await params
    const project = await getProject(id)

    if (!project) {
        notFound()
    }

    return (
        <div className="flex flex-col gap-6 p-4 md:p-8">
            <div className="flex items-center gap-2">
                <Button variant="ghost" size="sm" asChild className="-ml-2">
                    <Link href="/dashboard/projects">
                        <ChevronLeft className="mr-2 h-4 w-4" /> Back to Projects
                    </Link>
                </Button>
            </div>

            <div className="flex flex-col gap-2">
                <h2 className="text-3xl font-bold tracking-tight">{project.name}</h2>
                <p className="text-muted-foreground flex items-center gap-2">
                    {project.location} • <span className="uppercase text-xs font-semibold bg-primary/10 text-primary px-2 py-0.5 rounded">{project.status}</span>
                </p>
            </div>

            <Tabs defaultValue="overview" className="space-y-4">
                <TabsList>
                    <TabsTrigger value="overview">Overview</TabsTrigger>
                    <TabsTrigger value="timeline">Timeline</TabsTrigger>
                    <TabsTrigger value="documents">Documents</TabsTrigger>
                    <TabsTrigger value="notes">Notes</TabsTrigger>
                </TabsList>

                <TabsContent value="overview" className="space-y-4">
                    <div className="grid gap-6 md:grid-cols-2">
                        {/* Documents Section */}
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <div className="space-y-1">
                                    <CardTitle className="text-xl">Documents</CardTitle>
                                    <CardDescription>Permits, Contracts, Logs</CardDescription>
                                </div>
                                <Button asChild size="sm">
                                    <Link href={`/dashboard/projects/${id}/generate`}>
                                        <FileText className="mr-2 h-4 w-4" /> Generate New
                                    </Link>
                                </Button>
                            </CardHeader>
                            <CardContent>
                                <div className="text-sm text-muted-foreground py-8 text-center">
                                    No documents generated yet.
                                </div>
                            </CardContent>
                        </Card>

                        {/* AI Predictions Section */}
                        <Card className="border-yellow-500/20 bg-yellow-500/5">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2 text-yellow-500">
                                    <AlertTriangle className="h-5 w-5" /> AI Risk Assessment
                                </CardTitle>
                                <CardDescription>
                                    Real-time analysis of project risks
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="text-sm text-muted-foreground">
                                    AI analysis not yet run. Add more project details or documents to generate predictions.
                                </div>
                                <Button className="mt-4" variant="outline">Run Analysis</Button>
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>

                <TabsContent value="timeline">
                    <ProjectTimeline project={project} />
                </TabsContent>

                <TabsContent value="documents">
                    <Card>
                        <CardHeader><CardTitle>Documents</CardTitle></CardHeader>
                        <CardContent>Full document list coming soon.</CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="notes">
                    <Card>
                        <CardHeader><CardTitle>Notes</CardTitle></CardHeader>
                        <CardContent>
                            <p className="whitespace-pre-wrap text-sm">{project.notes || 'No notes added.'}</p>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    )
}
