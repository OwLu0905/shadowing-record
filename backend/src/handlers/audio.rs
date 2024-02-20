use std::num::ParseIntError;

use crate::common::custom_error::AppError;
use axum::extract::Multipart;
use axum::{extract::State, http::StatusCode, response::IntoResponse};
use sqlx::{Pool, Postgres};
use std::{io::Write, path::Path};
use tokio::{
    fs::File,
    io::{AsyncWriteExt, BufWriter}, // Import AsyncWriteExt here
};

pub async fn upload_audio(
    State(pool): State<Pool<Postgres>>,
    mut payload: Multipart,
) -> Result<String, AppError> {
    let query = "INSERT INTO accounts (username, email, password_hash) VALUES ($1, $2, $3)";
    while let Ok(Some(mut field)) = payload.next_field().await {
        let content_type = field
            .content_type()
            .map(|ct| ct.to_string())
            .unwrap_or_default();

        let extension = match content_type.as_str() {
            "audio/mpeg" => "mp3",
            _ => "webm",
        };

        dbg!("Field name", field.file_name());

        let filename = field
            .file_name()
            .map(|name| format!("{}.{}", name.to_string(), extension))
            .unwrap_or_else(|| format!("file.{}", extension));

        let file_path = Path::new("./").join(&filename);

        let mut file = File::create(&file_path).await.unwrap();

        while let Some(chunk) = field.chunk().await.unwrap() {
            file.write_all(&chunk).await.unwrap();
        }
    }

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

    let a = fetch_lat_long("22".to_string()).await?;
    Ok(a.to_string())
}

pub async fn get_upload_audio(State(pool): State<Pool<Postgres>>) -> Result<String, AppError> {
    let query = "INSERT INTO accounts (username, email, password_hash) VALUES ($1, $2, $3)";

    let a = fetch_lat_long("22".to_string()).await?;
    Ok(a.to_string())
}
// pub async fn post_upload_audio(State(pool): State<Pool<Postgres>>, name: String) -> String {
//     let query = "INSERT INTO accounts (username, email, password_hash) VALUES ($1, $2, $3)";
//
//     format!("{}, name is {}", query, name)
// }

async fn fetch_lat_long(number_str: String) -> Result<i32, ParseIntError> {
    let number = match number_str.parse::<i32>() {
        Ok(number) => number,
        Err(e) => return Err(e),
    };
    Ok(number)
}
