'use client';

// THIS IS A PROTOTYPE-ONLY FILE
// In a real Next.js app, you'd create a file at `src/app/api/users/route.ts`
// This setup dynamically creates an API endpoint to serve the users.json data,
// allowing client-side components to fetch user data without importing server-side code.

import { getUsers } from "./data";

export async function setup() {
    if (typeof window !== 'undefined' && window.__api_route_setup) {
        return;
    }

    // Mock the Next.js request/response objects
    const mockRequest = {
        method: 'GET',
        headers: new Headers({ 'Content-Type': 'application/json' }),
    };

    // Use a service worker to intercept the fetch call to /api/users
    const { setupWorker, http } = await import('msw/browser');
    const worker = setupWorker(
        http.get('/api/users', async () => {
            const users = await getUsers();
            return new Response(JSON.stringify(users), {
                headers: { 'Content-Type': 'application/json' }
            })
        })
    );

    await worker.start({
        onUnhandledRequest: 'bypass',
        quiet: true,
    });
    
    if (typeof window !== 'undefined') {
        window.__api_route_setup = true;
    }
}
