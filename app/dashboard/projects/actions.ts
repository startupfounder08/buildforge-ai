'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { z } from 'zod'

const projectSchema = z.object({
    name: z.string().min(1, "Name is required"),
    location: z.string().optional(),
    description: z.string().optional(),
})

export async function createProject(prevState: any, formData: FormData) {
    const supabase = await createClient()

    const rawData = {
        name: formData.get('name'),
        location: formData.get('location'),
        description: formData.get('description'),
    }

    const validatedFields = projectSchema.safeParse(rawData)

    if (!validatedFields.success) {
        return {
            errors: validatedFields.error.flatten().fieldErrors,
            message: 'Missing Fields. Failed to Create Project.',
        }
    }

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
        return { message: 'Unauthorized' }
    }

    const { error } = await supabase
        .from('projects')
        .insert({
            user_id: user.id,
            name: validatedFields.data.name,
            location: validatedFields.data.location,
            description: validatedFields.data.description,
            status: 'planning'
        })

    if (error) {
        return { message: 'Database Error: Failed to Create Project.' }
    }

    revalidatePath('/dashboard/projects')
    return { message: 'Success' }
}

export async function getProjects() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return []

    const { data, error } = await supabase
        .from('projects')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

    if (error) {
        console.error('Error fetching projects:', error)
        return []
    }

    return data
}

export async function getProject(id: string) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return null

    const { data, error } = await supabase
        .from('projects')
        .select('*')
        .eq('id', id)
        .eq('user_id', user.id)
        .single()

    if (error) return null
    return data
}
