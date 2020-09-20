#!/bin/bash

build() {
    echo 'building extension'

    export INLINE_RUNTIME_CHUNK=false
    export GENERATE_SOURCEMAP=false

    react-scripts build
}

build