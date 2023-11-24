const baseURL = "http://127.0.0.1:8000/"

function dateParser(dateStr) {
    const date = new Date(dateStr)
    return `${date.getFullYear()}년 ${date.getMonth() + 1}월 ${date.getDate()}일`
}