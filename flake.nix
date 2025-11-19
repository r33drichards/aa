{
  description = "auto-attack Minecraft bot development environment";

  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/nixpkgs-unstable";
    flake-utils.url = "github:numtide/flake-utils";
  };

  outputs = { self, nixpkgs, flake-utils }:
    flake-utils.lib.eachDefaultSystem (system:
      let
        pkgs = nixpkgs.legacyPackages.${system};
      in
      {
        devShells.default = pkgs.mkShell {
          buildInputs = with pkgs; [
            # Node.js and package manager
            nodejs_22
            nodePackages.pnpm

            # Canvas native dependencies
            pkg-config
            cairo
            pango
            libpng
            libjpeg
            giflib
            librsvg
            pixman
          ];

          shellHook = ''
            echo "auto-attack dev environment loaded"
            echo "Run 'pnpm install' to install dependencies"
          '';
        };
      });
}
