import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { CalendarClock } from "lucide-react"
import { format } from "date-fns"

interface DeadlineItem {
    id: string
    title: string
    dueDate: string | null
    status?: string
}

interface UpcomingDeadlinesProps {
    deadlines: DeadlineItem[]
}

export function UpcomingDeadlines({ deadlines }: UpcomingDeadlinesProps) {
    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <CalendarClock className="h-4 w-4 text-orange-500" />
                    Upcoming Deadlines
                </CardTitle>
                <CardDescription>Target dates for your active projects</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    {deadlines.length === 0 && (
                        <p className="text-sm text-muted-foreground">No upcoming deadlines.</p>
                    )}
                    {deadlines.map((item) => (
                        <div key={item.id} className="flex items-center justify-between border-b pb-2 last:border-0 last:pb-0">
                            <div>
                                <p className="text-sm font-medium">{item.title}</p>
                                <p className="text-xs text-muted-foreground capitalize">{item.status || 'Active'}</p>
                            </div>
                            <div className="text-xs font-mono bg-accent text-accent-foreground px-2 py-1 rounded">
                                {item.dueDate ? format(new Date(item.dueDate), 'MMM dd, yyyy') : 'No Date'}
                            </div>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    )
}
