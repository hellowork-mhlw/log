import { exec } from 'child_process'
import { promisify } from 'util'

const execAsync = promisify(exec)

export async function GET(request) {
    try {
        return Response.json(await execAsync('ls -lh'))
    } catch (error) {
        return Response.json(error.message, { status: 400 })
    }
}
