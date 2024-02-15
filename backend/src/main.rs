use axum::Router;
use backend::{db, routes::audio::audio_route};
use dotenv;
use std::error::Error;
use std::net::SocketAddr;

use tracing_subscriber::{layer::SubscriberExt, util::SubscriberInitExt};

#[tokio::main]
async fn main() -> Result<(), Box<dyn Error>> {
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

    let app = Router::new().merge(audio_route()).with_state(pool);

    let addr = SocketAddr::from(([127, 0, 0, 1], 3001));

    let listener = tokio::net::TcpListener::bind(addr.to_string())
        .await
        .unwrap();

    tracing::debug!("listening on {}", listener.local_addr().unwrap());

    axum::serve(listener, app).await.unwrap();

    Ok(())
}
