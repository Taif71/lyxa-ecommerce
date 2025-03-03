project:
    # @ make dev_ns
	@ make mongodb
	@ make lyxa_backend

dev_ns:
	@ kubectl apply -f ./deployment/manifests/common/dev-ns.yaml

mongodb:	
	@ kubectl apply -f ./deployment/manifests/mongodb/service.yaml
	@ kubectl apply -f ./deployment/manifests/mongodb/deployment.yaml

lyxa_backend:	
	@ kubectl apply -f ./deployment/manifests/lyxa-backend/secrets.yaml
	@ kubectl apply -f ./deployment/manifests/lyxa-backend/configmap.yaml
	@ kubectl apply -f ./deployment/manifests/lyxa-backend/deployment.yaml
	@ kubectl apply -f ./deployment/manifests/lyxa-backend/service.yaml