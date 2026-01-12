'use client'

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { useEffect, useState, useRef } from "react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Plus, Loader2, Calendar, CheckCircle, Clock, MoreVertical, Sparkles } from "lucide-react"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"
import { createMilestone, updateMilestoneDates, updateMilestoneStatus } from "@/app/dashboard/projects/actions"
import { format, addDays, differenceInDays } from "date-fns"
import { Badge } from "@/components/ui/badge"
import { motion, Reorder, useDragControls } from "framer-motion"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface ProjectTimelineProps {
    project: any
}

export function ProjectTimeline({ project }: ProjectTimelineProps) {
    const supabase = createClient()
    const [milestones, setMilestones] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [open, setOpen] = useState(false)
    const [creating, setCreating] = useState(false)

    // Form
    const [newMilestone, setNewMilestone] = useState({
        title: '',
        start: '',
        end: ''
    })

    const fetchMilestones = async () => {
        const { data: m } = await supabase
            .from('project_milestones')
            .select('*')
            .eq('project_id', project.id)
            .order('start_date', { ascending: true })

        setMilestones(m || [])
        setLoading(false)
    }

    useEffect(() => {
        fetchMilestones()
        const channel = supabase
            .channel('project_milestones_changes')
            .on('postgres_changes', { event: '*', schema: 'public', table: 'project_milestones', filter: `project_id=eq.${project.id}` }, () => {
                fetchMilestones()
            })
            .subscribe()

        return () => {
            supabase.removeChannel(channel)
        }
    }, [project])

    const handleCreate = async () => {
        if (!newMilestone.title || !newMilestone.start || !newMilestone.end) {
            toast.error('Please fill all fields')
            return
        }

        setCreating(true)
        try {
            const res = await createMilestone(project.id, newMilestone.title, newMilestone.start, newMilestone.end)
            if (res.message === 'Success') {
                toast.success('Milestone added')
                setOpen(false)
                setNewMilestone({ title: '', start: '', end: '' })
                fetchMilestones()
            } else {
                toast.error(res.message || 'Failed to create')
            }
        } catch (e) {
            toast.error('Error creating milestone')
            console.error(e)
        } finally {
            setCreating(false)
        }
    }

    const handleStatusChange = async (id: string, currentStatus: string) => {
        const newStatus = currentStatus === 'completed' ? 'pending' : 'completed'
        // Optimistic
        setMilestones(prev => prev.map(m => m.id === id ? { ...m, status: newStatus } : m))
        await updateMilestoneStatus(id, newStatus)
    }

    // AI Stub
    const handleAISuggest = async () => {
        toast.info("AI Generation feature coming in next update!")
        // Implementation: Call api/generate-milestones
    }

    // Drag Logic (Simplified: Vertical Reorder is visual, but Data Dragging is better for Gantt)
    // For this MVP, we will stick to the List view but make it draggable or just purely interactive status
    // True Gantt requires complex canvas or SVG math. 
    // Let's implement a 'Reschedule' feature via popover effectively for now as "Drag" in a list is tricky without reordering priority.

    return (
        <Card className="min-h-[500px] flex flex-col bg-sidebar/50 backdrop-blur-sm border-sidebar-border">
            <CardHeader className="flex flex-row items-center justify-between pb-4">
                <div>
                    <CardTitle>Project Milestones</CardTitle>
                    <CardDescription>Interactive timeline. Click to toggle status.</CardDescription>
                </div>
                <div className="flex gap-2">
                    <Button variant="secondary" size="sm" className="gap-2 text-blue-400 bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/20" onClick={handleAISuggest}>
                        <Sparkles className="h-3 w-3" /> AI Suggest
                    </Button>
                    <Dialog open={open} onOpenChange={setOpen}>
                        <DialogTrigger asChild>
                            <Button variant="outline" size="sm" className="gap-2">
                                <Plus className="h-4 w-4" /> Add Milestone
                            </Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Add New Milestone</DialogTitle>
                                <DialogDescription>Create a key event or phase for this project.</DialogDescription>
                            </DialogHeader>
                            <div className="grid gap-4 py-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="title">Title</Label>
                                    <Input
                                        id="title"
                                        value={newMilestone.title}
                                        onChange={(e) => setNewMilestone({ ...newMilestone, title: e.target.value })}
                                        placeholder="e.g. Foundation Pour"
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="grid gap-2">
                                        <Label htmlFor="start">Start Date</Label>
                                        <Input
                                            id="start"
                                            type="date"
                                            value={newMilestone.start}
                                            onChange={(e) => setNewMilestone({ ...newMilestone, start: e.target.value })}
                                        />
                                    </div>
                                    <div className="grid gap-2">
                                        <Label htmlFor="end">End Date</Label>
                                        <Input
                                            id="end"
                                            type="date"
                                            value={newMilestone.end}
                                            onChange={(e) => setNewMilestone({ ...newMilestone, end: e.target.value })}
                                        />
                                    </div>
                                </div>
                            </div>
                            <DialogFooter>
                                <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
                                <Button onClick={handleCreate} disabled={creating}>
                                    {creating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                    Add Milestone
                                </Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                </div>
            </CardHeader>
            <CardContent className="flex-1">
                {loading ? (
                    <div className="flex h-64 items-center justify-center text-muted-foreground gap-2">
                        <Loader2 className="h-4 w-4 animate-spin" /> Loading timeline...
                    </div>
                ) : milestones.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-64 text-center text-muted-foreground border border-dashed rounded-lg">
                        <Calendar className="h-8 w-8 mb-2 opacity-50" />
                        <p className="text-sm">No milestones yet.</p>
                        <Button variant="link" onClick={() => setOpen(true)}>Create one now</Button>
                    </div>
                ) : (
                    <div className="relative space-y-0 pl-6 border-l border-zinc-800 ml-6 py-4">
                        {milestones.map((m, i) => {
                            const isCompleted = m.status === 'completed'
                            const isPast = new Date(m.end_date) < new Date() && !isCompleted
                            const isNext = !isCompleted && !isPast && (i === 0 || milestones[i - 1]?.status === 'completed')

                            // Visual bar width based on duration (mock or calced)
                            const duration = differenceInDays(new Date(m.end_date), new Date(m.start_date)) + 1

                            return (
                                <motion.div
                                    key={m.id}
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: i * 0.05 }}
                                    className="relative pl-8 pb-8 last:pb-2 group"
                                >
                                    {/* Timeline Connector */}
                                    <div className={`absolute -left-[29px] top-6 h-4 w-4 rounded-full border-4 ${isCompleted ? 'bg-blue-500 border-zinc-950' : isNext ? 'bg-yellow-400 animate-pulse border-zinc-950' : 'bg-zinc-800 border-zinc-950 ring-1 ring-zinc-800'}`} />

                                    <div className={`p-4 rounded-xl border transition-all duration-200 ${isCompleted ? 'bg-zinc-900/30 border-zinc-800 opacity-60' : isNext ? 'bg-gradient-to-r from-blue-500/10 to-transparent border-blue-500/20' : 'bg-card border-zinc-800 hover:border-zinc-700'}`}>
                                        <div className="flex items-start justify-between gap-4">
                                            <div className="flex items-start gap-4 flex-1">
                                                <div
                                                    className={`mt-1 cursor-pointer transition-colors p-1 rounded-full hover:bg-zinc-800 ${isCompleted ? 'text-emerald-500' : 'text-zinc-500'}`}
                                                    onClick={() => handleStatusChange(m.id, m.status)}
                                                >
                                                    <CheckCircle className={`h-5 w-5 ${isCompleted ? 'fill-emerald-500/20' : ''}`} />
                                                </div>
                                                <div className="space-y-1 w-full">
                                                    <div className="flex items-center justify-between w-full">
                                                        <h4 className={`font-semibold text-base ${isCompleted ? 'line-through text-muted-foreground' : 'text-foreground'}`}>{m.title}</h4>
                                                        <DropdownMenu>
                                                            <DropdownMenuTrigger asChild>
                                                                <Button variant="ghost" size="icon" className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity">
                                                                    <MoreVertical className="h-4 w-4" />
                                                                </Button>
                                                            </DropdownMenuTrigger>
                                                            <DropdownMenuContent align="end">
                                                                <DropdownMenuItem onClick={() => handleStatusChange(m.id, m.status)}>
                                                                    Mark as {isCompleted ? 'Pending' : 'Completed'}
                                                                </DropdownMenuItem>
                                                                {/* Edit/Delete stubs */}
                                                                <DropdownMenuItem>Edit Details</DropdownMenuItem>
                                                                <DropdownMenuItem className="text-red-500">Delete</DropdownMenuItem>
                                                            </DropdownMenuContent>
                                                        </DropdownMenu>
                                                    </div>

                                                    <div className="flex items-center gap-3 text-sm text-muted-foreground">
                                                        <div className="flex items-center gap-1">
                                                            <Calendar className="h-3 w-3" />
                                                            <span>{format(new Date(m.start_date), 'MMM d')} - {format(new Date(m.end_date), 'MMM d')}</span>
                                                        </div>
                                                        <span className="text-xs px-2 py-0.5 rounded-full bg-secondary/50 border border-border/50">
                                                            {duration} days
                                                        </span>
                                                        {isPast && <Badge variant="destructive" className="h-5 text-[10px] px-1.5">Overdue</Badge>}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            )
                        })}
                    </div>
                )}
            </CardContent>
        </Card>
    )
}
