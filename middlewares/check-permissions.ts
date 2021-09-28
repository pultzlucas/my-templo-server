import { Context, Status } from "https://deno.land/x/oak@v9.0.0/mod.ts"

async function checkUserPermissions(ctx: Context, next: Function) {
    const authorization = ctx.request.headers.get('authorization')
    
    if(!authorization) {
        ctx.response.status = Status.Unauthorized
        ctx.response.body = {
            error: 'Authorization key is required.'
        }
        return
    }
    
    if(authorization != Deno.env.get('AUTHORIZATION_KEY')) {
        ctx.response.status = Status.Unauthorized
        ctx.response.body = {
            error: 'Authorization key is not correct.'
        }
        return
    }
    
    await next()
}

export default checkUserPermissions