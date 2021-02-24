#!/bin/bash

source ids.txt
echo "$IDS"
echo $$
echo $$ > /home/propanek/Projects/WorldTensionBot/arma3.pid
cd .. && cd .. && ls && cd Steam && cd arma3 && ls &&
exec ./arma3server -name=server -config=server.cfg -loadMissionToMemory -mod="$IDS"
