resource "google_cloud_run_v2_service" "cr_v2_service" {
  name                = var.project_name
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
    ignore_changes = [
      template[0].containers[0].name,
      template[0].containers[0].env
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
