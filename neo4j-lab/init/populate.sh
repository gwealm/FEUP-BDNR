docker run -it --rm \
        --network container:bdnr-neo4j \
        -v ./data/:/var/lib/neo4j/scripts/ \
        neo4j cypher-shell -f /var/lib/neo4j/scripts/bookit-neo4j.cypher \
        -u neo4j -p password-bdnr