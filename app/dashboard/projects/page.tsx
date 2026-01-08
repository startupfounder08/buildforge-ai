import { Suspense } from 'react'
import { getProjects } from './actions'
import { NewProjectDialog } from '@/components/projects/NewProjectDialog'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table'
import Link from 'next/link'
import { Badge } from '@/components/ui/badge' // Need Badge? I'll stick to text or install badge. Text is fine.
import { format } from 'date-fns'

export default async function ProjectsPage() {
    const projects = await getProjects()

    return (
        <div className="flex flex-col gap-4 p-4 md:p-8">
            <div className="flex items-center justify-between space-y-2">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight">Projects</h2>
                    <p className="text-muted-foreground">
                        Manage your construction sites and paperwork.
                    </p>
                </div>
                <div className="flex items-center space-x-2">
                    <NewProjectDialog />
                </div>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>All Projects</CardTitle>
                    <CardDescription>( {projects.length} Total )</CardDescription>
                </CardHeader>
                <CardContent>
                    {projects.length === 0 ? (
                        <div className="text-center py-10 text-muted-foreground">
                            No projects found. Create one to get started.
                        </div>
                    ) : (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Name</TableHead>
                                    <TableHead>Location</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Created</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {projects.map((project: any) => (
                                    <TableRow key={project.id}>
                                        <TableCell className="font-medium">
                                            <Link href={`/dashboard/projects/${project.id}`} className="hover:underline">
                                                {project.name}
                                            </Link>
                                        </TableCell>
                                        <TableCell>{project.location || 'N/A'}</TableCell>
                                        <TableCell>
                                            <span className={`px-2 py-1 rounded text-xs font-semibold ${project.status === 'active' ? 'bg-green-500/20 text-green-500' : 'bg-yellow-500/20 text-yellow-500'}`}>
                                                {project.status?.toUpperCase()}
                                            </span>
                                        </TableCell>
                                        <TableCell>{format(new Date(project.created_at), 'MMM d, yyyy')}</TableCell>
                                        <TableCell className="text-right">
                                            <Link href={`/dashboard/projects/${project.id}`} className="text-primary hover:underline">
                                                View
                                            </Link>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    )}
                </CardContent>
            </Card>
        </div>
    )
}
