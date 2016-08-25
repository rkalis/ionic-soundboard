#!/usr/bin/env sh

WORKINGDIR=$(dirname "$0")
echo "${WORKINGDIR}"
cd "${WORKINGDIR}"

while read plugin; do
    echo "ionic plugin add $plugin"
    ionic plugin add $plugin
done < ../../plugins.list
