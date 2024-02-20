use axum::Router;
use axum::{
    http::StatusCode,
    routing::{get, post},
};
use sqlx::{Pool, Postgres};

use crate::handlers::audio::{get_upload_audio, upload_audio};

pub fn audio_route() -> Router<Pool<Postgres>> {
    Router::new().route("/audio", get(get_upload_audio).post(upload_audio))
}
