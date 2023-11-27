// const baseURL = "https://api-for-your-date.kro.kr/"
const baseURL = "http://127.0.0.1:8000/"

function dateParser(dateStr) {
    const date = new Date(dateStr)
    return `${date.getFullYear()}년 ${date.getMonth() + 1}월 ${date.getDate()}일`
}

function isLogin() {
    const accessToken = localStorage.getItem('accessToken', '')
    const refreshToken = localStorage.getItem('refreshToken', '')

    if(accessToken && refreshToken) {
        return true
    } else {
        return false
    }
}

function getAccessToken() {
    const accessToken = localStorage.getItem('accessToken', '')

    return accessToken
}

function checkTokenExpired(redirectUrl, callback) {
    const accessToken = localStorage.getItem('accessToken', '')
    if(accessToken) {
        const url = baseURL + 'user/token/verify/'
        fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                token: accessToken,
            })
        }).then((response) => {
            if(!response.ok) {
                throw new Error(response.status)
            }
            callback(accessToken)
        }).catch((statusCode) => {
            if(statusCode.message == 401) {
                refreshToken(redirectUrl, (accessToken) => {
                    callback(accessToken)
                })
            }
        })
    } else {
        alert('로그인된 상태가 아닙니다. 로그인 해주세요')
        window.location.href = '/login.html?redirect=' + redirectUrl
    }

}

function refreshToken(redirectUrl, callback) {
    const refreshToken = localStorage.getItem('refreshToken', '')

    if(refreshToken) {
        const url = baseURL + 'user/token/refresh/'

        fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                refresh: refreshToken,
            })
        }).then((response) => {
            if(!response.ok) {
                throw new Error(response.status)
            }
            return response.json()
        }).then((json) => {
            localStorage.setItem('accessToken', json['access'])
            callback(json['access'])
        }).catch((statusCode) => {
            if(statusCode.message == 401) {
                alert('세션이 만료되었습니다. 재로그인해주세요')
                localStorage.removeItem("accessToken")
                localStorage.removeItem("refreshToken")
                window.location.href = '/login.html?redirect=' + redirectUrl
            }
        })
    } else {
        alert('로그인된 상태가 아닙니다. 로그인 해주세요')
        window.location.href = '/login.html?redirect=' + redirectUrl
    }
}