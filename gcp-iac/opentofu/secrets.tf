# Frontend

# module "frontend_map-tiler-api-key" {
#   source = "./modules/secrets"
#   secret_id = "thrrf_maptiler-api-key"
#   secret_value = var.maptiler_api_key
# }
#
# module "frontend_indoor-control-api-key" {
#   source = "./modules/secrets"
#   secret_id = "thrrf_indoor-control-api-key"
#   secret_value = var.indoor_control_api_key
# }

# Backend

module "db-url" {
  source = "./modules/secrets"
  secret_id = "thrrf_db-url"
  secret_value = var.database_url

  depends_on = [google_project_service.secret-manager-api]
}

module "db-username" {
  source = "./modules/secrets"
  secret_id = "thrrf_db-username"
  secret_value = var.database_user

  depends_on = [google_project_service.secret-manager-api]
}

module "db-password" {
  source = "./modules/secrets"
  secret_id = "thrrf_db-password"
  secret_value = var.database_password

  depends_on = [google_project_service.secret-manager-api]
}
