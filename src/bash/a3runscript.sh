#!/bin/bash

source ../ids.txt
echo $$ > arma3.pid
cd ../../Steam/arma3 &&
exec ./arma3server -name=server -config=server.cfg -noPause -noSound -enableHT -loadMissionToMemory -world=empty -mod="vn;$IDS"
