use axum::extract::State;
use sqlx::{Pool, Postgres};

pub async fn upload_audio(State(pool): State<Pool<Postgres>>) -> String {
    let query = "INSERT INTO accounts (username, email, password_hash) VALUES ($1, $2, $3)";

    // if let Ok(_tmp) =
    // sqlx::query(query)
    //     .bind("weiiii222".to_string())
    //     .bind("weiiii23213213@mail.com".to_string())
    //     .bind("aaa223213".to_string())
    //     .execute(&pool)
    //     .await;
    // {
    //     Ok("te".to_string())
    // } else {
    //     Err(StatusCode::NOT_FOUND)
    // };

    format!("{}", query)
}

pub async fn post_upload_audio(State(pool): State<Pool<Postgres>>, name: String) -> String {
    let query = "INSERT INTO accounts (username, email, password_hash) VALUES ($1, $2, $3)";

    format!("{}, name is {}", query, name)
}
