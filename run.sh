#!/usr/bin/env bash

if type python3.5 &> /dev/null; then
    PYTHON=python3.5
elif type python3.6 &> /dev/null; then
    PYTHON=python3.6
else
    PYTHON=python
fi

$PYTHON run.py
