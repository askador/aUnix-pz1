# Define the application directory
APP_DIR=/home/askador/nure/aUnix/pz1
APP_FILE=index.js
GIT_REPO=https://github.com/askador/aUnix-pz1.git


if [[ ($1 != "deploy") && ($1 != "undeploy") ]]; then
    echo $1
    echo "Invalid argument. Usage: ./deployment.sh [deploy|undeploy]"
    exit 1
fi

# Call the appropriate function based on the command-line argument
if [ $1 = "deploy" ]; then
  deploy_app
elif [ $1 = "undeploy" ]; then
  undeploy_app
fi

deploy() {
    if [ -d "$APP_DIR/.git" ]; then
       cd "$APP_DIR"
        git pull origin main
    else
        git clone "$GIT_REPO" "$APP_DIR"
        cd "$APP_DIR"
    fi

    start_app
}

start_app() {
    cd $APP_DIR
    node $APP_FILE
}

# Function to stop the NodeJS application
stop_app() {
  pid=`ps aux | grep node | grep $APP_FILE | awk '{print $2}'`
  if [ -n "$pid" ]; then
    kill $pid
    echo "NodeJS application stopped"
  else
    echo "NodeJS application is not running"
  fi
}

undeploy() {
    stop_app
    rm -rf $APP_DIR
}
