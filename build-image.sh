#!/usr/bin/env bash

function get_package_field() {
  cat package.json \
    | grep $1 \
    | head -1 \
    | awk -F: '{ print $2 }' \
    | sed 's/[",]//g' \
    | tr -d '[[:space:]]'
}

VERSION=$(get_package_field version)
NAME=$(get_package_field name)
NS="raminarmanfar"
IMAGE_NAME="$NS/$NAME:$VERSION"

echo "+ Building $IMAGE_NAME"

docker build --no-cache --rm -t $IMAGE_NAME .