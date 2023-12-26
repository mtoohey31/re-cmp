use js_sys::{Error, SyntaxError};
use regex::{Match as Match_, Regex as Regex_};
use wasm_bindgen::prelude::*;

#[wasm_bindgen]
pub struct Match {
    pub start: usize,
    pub end: usize,
}

impl From<Match_<'_>> for Match {
    fn from(value: Match_) -> Self {
        Self {
            start: value.start(),
            end: value.end(),
        }
    }
}

#[wasm_bindgen]
pub struct Regex(Regex_);

#[wasm_bindgen]
impl Regex {
    pub fn matches(&self, text: &str) -> Vec<Match> {
        #[cfg(feature = "console_error_panic_hook")]
        console_error_panic_hook::set_once();

        self.0.find_iter(&text).map(Match::from).collect()
    }
}

#[wasm_bindgen]
pub struct Engine;

#[wasm_bindgen]
impl Engine {
    pub fn new() -> Self {
        Self
    }

    pub fn compile(&mut self, regex: &str) -> Result<Regex, Error> {
        #[cfg(feature = "console_error_panic_hook")]
        console_error_panic_hook::set_once();

        Regex_::new(&regex)
            .map(|regex| Regex(regex).into())
            .map_err(|err| SyntaxError::new(&err.to_string()).into())
    }
}
