{
  description = "re-cmp";

  inputs = {
    nixpkgs.url = "nixpkgs/nixpkgs-unstable";
    utils.url = "github:numtide/flake-utils";
  };

  outputs = { self, nixpkgs, utils }: utils.lib.eachDefaultSystem (system:
    let
      pkgs = import nixpkgs { inherit system; };
      inherit (pkgs) binaryen caddy go gopls mkShell nodePackages;
      inherit (nodePackages) prettier typescript-language-server;
    in
    {
      devShells.default = mkShell {
        packages = [
          binaryen
          caddy
          go
          gopls
          prettier
          typescript-language-server
        ];
      };
    });
}
