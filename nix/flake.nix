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

  outputs = { self, nixpkgs, utils, rust-overlay }: {
    overlays.default = final: prev: {
      pcre-wasm =
        final.callPackage ./pkgs/development/libraries/pcre/wasm.nix { };
    };
  } // utils.lib.eachDefaultSystem (system:
    let
      overlays = [ self.overlays.default rust-overlay.overlays.default ];
      pkgs = import nixpkgs { inherit overlays system; };
      inherit (pkgs) bear binaryen caddy clang-tools emscripten go gopls mkShell
        nodePackages pcre-wasm rust-analyzer rust-bin wasm-bindgen-cli
        wasm-pack;
      rust = rust-bin.fromRustupToolchainFile
        ../engines/rust/rust-toolchain.toml;
      inherit (nodePackages) prettier typescript typescript-language-server;
    in
    {
      devShells.default = mkShell {
        packages = [
          bear
          binaryen
          caddy
          clang-tools
          emscripten
          go
          gopls
          pcre-wasm
          prettier
          rust
          rust-analyzer
          typescript
          typescript-language-server
          wasm-bindgen-cli
          wasm-pack
        ];
        shellHook = ''
          export EM_CACHE="$PWD/.em-cache"
        '';
      };
    });
}
