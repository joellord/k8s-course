docker run -it --rm -v /var/run/docker.sock:/var/run/docker.sock \
  -v $(pwd):/home/course -e DOCKER_WD=$(pwd) \
  -p 8080:8080 -p 3000:3000 -p 3001:3001 -p 3306:3306 \
  joellord/course-tools /bin/bash
