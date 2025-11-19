{ pkgs ? import <nixpkgs> {} }:

pkgs.mkShell {
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
}
