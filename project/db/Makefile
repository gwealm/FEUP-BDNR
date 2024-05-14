CONTAINER_NAME := aerospike
AQL_TOOL_CONTAINER_NAME := aql
ASADM_TOOL_CONTAINER_NAME := asadm
UDFS_TOOL_CONTAINER_NAME := udfs
POPULATE_SCRIPTS := ./scripts/populate_scripts

all: create populate indices

create:
	./scripts/create.sh ${CONTAINER_NAME}

populate:
	./scripts/populate.sh ${CONTAINER_NAME} aql_cmds

generate-random-data:
	source ${POPULATE_SCRIPTS}/generate_script/bin/activate && python ${POPULATE_SCRIPTS}/generate.py --output-file ${POPULATE_SCRIPTS}/aql_cmds

indices:
	./scripts/indices.sh ${ASADM_TOOL_CONTAINER_NAME} ${CONTAINER_NAME}

inspect:
	./scripts/inspect.sh ${AQL_TOOL_CONTAINER_NAME} ${CONTAINER_NAME}

admin:
	./scripts/admin.sh ${ASADM_TOOL_CONTAINER_NAME} ${CONTAINER_NAME}

register-udfs:
	./scripts/udfs.sh ${UDFS_TOOL_CONTAINER_NAME} ${CONTAINER_NAME}

clean:
	docker container stop ${CONTAINER_NAME}
	docker container rm ${CONTAINER_NAME}