module "frontend" {
  source = "./modules/cloud-run"

  region = data.google_client_config.current.region

  cloud_run_name = "frontend-${var.stage}"
  port = "3000"
  image = "${data.google_client_config.current.region}-docker.pkg.dev/thrrosenheim/ghcr-mirror/duell10111/thr-roomfinder/frontend:canary"
  domain_mapping = "thrroomfinder.duell10111.de"

  # envs_secrets = [{
  #   name = "NEXT_PUBLIC_MAPTILER_API_KEY"
  #   secret_id = module.frontend_map-tiler-api-key.secret_id
  # },{
  #   name = "NEXT_PUBLIC_INDOOR_CONTROL_API_KEY"
  #   secret_id = module.frontend_indoor-control-api-key.secret_id
  # }]

  depends_on = [google_artifact_registry_repository.ghcr-mirror]
}

module "backend" {
  source = "./modules/cloud-run"

  region = data.google_client_config.current.region

  cloud_run_name = "backend-${var.stage}"
  port = "8080"
  image = "${data.google_client_config.current.region}-docker.pkg.dev/thrrosenheim/ghcr-mirror/duell10111/thr-roomfinder/backend:canary"
  health_check_path = "/actuator/health"
  domain_mapping = "api.thrroomfinder.duell10111.de"
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

  depends_on = [google_artifact_registry_repository.ghcr-mirror]
}
