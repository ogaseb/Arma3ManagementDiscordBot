#!/bin/bash

source ids.txt
echo $$ > /home/propanek/Projects/Arma3ManagementDiscordBot/arma3.pid
cd ../../Steam/arma3 &&
exec ./arma3server -name=server -config=directaction.cfg -servermod="@inidbi2;" -mod="843577117;843425103;843632231;843593391;450814997;1200127537;1284731930;909320014;1298165770;1326881314;338783924;1128145626;583496184;1537973181;"
