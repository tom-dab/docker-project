# Construire la nouvelle version
docker build -t meteo-app:v1 .

# Tester localement
docker run -p 3000:3000 meteo-app:v1

# Pousser sur Docker Hub
docker tag meteo-app:v1 gcpandora/meteo-app:v1
docker push gcpandora/meteo-app:v1