resource "google_cloud_run_v2_service" "cr_v2_service" {
  name                = var.cloud_run_name
  location            = var.region
  deletion_protection = false

  template {
    containers {
      image = var.image

      resources {
        limits = {
          memory = var.memory
          cpu    = var.cpu
        }
        cpu_idle = true
        startup_cpu_boost = var.startup_cpu_boost
      }

      ports {
        container_port = var.port
      }

      startup_probe {
        http_get {
          path = var.health_check_path
          port = var.port
        }
        initial_delay_seconds = 0
        period_seconds = 10
        timeout_seconds = 10
        failure_threshold = 20
      }

      dynamic "env" {
        for_each = var.envs

        content {
          name  = env.value.name
          value = env.value.value
        }
      }

      dynamic "env" {
        for_each = var.envs_secrets

        content {
          name  = env.value.name
          value_source {
            secret_key_ref {
              secret = env.value.secret_id
              version = "latest"
            }
          }
        }
      }
    }
  }
  traffic {
    percent = 100
    type    = "TRAFFIC_TARGET_ALLOCATION_TYPE_LATEST"
  }

  lifecycle {
    # Ignore changes made by deployment script
    ignore_changes = [
      template[0].containers[0].name,
      template[0].containers[0].env,
      template[0].labels,
      client,
      client_version,
    ]
  }
}

# Allow all user to access cloud run fkts
resource "google_cloud_run_service_iam_binding" "default" {
  location = google_cloud_run_v2_service.cr_v2_service.location
  service  = google_cloud_run_v2_service.cr_v2_service.name
  role     = "roles/run.invoker"
  members = [
    "allUsers"
  ]
}

resource "google_cloud_run_domain_mapping" "domain_mapping" {
  count = var.domain_mapping != null ? 1 : 0

  name     = var.domain_mapping
  location = google_cloud_run_v2_service.cr_v2_service.location
  metadata {
    namespace = data.google_client_config.current.project
  }
  spec {
    route_name = google_cloud_run_v2_service.cr_v2_service.name
  }
}
