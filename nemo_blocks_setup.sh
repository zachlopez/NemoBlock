#!/bin/bash

sudo chmod +x /home/zach/NemoBlock/nemo_blocks_start.sh
sudo cp nemo_blocks.service /lib/systemd/system/nemo_blocks.service
sudo systemctl daemon-reload
sudo systemctl disable nemo_blocks.service
sudo systemctl enable nemo_blocks.service
sudo systemctl start nemo_blocks.service
sudo systemctl status nemo_blocks.service