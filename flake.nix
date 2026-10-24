{
  description = "pelostage dev shell";

  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/nixos-unstable";
    flake-parts = {
      url = "github:hercules-ci/flake-parts";
      inputs.nixpkgs-lib.follows = "nixpkgs";
    };
    treefmt-nix = {
      url = "github:numtide/treefmt-nix";
      inputs.nixpkgs.follows = "nixpkgs";
    };
  };

  outputs =
    inputs@{ flake-parts, ... }:
    flake-parts.lib.mkFlake { inherit inputs; } {
      imports = [ inputs.treefmt-nix.flakeModule ];
      systems = [
        "x86_64-linux"
        "aarch64-linux"
        "aarch64-darwin"
      ];
      perSystem =
        { pkgs, ... }:
        {
          devShells.default = pkgs.mkShell {
            packages =
              with pkgs;
              [
                # node (yarn delegates to the version pinned by yarnPath in .yarnrc.yml)
                nodejs_22
                (yarn-berry.override { nodejs = nodejs_22; })

                # sops
                sops
                age

                # pre-commit
                prek
                yamllint
                actionlint
                zizmor
              ]
              # node-gyp needs xcodebuild to compile native modules on macOS
              ++ lib.optionals stdenv.hostPlatform.isDarwin [ xcbuild ];
          };

          treefmt = {
            projectRootFile = "flake.nix";
            programs.nixfmt.enable = true;
          };
        };
    };
}
