'use client';

// Without a defined matcher, this one line applies next-auth
// to the entire project
export { default } from 'next-auth/middleware';

// Applies next-auth only to matching routes - can be regex
// Ref: https://nextjs.org/docs/app/building-your-application/routing/middleware#matcher
export const config = { matcher: ['/me', '/p-shows'] };

// const searchParams = useSearchParams();

// export async function middleware(req) {
// if (req.nextUrl.pathname.startsWith('/me')) {
// }
// const session = await getServerSession(options);
// // If the user is already logged in, redirect.
// // Make sure not to redirect to the same page
// // to avoid infinite loop!
// if (session) {
//   const callbackUrl = searchParams.get('callbackUrl');
//   console.log('redirect from middleware', { callbackUrl });
//   if (callbackUrl) {
//     return NextResponse.rewrite(callbackUrl);
//   } else {
//     return NextResponse.rewrite('/');
//   }
// } else {
//   console.log('no session');
//   return NextResponse.rewrite(
//     new URL('/auth/signin?st=signin&callbackUrl=/me', req.url),
//   );
// }
// }
