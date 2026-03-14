import { JwtPayload, UserType } from "@components/admin/user/models";
import { NextRequest, NextResponse } from "next/server";
import { jwtDecode } from "jwt-decode";

export function proxy(req: NextRequest) {
  const jwt = req.cookies.get("__Host-access_token")?.value;

  const isOnAuth = req.nextUrl.pathname.startsWith('/auth');
  const isOnDashboard = req.nextUrl.pathname.startsWith('/portal');
  const isOnAdmin = req.nextUrl.pathname.startsWith('/admin');
  const shouldLogin = isOnAuth || isOnDashboard || isOnAdmin

  const isLoggedIn = !!jwt;
  // const referrer = req.headers.get('referer');
  const referrer2 = req.nextUrl;
  let referringPath = undefined
  let redirectUrl = undefined

  if (isLoggedIn) {
      const decodedJwt = jwtDecode<JwtPayload>(jwt);
      console.log("decodedJwt: ", decodedJwt)
      const redirectPath = decodedJwt?.user_type === UserType.ADMIN ? "/admin/dashboard" : "/portal/dashboard";
      if (isOnAuth){ // Is on auth path while already logged in
        redirectUrl = new URL(redirectPath, req.url);
      }
      if (isOnDashboard && decodedJwt?.user_type === UserType.ADMIN){ // Is on dashboard path while user is ADMIN
        redirectUrl = new URL(redirectPath, req.url);
      }
      if (isOnAdmin && decodedJwt?.user_type === UserType.USER){ // Is on admin path while user is USER
        redirectUrl = new URL(redirectPath, req.url);
      }
  }else if(!isOnAuth){ // Not login, and not on login path
      redirectUrl = new URL("/auth/sign-in", req.url);
  }

  if(!isOnAuth){
    referringPath = referrer2.pathname + referrer2.search;
    if (redirectUrl){
      redirectUrl.searchParams.set("auth-referrer", referringPath);
    }
  }

  // console.log(", referrer2: ", referrer2)
  // console.log("isLoggedIn: ", isLoggedIn, ", referringPath: ", referringPath)

  if (redirectUrl){
      return NextResponse.redirect(redirectUrl);
  }

  // if (isLoggedIn) {
  //     if (isOnAuth){ // Is on auth path while already logged in
  //       return NextResponse.redirect(new URL("/portal/dashboard", req.url));
  //     }
  // }else if(!isOnAuth){ // Not login, and not on login path
  //     return NextResponse.redirect(new URL("/auth/sign-in", req.url));
  // }

  return NextResponse.next();
}

export const config = {
 // https://nextjs.org/docs/app/building-your-application/routing/middleware#matcher
  matcher: [
    '/portal/:path*', 
    '/admin/:path*', 
    '/auth/sign-in'], // Routes to protect
};
