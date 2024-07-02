import {clerkMiddleware, createRouteMatcher} from "@clerk/nextjs/server";


const isProtected = createRouteMatcher([
    
])

export default clerkMiddleware((auth, request, event) => {
    if(isProtected(request)) {
        auth().protect()
    }
});


export const config = {
    matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};