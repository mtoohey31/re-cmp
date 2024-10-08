{
  description = "re-cmp";

  inputs = {
    nixpkgs.url = "nixpkgs/nixpkgs-unstable";
    utils.url = "github:numtide/flake-utils";
    gradle2nix.url = "github:tadfisher/gradle2nix/v2";
    naersk = {
      url = "github:nix-community/naersk";
      inputs.nixpkgs.follows = "nixpkgs";
    };
    rust-overlay = {
      url = "github:oxalica/rust-overlay";
      inputs = {
        nixpkgs.follows = "nixpkgs";
        flake-utils.follows = "utils";
      };
    };
  };

  outputs = { self, nixpkgs, utils, gradle2nix, naersk, rust-overlay }: {
    overlays = rec {
      expects-naersk-and-rust-overlay = final: prev: {
        pcre-wasm =
          final.callPackage ./pkgs/development/libraries/pcre/wasm.nix { };

        re-cmp =
          let
            rust = final.rust-bin.fromRustupToolchainFile
              ../engines/rust/rust-toolchain.toml;
            naersk = final.naersk.override { cargo = rust; rustc = rust; };
            re-cmp-engine-rust-target = (naersk.buildPackage {
              pname = "re-cmp-engine-rust";
              root = ../engines/rust;
              CARGO_BUILD_TARGET = "wasm32-unknown-unknown";
            }).overrideAttrs (_: {
              installPhase = ''
                cp -r target $out
              '';
            });
            re-cmp-engine-java-util-regex-build =
              gradle2nix.builders.${final.stdenv.hostPlatform.system}.buildGradlePackage {
                pname = "re-cmp-engine-java-util-regex-build";
                version = "0.1.0";
                src = ../engines/java-util-regex;
                lockFile = ../engines/java-util-regex/gradle.lock;
                gradleBuildFlags = [ "generateJavaScript" ];
                installPhase = ''
                  runHook preInstall

                  cp -r build $out

                  runHook postInstall
                '';
              };
          in
          final.stdenv.mkDerivation {
            pname = "re-cmp";
            version = "0.1.0";
            src = builtins.path { path = ./..; name = "re-cmp-src"; };
            buildInputs = [
              final.brotli
              final.emscripten
              final.go
              final.jdk21_headless
              final.nodePackages.uglify-js
              final.pcre-wasm
              rust
              final.wasm-bindgen-cli
              final.zstd
            ];
            preBuild = ''
              export EM_CACHE="$TMPDIR/em-cache"
              cp -r ${final.emscripten}/share/emscripten/cache "$EM_CACHE"
              chmod -R +w "$EM_CACHE"

              export GOCACHE=$TMPDIR/go-cache
              export GOPATH="$TMPDIR/go"

              cp -r ${re-cmp-engine-rust-target} engines/rust/target
              cp -r ${re-cmp-engine-java-util-regex-build} engines/java-util-regex/build
            '';
            installPhase = ''
              mkdir -p $out/share/re-cmp
              cp -r build $out/share/re-cmp/html
            '';
          };
      };

      default = _: prev: {
        inherit (prev.appendOverlays [
          naersk.overlay
          rust-overlay.overlays.default
          expects-naersk-and-rust-overlay
        ]) re-cmp;
      };
    };
  } // utils.lib.eachDefaultSystem (system:
    let
      overlays = [
        naersk.overlay
        rust-overlay.overlays.default
        self.overlays.expects-naersk-and-rust-overlay
      ];
      pkgs = import nixpkgs { inherit overlays system; };
      inherit (pkgs) bear binaryen brotli caddy clang-tools emscripten go gopls
        java-language-server jdk21_headless mkShell nodePackages pcre-wasm
        re-cmp rust-analyzer rust-bin wasm-bindgen-cli zstd;
      rust =
        rust-bin.fromRustupToolchainFile ../engines/rust/rust-toolchain.toml;
      inherit (nodePackages) prettier typescript typescript-language-server
        uglify-js;
    in
    {
      packages.default = re-cmp;

      devShells.default = mkShell {
        packages = [
          bear
          binaryen
          brotli
          caddy
          clang-tools
          emscripten
          go
          gopls
          gradle2nix.packages.${system}.gradle2nix
          java-language-server
          jdk21_headless
          pcre-wasm
          prettier
          rust
          rust-analyzer
          typescript
          typescript-language-server
          uglify-js
          wasm-bindgen-cli
          zstd
        ];
        shellHook = ''
          export EM_CACHE="$PWD/.em-cache"
        '';
      };
    });
}
