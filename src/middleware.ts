import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

const isPublicRoute = createRouteMatcher([
  '/',
  '/about',
  '/articles(.*)',
  '/sign-in(.*)',
  '/sign-up(.*)',
  '/api(.*)'
]);

const isAdminRoute = createRouteMatcher(['/admin(.*)']);

export default clerkMiddleware(async (auth, req) => {
  // Protect admin routes
  if (isAdminRoute(req)) {
    const { userId, sessionClaims } = await auth();
    
    if (!userId) {
      return NextResponse.redirect(new URL('/', req.url));
    }
    
    // Check if user has admin role
    const userRole = sessionClaims?.role;
    if (userRole !== 'admin') {
      // Return 404 instead of 403 for better security
      return new NextResponse('Not Found', { status: 404 });
    }
  }
  
  // Protect all non-public routes (require authentication)
  if (!isPublicRoute(req)) {
    await auth.protect();
  }
});

export const config = {
    matcher: [
        // Skip Next.js internals and all static files, unless found in search params
        '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
        // Always run for API routes
        '/(api|trpc)(.*)',
    ],
};