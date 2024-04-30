CONTAINER_NAME := aerospike
TOOL_CONTAINER_NAME := aql

all: create populate inspect
	docker wait ${TOOL_CONTAINER_NAME}
	$(MAKE) clean

create:
	./scripts/create.sh ${CONTAINER_NAME}

populate:
	./scripts/populate.sh ${CONTAINER_NAME} aql_cmds

inspect:
	./scripts/inspect.sh ${TOOL_CONTAINER_NAME} ${CONTAINER_NAME}

clean:
	docker container stop ${TOOL_CONTAINER_NAME}
	docker container rm ${TOOL_CONTAINER_NAME}
	docker container stop ${CONTAINER_NAME}
	docker container rm ${CONTAINER_NAME}