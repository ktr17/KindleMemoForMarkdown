#!/bin/bash
cp -r . ../KindleMemoForMarkdown/
rm -rf ../KindleMemoForMarkdown/.git
rm -rf ../KindleMemoForMarkdown/.DS_Store
rm ../KindleMemoForMarkdown/.gitignore
rm ../KindleMemoForMarkdown/Readme.md
rm ../KindleMemoForMarkdown/LICENSE
rm ../KindleMemoForMarkdown/export-zip.sh
cd ../
zip -r KindleMemoForMarkdown.zip KindleMemoForMarkdown/
rm -rf KindleMemoForMarkdown
