{
  description = "A starboarding Discord bot";

  inputs = { fu.url = "github:numtide/flake-utils"; };

  outputs = { self, nixpkgs, fu }:
    fu.lib.eachDefaultSystem (system:
      let pkgs = nixpkgs.legacyPackages.${system};
      in {
        devShell =
          pkgs.mkShell { packages = with pkgs; [ nodejs nodePackages.npm ]; };
      });
}
