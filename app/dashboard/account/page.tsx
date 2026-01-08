'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { CreditCard, User, Shield, BarChart2, Trash2, CheckCircle2 } from 'lucide-react'
import { toast } from 'sonner'
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js'
import { Bar } from 'react-chartjs-2'

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
)

export default function AccountPage() {
    // Mock user for client interactions
    const user = {
        fullName: 'John Doe',
        email: 'john@example.com',
        company: 'Acme Construction',
        plan: 'free',
        usage: [2, 5, 3, 8, 1, 4] // Mock usage data last 6 months
    }

    const handleUpdate = (e: React.FormEvent) => {
        e.preventDefault()
        toast.success("Profile updated")
    }

    const handlePasswordChange = (e: React.FormEvent) => {
        e.preventDefault()
        toast.success("Password updated")
    }

    const handleDelete = () => {
        if (confirm("Are you sure? This is irreversible.")) {
            toast.error("Account scheduled for deletion.")
        }
    }

    const usageData = {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
        datasets: [
            {
                label: 'Documents Generated',
                data: user.usage,
                backgroundColor: 'rgba(0, 71, 171, 0.7)', // Cobalt Blue
            },
        ],
    };

    return (
        <div className="container max-w-5xl space-y-8">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Account Settings</h1>
                <p className="text-muted-foreground">Manage your profile, subscription, and security.</p>
            </div>

            <Tabs defaultValue="profile" className="w-full">
                <TabsList className="grid w-full grid-cols-4 lg:w-[400px]">
                    <TabsTrigger value="profile">Profile</TabsTrigger>
                    <TabsTrigger value="subscription">Billing</TabsTrigger>
                    <TabsTrigger value="usage">Usage</TabsTrigger>
                    <TabsTrigger value="security">Security</TabsTrigger>
                </TabsList>

                {/* PROFILE TAB */}
                <TabsContent value="profile" className="space-y-4 mt-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>Personal Information</CardTitle>
                            <CardDescription>Update your public profile details.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <form id="profile-form" onSubmit={handleUpdate} className="space-y-4">
                                <div className="grid gap-2">
                                    <Label>Full Name</Label>
                                    <Input defaultValue={user.fullName} />
                                </div>
                                <div className="grid gap-2">
                                    <Label>Email</Label>
                                    <Input defaultValue={user.email} disabled className="bg-muted" />
                                </div>
                                <div className="grid gap-2">
                                    <Label>Company</Label>
                                    <Input defaultValue={user.company} />
                                </div>
                            </form>
                        </CardContent>
                        <CardFooter className="border-t px-6 py-4">
                            <Button type="submit" form="profile-form">Save Changes</Button>
                        </CardFooter>
                    </Card>

                    <Card className="border-destructive/50">
                        <CardHeader>
                            <CardTitle className="text-destructive flex items-center gap-2">
                                <Trash2 className="h-5 w-5" /> Danger Zone
                            </CardTitle>
                            <CardDescription>
                                Irreversible actions. Proceed with caution.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm text-muted-foreground mb-4">
                                Deleting your account will remove all projects, documents, and data associated with it.
                            </p>
                            <Button variant="destructive" onClick={handleDelete}>Delete Account</Button>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* SUBSCRIPTION TAB */}
                <TabsContent value="subscription" className="space-y-4 mt-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>Current Plan</CardTitle>
                            <CardDescription>Manage your subscription tier.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="flex items-center justify-between p-4 border rounded-lg bg-secondary/20">
                                <div className="flex items-center gap-4">
                                    <div className="p-2 bg-primary/10 rounded-full">
                                        <CreditCard className="h-6 w-6 text-primary" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-lg flex items-center gap-2">
                                            {user.plan === 'free' ? 'Free Plan' : 'Pro Plan'}
                                            {user.plan === 'free' && <Badge variant="secondary">Current</Badge>}
                                        </h3>
                                        <p className="text-sm text-muted-foreground">Basic access to document generation.</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <span className="text-2xl font-bold">€0</span>/mo
                                </div>
                            </div>

                            <div className="grid gap-2">
                                <h4 className="font-medium text-sm">Plan Features</h4>
                                <ul className="grid gap-2 text-sm text-muted-foreground">
                                    <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-green-500" /> 5 Documents / Month</li>
                                    <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-green-500" /> Basic PDF Generation</li>
                                    <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-muted-foreground" /> No AI Predictions (Pro only)</li>
                                    <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-muted-foreground" /> Watermarked Documents</li>
                                </ul>
                            </div>
                        </CardContent>
                        <CardFooter className="border-t px-6 py-4 flex justify-end">
                            <Button className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white border-0">
                                Upgrade to Pro (€49/mo)
                            </Button>
                        </CardFooter>
                    </Card>
                </TabsContent>

                {/* USAGE TAB */}
                <TabsContent value="usage" className="space-y-4 mt-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>Usage Analytics</CardTitle>
                            <CardDescription>Document generation history over the last 6 months.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="h-[300px] w-full">
                                <Bar options={{ responsive: true, maintainAspectRatio: false }} data={usageData} />
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* SECURITY TAB */}
                <TabsContent value="security" className="space-y-4 mt-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>Password & Security</CardTitle>
                            <CardDescription>Manage your access credentials.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <form id="sec-form" onSubmit={handlePasswordChange} className="space-y-4">
                                <div className="grid gap-2">
                                    <Label>Current Password</Label>
                                    <Input type="password" />
                                </div>
                                <div className="grid gap-2">
                                    <Label>New Password</Label>
                                    <Input type="password" />
                                </div>
                                <div className="grid gap-2">
                                    <Label>Confirm Password</Label>
                                    <Input type="password" />
                                </div>
                            </form>
                        </CardContent>
                        <CardFooter className="border-t px-6 py-4">
                            <Button type="submit" form="sec-form" variant="outline">Update Password</Button>
                        </CardFooter>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    )
}
