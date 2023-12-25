{
  description = "re-cmp";

  inputs = {
    nixpkgs.url = "nixpkgs/nixpkgs-unstable";
    utils.url = "github:numtide/flake-utils";
    rust-overlay = {
      url = "github:oxalica/rust-overlay";
      inputs = {
        nixpkgs.follows = "nixpkgs";
        flake-utils.follows = "utils";
      };
    };
  };

  outputs = { self, nixpkgs, utils, rust-overlay }:
    utils.lib.eachDefaultSystem (system:
      let
        overlays = [ rust-overlay.overlays.default ];
        pkgs = import nixpkgs { inherit overlays system; };
        inherit (pkgs) binaryen caddy go gopls mkShell nodePackages
          rust-analyzer rust-bin wasm-bindgen-cli wasm-pack;
        rust = rust-bin.fromRustupToolchainFile
          ./engines/rust/rust-toolchain.toml;
        inherit (nodePackages) prettier typescript typescript-language-server;
      in
      {
        devShells.default = mkShell {
          packages = [
            binaryen
            caddy
            go
            gopls
            prettier
            rust
            rust-analyzer
            typescript
            typescript-language-server
            wasm-bindgen-cli
            wasm-pack
          ];
        };
      });
}
