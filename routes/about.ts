import { Router, RouterContext } from "https://deno.land/x/oak@v9.0.0/mod.ts"
import { About } from '../types.ts'

const router = new Router()

router.get('/', (ctx: RouterContext) => {
    const about: About = {
        author: 'pultzlucas',
        version: '0.1.0',
        description: 'My templo server containing all my public templates available to use',
        requiresAcessKey: false
    } 

    ctx.response.body = about
})

export default router