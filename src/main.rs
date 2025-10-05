use std::fs;
use std::path::Path;
use walkdir::WalkDir;
use mongodb::{Client, options::ClientOptions};
use serde::{Deserialize, Serialize};
use futures::stream::TryStreamExt;
use chrono::Utc;

#[derive(Debug, Serialize, Deserialize)]
struct MongoDoc {
    // Assuming generic document, but we can adjust
    #[serde(flatten)]
    data: serde_json::Value,
}

#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error>> {
    const PARENT_DIRECT_PATH: &str = r"d:\Documents";
    const MONGO_CONNECTION_STRING: &str = "mongodb://localhost:27017";
    const MONGO_DATABASE_NAMES: [&str; 2] = ["yumlabs", "perplexity_"];
    const MONGO_COLLECTION_NAMES: [&str; 2] = ["llm_responses", "queries"];

    // Scan directories for .md files
    let mut md_files = Vec::new();
    let walker = WalkDir::new(PARENT_DIRECT_PATH).into_iter().filter_entry(|e| {
        !e.file_type().is_dir() || !matches!(e.file_name().to_str(), Some("target") | Some("node_modules"))
    });
    for entry in walker.filter_map(|e| e.ok()) {
        if entry.file_type().is_file() {
            if let Some(ext) = entry.path().extension() {
                if ext == "md" {
                    md_files.push(entry.path().to_path_buf());
                }
            }
        }
    }

    // Connect to MongoDB
    let client_options = ClientOptions::parse(MONGO_CONNECTION_STRING).await?;
    let client = Client::with_options(client_options)?;

    // Collect data from MongoDB
    let mut mongo_data = Vec::new();
    for &db_name in &MONGO_DATABASE_NAMES {
        let db = client.database(db_name);
        for &coll_name in &MONGO_COLLECTION_NAMES {
            let collection = db.collection::<MongoDoc>(coll_name);
            let mut cursor = collection.find(None, None).await?;
            while let Some(doc) = cursor.try_next().await? {
                mongo_data.push(doc);
            }
        }
    }

    // Generate Markdown documents with VitePress frontmatter
    let output_dir = Path::new("docs");
    fs::create_dir_all(output_dir)?;

    // // Copy and process each .md file with VitePress YAML frontmatter
    // for (i, file) in md_files.iter().enumerate() {
    //     if let Ok(file_content) = fs::read_to_string(&file) {
    //         let title = file.file_stem().unwrap_or_default().to_string_lossy();
    //         let mut content = String::new();
            
    //         // Add VitePress YAML frontmatter
    //         content.push_str("---\n");
    //         content.push_str(&format!("title: {}\n", title));
    //         content.push_str(&format!("description: Document from {}\n", file.display()));
    //         content.push_str(&format!("date: {}\n", Utc::now().format("%Y-%m-%d")));
    //         content.push_str("---\n\n");
            
    //         // Add original content
    //         content.push_str(&file_content);
    //         let file_name = file.file_name().unwrap_or_default().to_string_lossy();
    //         let output_file = output_dir.join(format!("{}-{}.md", file_name, i + 1));
    //         fs::write(output_file, content)?;
    //     }
    // }

    // Create file for MongoDB data with VitePress frontmatter
    let mut mongo_content = String::new();
    
    // Add VitePress YAML frontmatter
    mongo_content.push_str("---\n");
    mongo_content.push_str("title: MongoDB Data\n");
    mongo_content.push_str("description: Data retrieved from MongoDB databases\n");
    mongo_content.push_str(&format!("date: {}\n", Utc::now().format("%Y-%m-%d")));
    mongo_content.push_str("---\n\n");
    
    mongo_content.push_str("# MongoDB Data\n\n");



    for (i, doc) in mongo_data.iter().enumerate() {
        let title = doc.data.get("query").unwrap_or_default().as_str().unwrap_or_default();
        mongo_content.push_str(&format!("## {}\n\n", title));
        mongo_content.push_str("```json\n");
        mongo_content.push_str(&serde_json::to_string_pretty(&doc.data)?);
        mongo_content.push_str("\n```\n\n");
    }

    let mongo_file = output_dir.join("mongodb_docs.md");
    fs::write(mongo_file, mongo_content)?;

    Ok(())
}
