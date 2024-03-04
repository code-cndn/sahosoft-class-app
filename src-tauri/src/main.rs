// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

extern crate hardware_id;
extern crate sys_info;
use hardware_id::get_id;
use sys_info::os_type;
use serde::{Serialize};
#[derive(Serialize)]
struct Point {
  hwuuid: String,
  ostype: String,
  osinfo:String,
}

// #[tauri::command]
fn my_custom_command() -> String {
  let _id  = get_id();
  match _id {
    Ok(_v) => {
      return _v
      // _v.into()
    },
    Err(_e) => todo!()
}
}

// #[tauri::command]
fn my_custom_command_getos() -> String {
  let _os  = os_type();
  match _os {
    Ok(_v) => {
      return _v;
      // _v.into()
    },
    Err(_e) => todo!()
}
}
// #[tauri::command]
fn my_custom_command_getosversion() -> String {
  let info = os_info::get();
  return info.to_string();
}
#[tauri::command]
fn create_point() -> Point {
  let _uuid = my_custom_command();
  let _ostype = my_custom_command_getos();
  let _osinformation = my_custom_command_getosversion();
  Point { 
    hwuuid: _uuid, 
    ostype: _ostype, 
    osinfo: _osinformation,
  }
}
fn main() {

  tauri::Builder::default()
  .invoke_handler(tauri::generate_handler![create_point])
    .run(tauri::generate_context!())
    .expect("error while running tauri application");
}
