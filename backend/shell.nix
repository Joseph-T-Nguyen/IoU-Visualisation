{
  pkgs ? import <nixpkgs> {}
, yarn ? pkgs.yarn
, prisma-old ? pkgs.prisma
}:

let
  lib = pkgs.lib;

  prisma-version = "6.17.1";
  custom-prisma = prisma-old.overrideAttrs (old: rec {
    version = prisma-version;

    # replace the source to match the new version:
    src = pkgs.fetchFromGitHub {
      owner = "prisma";
      repo = "prisma";
      rev = prisma-version;
      hash = "sha256-dKwa3SAB7IVyGY7MnVX5b9WvHfgk+2jfGV9Bc5AH5BA=";
    };

    nativeBuildInputs = [
      pkgs.nodejs
      pkgs.pnpm_10.configHook
      pkgs.jq
      pkgs.makeWrapper
      pkgs.moreutils
    ];

    pnpmDeps = pkgs.pnpm_10.fetchDeps {
      inherit version src;
      inherit (old) pname;
      fetcherVersion = 1;
      hash = "sha256-qmP14PZ/NbfZ82m5LtLs6WZM/MboV2AlUay9KII41LU=";
    };
  });

in pkgs.mkShell {
  # nativeBuildInputs is usually what you want -- tools you need to run
  nativeBuildInputs = with pkgs.buildPackages; [
    yarn
    pkgs.typescript-language-server
    pkgs.nodejs
    pkgs.tailwindcss

    custom-prisma
    pkgs.openssl
  ];
}
