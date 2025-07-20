# Delta Shell

A desktop shell based on [Ags](https://github.com/Aylur/ags). Currently supports Hyprland and Niri.
<br>

![image](https://i.imgur.com/vBy0QRd.png)

## Nix/NixOS

If you use Nix or NixOS, you can run Delta Shell with all dependencies managed automatically:

```bash
nix run github:sameoldlab/delta-shell
```

For development, enter a shell with all dependencies:

```bash
nix develop
```

No manual installation of dependencies is required when using Nix.

## NixOS & Home Manager Integration

Delta Shell provides both a NixOS module and a Home Manager module for easy, declarative configuration via your flake.

### Flake Outputs

- **NixOS module:** `nixosModules.default`
- **Home Manager module:** `homeManagerModules.default`
- **Package:** `packages.x86_64-linux.default`

You can check these outputs with:
```bash
nix flake show github:sameoldlab/delta-shell
```

### Example: NixOS Configuration

Add the module to your NixOS configuration in your flake:
```nix
{
  inputs.delta-shell.url = "github:sameoldlab/delta-shell";
  outputs = { self, nixpkgs, ... }: {
    nixosConfigurations.myhost = nixpkgs.lib.nixosSystem {
      modules = [
        self.nixosModules.default
        # ...other modules
      ];
      configuration = {
        services.delta-shell.enable = true;
      };
    };
  };
}
```

### Example: Home Manager Configuration

Add the module to your Home Manager configuration in your flake:
```nix
{
  inputs.delta-shell.url = "github:sameoldlab/delta-shell";
  outputs = { self, nixpkgs, home-manager, ... }: {
    homeConfigurations.myuser = home-manager.lib.homeManagerConfiguration {
      modules = [
        self.homeManagerModules.default
        # ...other modules
      ];
      configuration = {
        programs.delta-shell.enable = true;
        programs.delta-shell.config = {
          # ...your config here, as a Nix attrset (will be written as JSON)
        };
      };
    };
  };
}
```

**Note:**
- The Home Manager module writes your configuration to `~/.config/delta-shell/config.json`.
- The NixOS module simply installs the package system-wide.

## Dependencies

> **Note:** If you use Nix, you can skip this section. All dependencies are handled by the flake.

### Required

- `aylurs-gtk-shell-git`
- `libastal-meta`
- `libastal-niri-git`
- `brightnessctl`
- `dart-sass`
- `fd`
- `bluez`
- `tuned-ppd` or `power-profiles-daemon`

**NOTE: Delta Shell will not run without the required dependencies.**

### Optional

- `cliphist` for clipboard
- `gpu-screen-recorder` to record screen from control center

```bash
yay -S aylurs-gtk-shell-git libastal-meta brightnessctl dart-sass fd bluez tuned-ppd cliphist gpu-screen-recorder
```

```bash
mkdir libastal-niri-git
cd libastal-niri-git
wget https://raw.githubusercontent.com/Sinomor/PKGBUILDS/refs/heads/main/libastal-niri-git/PKGBUILD
makepkg -si
```

## Configuration

Config file located at `~/.config/delta-shell/config.json`.
Config comes with the following defaults:

> [!WARNING]
> Don't copy and paste this entire block into your `config.json`, it's just to show which configurations are available.

```
{
  "hot_reload": false, // apply changes when config file changed
  "theme": {
    "bg": {
      "0": "#1d1d20",
      "1": "#28282c",
      "2": "#36363a",
      "3": "#48484b"
    },
    "fg": {
      "0": "#ffffff",
      "1": "#c0c0c0",
      "2": "#808080"
    },
    "accent": "#c88800",
    "blue": "#3584e4",
    "teel": "#2190a4",
    "green": "#3a944a",
    "yellow": "#c88800",
    "orange": "#ed5b00",
    "red": "#e62d42",
    "purple": "#9141ac",
    "slate": "#6f8396",
    "border": {
      "width": 1,
      "color": "#36363a"
    },
    "outline": {
      "width": 1,
      "color": "#c0c0c0"
    },
    "main-padding": 15, // main padding in widgets
    "spacing": 10, // spacing between elements
    "radius": 0 // border radius
  },
  "transition": 200, // animation transition
  "font": {
    "name": "Rubik",
    "size": 14
  },
  "bar": {
    "position": "top", // "top" | "bottom"
    "height": 52,
    "spacing": 6, // spacing between bar widgets
    "date": {
      "format": "%b %d  %H:%M" // https://docs.gtk.org/glib/method.DateTime.format.html
    }
  },
  "control": {
    "width": 500,
    "margin": 10
  },
  "launcher": {
    "width": 500,
    "margin": 10
  },
  "osd": {
    "width": 300,
    "margin": 10,
    "timeout": 3000
  },
  "calendar": {
    "margin": 10
  },
  "notifications_popup": {
    "margin": 10,
    "timeout": 3000
  }
}
```

## References

- [epik-shell](https://github.com/ezerinz/epik-shell/)
- [re-shell](https://github.com/ReStranger/re-shell)
- [cafetestrest dotfiles](https://github.com/cafetestrest/nixos)
