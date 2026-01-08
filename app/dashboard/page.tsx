import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { createClient } from "@/lib/supabase/server"

export default async function DashboardPage() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    // In real app, fetch stats here

    return (
        <div className="flex flex-1 flex-col gap-4 p-4">
            <div className="grid gap-4 md:grid-cols-3">
                <Card>
                    <CardHeader>
                        <CardTitle>Active Projects</CardTitle>
                        <CardDescription>Current ongoing sites</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">12</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle>Documents Generated</CardTitle>
                        <CardDescription>This month</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">34</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle>Subscription</CardTitle>
                        <CardDescription>Current Plan</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">Free</div>
                    </CardContent>
                </Card>
            </div>
            <div className="min-h-[100vh] flex-1 rounded-xl bg-muted/50 md:min-h-min p-6">
                <h2 className="text-lg font-semibold mb-4">Recent Activity</h2>
                <div className="text-sm text-muted-foreground">No recent activity found.</div>
            </div>
        </div>
    )
}
