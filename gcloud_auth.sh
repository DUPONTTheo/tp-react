#!/bin/bash

if [ "${CI:-false}" != "true" ] && [ "${CI:-0}" != "1" ]; then
  if ! gcloud auth print-access-token > /dev/null 2>&1; then
    echo -e "Vous n'êtes pas connecté à GCP. Connexion en cours...\n"
    gcloud auth login
    if [ $? -ne 0 ]; then
      echo "Erreur lors de la connexion à GCP."
      exit 1
    fi
  fi
  npx google-artifactregistry-auth
fi
