import cookie from 'cookie';

const maxAge = 60 * 60 * 24 * 7 // 1 week

export const setTokenCookie = (token, res) => {

    const setCookie = cookie.serialize('token',token,{
        maxAge,
        expires: new Date(Date.now() + maxAge * 1000),
        secure: process.env.NODE_ENV === "production",
        path: "/",
    });

    res.setHeader("Set-Cookie", setCookie);
}

export const removeTokenCookies = (res) => {

    const removeCookie = cookie.serialize('token','',{
        maxAge : -1,
        path: "/",
    });

    res.setHeader("Set-Cookie", removeCookie);
}