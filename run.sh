#!/usr/bin/env bash

export PYTHONANYWHERE="test"
tsc ./webapp/static/js/monitor/monitor.ts
python3.6 run.py
