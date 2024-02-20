use axum::http::{header, Method, Request, Response};
use axum::{
    http::{StatusCode, Uri},
    routing::get,
    Router,
};
use backend::{db, handlers::audio::upload_audio, routes::audio::audio_route};
use dotenv;
use std::net::SocketAddr;
use tower_http::cors::{Any, CorsLayer};
use tracing_subscriber::{layer::SubscriberExt, util::SubscriberInitExt};

#[tokio::main]
async fn main() -> anyhow::Result<()> {
    tracing_subscriber::registry()
        .with(
            tracing_subscriber::EnvFilter::try_from_default_env()
                .unwrap_or_else(|_| "example_tokio_postgres=debug".into()),
        )
        .with(tracing_subscriber::fmt::layer())
        .init();

    dotenv::dotenv().ok();

    let connec = db::connection::establish_connection().await;

    let pool = match connec {
        Ok(success) => {
            println!("✅  Connection to the database is successful!");
            success
        }
        Err(err) => {
            println!("⚠️  Failed to connect to the database: {:?}", err);
            std::process::exit(1);
        }
    };

    let cors = CorsLayer::new()
        // allow `GET` and `POST` when accessing the resource
        .allow_methods([Method::GET, Method::POST])
        // allow requests from any origin
        .allow_origin(Any)
        .allow_headers(Any);

    let app = Router::new()
        .fallback(fallback)
        .merge(audio_route())
        .layer(cors)
        .with_state(pool);

    let addr = SocketAddr::from(([127, 0, 0, 1], 3001));

    let listener = tokio::net::TcpListener::bind(addr.to_string())
        .await
        .unwrap();

    tracing::debug!("listening on {}", listener.local_addr().unwrap());

    axum::serve(listener, app).await.unwrap();

    Ok(())
}

async fn fallback(uri: Uri) -> (StatusCode, String) {
    (StatusCode::NOT_FOUND, format!("No route for {uri}"))
}
