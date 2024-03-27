class ApiResponse {
    static error = (res, error) => {
        const code = error.statusCode ?? 500;
        return res.status(code).json({ success: true, error: error.message });
    }
    static success = (res, data, message) => {
        return res.json({ success: true, data, message })
    }
}
export { ApiResponse }