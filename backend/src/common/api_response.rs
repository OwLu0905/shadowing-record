use axum::{http::StatusCode, response::IntoResponse};
use serde::Serialize;

#[derive(Serialize)]
struct ApiResponse<T> {
    success: bool,
    message: String,
    data: Option<T>,
}

#[derive(Debug)]
struct ApiError {
    code: u16,
    message: String,
}

impl ApiError {
    pub fn new(code: u16, message: &str) -> Self {
        ApiError {
            code,
            message: message.to_string(),
        }
    }
}

// Implement a conversion from ApiError to axum's response
impl IntoResponse for ApiError {
    fn into_response(self) -> axum::response::Response {
        let body = serde_json::to_string(&ApiResponse::<()> {
            success: false,
            message: self.message,
            data: None,
        })
        .expect("Failed to serialize error response");

        (
            StatusCode::from_u16(self.code).unwrap_or(StatusCode::INTERNAL_SERVER_ERROR),
            body,
        )
            .into_response()
    }
}
