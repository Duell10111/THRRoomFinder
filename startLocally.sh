#!/usr/bin/env bash

cd roomfinder-backend || (echo "Running script from wrong directory. roomfinder-backend folder not found!" && exit 1)
./gradlew jibDockerBuild -Djib.to.image=roomfinder-backend:local
