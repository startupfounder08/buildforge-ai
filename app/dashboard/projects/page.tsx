import { getProjects } from './actions'
import { ProjectsClientWrapper } from '@/components/projects/ProjectsClientWrapper'

export default async function ProjectsPage() {
    const projects = await getProjects()

    return (
        <div className="p-4 md:p-8">
            <ProjectsClientWrapper initialProjects={projects} />
        </div>
    )
}
