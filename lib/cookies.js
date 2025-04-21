import cookie from 'cookie';

const maxAge = 60 * 60 * 24 * 7; // 1 week

// Set token in the cookies
export const setTokenCookie = (token, res) => {
    const setCookie = cookie.serialize('token', token, {
        maxAge,
        expires: new Date(Date.now() + maxAge * 1000),
        secure: process.env.NODE_ENV === "production", // Ensures the cookie is only sent over HTTPS in production
        httpOnly: true, // Makes the cookie inaccessible to JavaScript (helps against XSS attacks)
        path: "/",
        sameSite: "lax", // Lax option prevents CSRF attacks but allows cookies to be sent with top-level navigations
    });

    res.setHeader("Set-Cookie", setCookie);
};

// Remove the token cookie
export const removeTokenCookies = (res) => {
    const removeCookie = cookie.serialize('token', '', {
        maxAge: -1, // Expire the cookie
        path: "/",
        httpOnly: true, // Ensure it's also removed as HTTPOnly
        sameSite: "lax", // Maintain SameSite consistency
    });

    res.setHeader("Set-Cookie", removeCookie);
};
