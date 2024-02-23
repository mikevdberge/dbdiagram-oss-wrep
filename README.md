
# dbdiagram-oss

An Open Source alternative to dbdiagram.io, aiming to have the same basic features+more. Motivation behind the project was that $9/month overpriced subscription for just some **very VERY** basic features. (dark mode/header colours/table groups)

## Forked Info

+ 1. Crappy auto-layout algorithm
+ 2. Remote S3 repository
+ 3. Repaired bug correct redrawing after changing the file
+ 4. Repaired bug droping "text" field in localStorage when selecting another clean file
+ 5. Docker image:  docker pull nomadshub/dbdiagrams-oss-wrep:2.2

### Sep.23 update
+ 6. Notifications for repository actions
+ 7. Added relation labels (1 or *) (minor positioning issues)
+ 7. Custom header colors (done)
+ 8. Export to SVG, PNG, Json
+ 9. Several new bugs (decision is in progress)
+ 10. Next cool update for header and relation labels will be later...
 
### Oct.23 update
+ 11. Added field tooltion with note, enum description and default
+ 12. Redesign table tooltip, added indexes
+ 13. Added not null and enum tag on diagram

### Feb.24 update
+ 14. Shifts of header color bug repaired
+ 15. Added touch screen support (hover table header = hold touch) (without gestures)
+ 16. Added PNG resolution change in export form (default is better quality)
+ 17. Added import json files
+ 18. Added actions for refs control points (add, reset, delete)


## Architecture - Solution

![Arch](https://raw.githubusercontent.com/NomadRazor/dbdiagram-oss-wrep/master/.github/media/arch.png)

## Repository settings demo

https://github.com/NomadRazor/dbdiagram-oss-wrep/assets/36404538/d7893336-13b5-431a-97d1-2cddc6073aec

## Tooltips demo

https://github.com/NomadRazor/dbdiagram-oss-wrep/assets/36404538/261f2283-af2b-4044-8d98-80d70270ef43


## Live Demo

Fork demo [nomadrazor.github.io/dbdiagram-oss-wrep](https://nomadrazor.github.io/dbdiagram-oss-wrep/)

View the latest master branch at [trudan.github.io/dbdiagram-oss](https://trudan.github.io/dbdiagram-oss/)




## License

[MIT](https://choosealicense.com/licenses/mit/)


## Screenshots

![Demo GIF](https://raw.githubusercontent.com/TruDan/dbdiagram-oss/master/.github/media/demo.gif)


## Related

[quasar](https://quasar.dev/) - Awesome VueJS framework

[jointjs](https://github.com/clientIO/joint) - Charting Library used for diagrams

[dbml.org](https://www.dbml.org/home/) - DBML Parser/importer/exporter

[dbdiagram.io](https://dbdiagram.io/home) - Original DBDiagram tool

[dbdocs.io](https://dbdocs.io/) - Documentation generator for DBML


