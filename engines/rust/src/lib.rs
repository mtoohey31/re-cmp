use js_sys::{Array, Promise};
use regex::{Match as Match_, Regex as Regex_};
use serde::Serialize;
use std::sync::Arc;
use wasm_bindgen::prelude::*;
use wasm_bindgen_futures::future_to_promise;

#[derive(Serialize)]
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
pub struct Regex(Arc<Regex_>);

#[wasm_bindgen]
impl Regex {
    pub fn matches(&self, text: String) -> Promise {
        #[cfg(feature = "console_error_panic_hook")]
        console_error_panic_hook::set_once();

        let regex = self.0.clone();
        // TODO: Investigate whether unwrap below is safe.
        future_to_promise(async move {
            let mut res = Array::new();
            res.extend(
                regex
                    .find_iter(&text)
                    .map(|m| serde_wasm_bindgen::to_value(&Match::from(m)).unwrap()),
            );
            Ok(res.into())
        })
    }
}

#[wasm_bindgen]
pub struct Engine;

#[wasm_bindgen]
impl Engine {
    pub fn new() -> Self {
        Self
    }

    pub fn compile(&mut self, regex: String) -> Promise {
        #[cfg(feature = "console_error_panic_hook")]
        console_error_panic_hook::set_once();

        future_to_promise(async move {
            Regex_::new(&regex)
                .map(|regex| Regex(Arc::new(regex)).into())
                .map_err(|err| js_sys::SyntaxError::new(&err.to_string()).into())
        })
    }
}
