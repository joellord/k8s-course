docker run -it --rm -v /var/run/docker.sock:/var/run/docker.sock -v $(pwd):/home/course -e DOCKER_WD=$(pwd) joellord/course-tools /bin/bash
