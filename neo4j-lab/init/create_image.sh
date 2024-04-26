docker run -d \
        --name bdnr-neo4j \
        -v ${PWD}/../data/neo4j-data:/data \
        -p 7474:7474 \
        -p 7687:7687 \
        neo4j