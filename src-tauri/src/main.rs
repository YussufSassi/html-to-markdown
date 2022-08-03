#![cfg_attr(
  all(not(debug_assertions), target_os = "windows"),
  windows_subsystem = "windows"
)]

fn main() {
  tauri::Builder::default()
    .invoke_handler(tauri::generate_handler![get_markdown])
    .run(tauri::generate_context!())
    .expect("error while running tauri application");
}
//tauri commands

#[tauri::command]
fn get_markdown(html: &str) -> String {
  let md = html2md::parse_html_extended(html);
  return md;
}