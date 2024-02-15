use axum::routing::get;
use axum::Router;
use sqlx::{Pool, Postgres};

use crate::handlers::audio::{post_upload_audio, upload_audio};

pub fn audio_route() -> Router<Pool<Postgres>> {
    Router::new().route("/audio", get(upload_audio).post(post_upload_audio))
}
