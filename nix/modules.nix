{
  lib,
  pkgs,
  ...
}: {
  # Home Manager module
  home-manager = {
    config,
    lib,
    pkgs,
    ...
  }:
    with lib; {
      options.programs.delta-shell = {
        enable = mkEnableOption "Delta Shell desktop shell";
        package = mkOption {
          type = types.package;
          default = pkgs.delta-shell or pkgs.callPackage ../default.nix {};
          description = "Delta Shell package to use.";
        };
        config = mkOption {
          type = types.attrs;
          default = {};
          description = "Delta Shell configuration as a Nix attribute set (will be written as JSON).";
        };
      };

      config = mkIf config.programs.delta-shell.enable {
        home.packages = [config.programs.delta-shell.package];
        xdg.configFile."delta-shell/config.json".text =
          builtins.toJSON config.programs.delta-shell.config;
      };
    };

  # NixOS module (thin wrapper, mostly for system package exposure)
  nixos = {
    config,
    lib,
    pkgs,
    ...
  }:
    with lib; {
      options.services.delta-shell = {
        enable = mkEnableOption "Delta Shell system package";
        package = mkOption {
          type = types.package;
          default = pkgs.delta-shell or pkgs.callPackage ../default.nix {};
          description = "Delta Shell package to install system-wide.";
        };
      };

      config = mkIf config.services.delta-shell.enable {
        environment.systemPackages = [config.services.delta-shell.package];
        # Optionally, could manage a system-wide config here if needed
      };
    };
}
