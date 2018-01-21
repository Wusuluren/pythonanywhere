#!/usr/bin/env bash


export PYTHONANYWHERE="test"

if type python3.6 &> /dev/null; then
    PYTHON=python3.6
else
    PYTHON=python
fi

#python3.6 run.py
PYTHON run.py
