#!/bin/bash

source ids.txt
echo "$IDS"
echo $$
echo $$ > /home/propanek/Projects/WorldTensionBot/arma3.pid
cd .. && cd .. && cd Steam && cd arma3 &&
exec ./arma3server -name=server -config=server.cfg -noPause -noSound -enableHT -loadMissionToMemory -world=empty -mod="$IDS"
