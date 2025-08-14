{
  pkgs ? import <nixpkgs> {}
, yarn ? pkgs.yarn
}:

let
  lib = pkgs.lib;
in pkgs.mkShell {
  # nativeBuildInputs is usually what you want -- tools you need to run
  nativeBuildInputs = with pkgs.buildPackages; [ 
    yarn
    pkgs.typescript-language-server
    pkgs.nodejs
#    pkgs.tailwindcss-language-server
    pkgs.tailwindcss
  ];
}
