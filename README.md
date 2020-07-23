# acf-action ![Test module](https://github.com/magknight/acf-action/workflows/Test%20module/badge.svg)
 Action to deal with our release ACF modification, along with skunkcrafts_updater.cfg

```
      - uses: magknight/acf-action@v2
        with:
          dest: "./res/"
          version: "v1.9.0"
```
## Inputs
### version
- Required
- The version you want to write, such as:
    - ``${{github.ref}}``
    - ``v1.2.0``

### src
- Optional, defaults to ``./``
- The source folder

### dest
- Required
- The destination folder
- E.g. ``./res/``

### acf-name
- Optional, defaults to ``B7879``
- Name of the ACF file
  
### write-acf
- Option, defaults to ``true``
- Determines whether we should write to the ACF
- This writes to the ``P acf/_version [version]`` field in the X-Plane ACF files, which is used to display version in the X-Plane aircraft menus 

### write-cfg
- Option, defaults to ``true``
- Determines whether we should write to the skunkcrafts_updater.cfg file
- This is used by the skunkcrafts updater



