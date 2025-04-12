module "frontend" {
  source = "./modules/cloud-run"

  project_name = "frontend"
  port = "3000"
  image = "europe-west1-docker.pkg.dev/thrrosenheim/ghcr-mirror/duell10111/thr-roomfinder/frontend:canary"

  envs_secrets = [{
    name = "NEXT_PUBLIC_MAPTILER_API_KEY"
    secret_id = module.frontend_map-tiler-api-key.secret_id
  },{
    name = "NEXT_PUBLIC_INDOOR_CONTROL_API_KEY"
    secret_id = module.frontend_indoor-control-api-key.secret_id
  }]
}

module "backend" {
  source = "./modules/cloud-run"

  project_name = "backend"
  port = "8080"
  image = "europe-west1-docker.pkg.dev/thrrosenheim/ghcr-mirror/duell10111/thr-roomfinder/backend:canary"

  startup_cpu_boost = true

  envs = [{
    name = "SPRING_PROFILES_ACTIVE"
    value = "gcr"
  }]

  envs_secrets = [{
    name = "DATABASE_URL"
    secret_id = module.db-url.secret_id
  },{
    name = "DATABASE_USERNAME"
    secret_id = module.db-username.secret_id
  },{
    name = "DATABASE_PASSWORD"
    secret_id = module.db-password.secret_id
  }]
}
