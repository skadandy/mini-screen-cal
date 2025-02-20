#!/bin/bash

# 脚本名称
SCRIPT_NAME="cal-gui"
LOG_FILE="cal-gui.log"

# 获取脚本所在目录的绝对路径
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
cd "$SCRIPT_DIR"

# 检查权限
if [ ! -x "./$SCRIPT_NAME" ]; then
    echo "Adding execute permission to $SCRIPT_NAME"
    chmod +x "./$SCRIPT_NAME"
fi

# 停止已运行的实例
echo "Checking for running instances..."
pkill -f "./$SCRIPT_NAME"
sleep 1

# 确保真的停止了
if pgrep -f "./$SCRIPT_NAME" > /dev/null; then
    echo "Force killing remaining instances..."
    pkill -9 -f "./$SCRIPT_NAME"
    sleep 1
fi

# 启动新实例
echo "Starting $SCRIPT_NAME..."
nohup "./$SCRIPT_NAME" > "$LOG_FILE" 2>&1 &

# 等待一会儿检查是否成功启动
sleep 2
if pgrep -f "./$SCRIPT_NAME" > /dev/null; then
    echo "$SCRIPT_NAME started successfully!"
    echo "Log file: $LOG_FILE"
    echo "Process ID: $(pgrep -f "./$SCRIPT_NAME")"
else
    echo "Failed to start $SCRIPT_NAME. Please check $LOG_FILE for details."
    exit 1
fi
