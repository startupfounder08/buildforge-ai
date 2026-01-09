import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { format } from "date-fns"

interface ProjectTimelineProps {
    project: any
}

export function ProjectTimeline({ project }: ProjectTimelineProps) {
    // Determine milestone position based on status
    const status = project.status
    const progress = status === 'completed' ? 100 : status === 'active' ? 50 : 10

    return (
        <Card>
            <CardHeader>
                <CardTitle>Timeline</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="relative pt-6 pb-2">
                    {/* Progress Bar */}
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                        <div
                            className="h-full bg-primary transition-all duration-500"
                            style={{ width: `${progress}%` }}
                        />
                    </div>

                    {/* Milestones */}
                    <div className="flex justify-between mt-4 text-sm text-muted-foreground">
                        <div className={`flex flex-col items-center ${progress >= 10 ? 'text-primary' : ''}`}>
                            <span className="font-medium">Created</span>
                            <span className="text-xs">{format(new Date(project.created_at), 'MMM d')}</span>
                        </div>
                        <div className={`flex flex-col items-center ${progress >= 50 ? 'text-blue-500' : ''}`}>
                            <span className="font-medium">Active</span>
                            <span className="text-xs">
                                {status === 'active' ? 'Current' : status === 'completed' ? 'Done' : 'Next'}
                            </span>
                        </div>
                        <div className={`flex flex-col items-center ${progress >= 100 ? 'text-green-500' : ''}`}>
                            <span className="font-medium">Due / Done</span>
                            <span className="text-xs">
                                {project.due_date ? format(new Date(project.due_date), 'MMM d') : 'No Date'}
                            </span>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}
