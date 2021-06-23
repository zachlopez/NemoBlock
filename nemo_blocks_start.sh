#!/bin/bash

PID_TRES=$(lsof -t -i :3000)
while [ ! -z "$PID_TRES" ]
do
echo "Process $PID_TRES killed."
kill -9 $PID_TRES
PID_TRES=$(lsof -t -i :3000)
done

PID_FIVE=$(lsof -t -i :5000)
while [ ! -z "$PID_FIVE" ]
do
echo "Process $PID_FIVE killed."
kill -9 $PID_FIVE
PID_FIVE=$(lsof -t -i :5000)
done

yarn dev