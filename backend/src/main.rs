use dotenv::dotenv;
use sqlx::postgres::PgPoolOptions;
use sqlx::Row;
use std::env;
use std::error::Error;

#[tokio::main]
async fn main() -> Result<(), Box<dyn Error>> {
    dotenv().ok();

    let database_url = env::var("DATABASE_URL").expect("DATABASE_URL must be set");

    let pool = PgPoolOptions::new()
        .max_connections(5)
        .connect(&database_url)
        .await;

    let pool = match pool {
        Ok(success) => {
            println!("✅  Connection to the database is successful!");
            success
        }
        Err(err) => {
            println!("⚠️  Failed to connect to the database: {:?}", err);
            std::process::exit(1);
        }
    };

    let res = sqlx::query("SELECT username from accounts")
        .fetch_one(&pool)
        .await?;

    let user: String = res.get("username");

    println!("The first user is: {}", user);

    Ok(())
}
