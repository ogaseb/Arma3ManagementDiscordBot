#!/bin/bash

source ids.txt
echo $$ > /home/propanek/Projects/Arma3ManagementDiscordBot/arma3.pid
cd ../../Steam/arma3 &&
exec ./arma3server -name=server -config=antistasi_taviana.cfg -servermod="" -mod="843425103;843577117;450814997;583496184;843593391;463939057;843632231;583544987;623475643;753946944;333310405;925018569;1883956552;837729515;2127693591;2257686620;2381446143;2019167442;1673456286;2010222986;1779063631;2222778153;1224892496;766491311;894678801;1638341685;871504836;2071282396;825174634;825172265;2010224487;1703187116;2018593688;2406456647;1911374016;2178398365;2162043396;2391312290;2447965207;2623341670;2626194636;2291129343;2419747503;2484361241;2551544488;2595680138;2011658088;1573550621;2502994878;1352437763;"

