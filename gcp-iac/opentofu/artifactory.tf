resource "google_artifact_registry_repository" "ghcr-mirror" {
  repository_id = "ghcr-mirror"
  description   = "ghcr mirror for THRRoomfinder repository"
  format        = "DOCKER"
  mode          = "REMOTE_REPOSITORY"
  remote_repository_config {
    description = "custom docker remote with credentials"
    disable_upstream_validation = true
    docker_repository {
      custom_repository {
        uri = "https://ghcr.io"
      }
    }
    upstream_credentials {
      username_password_credentials {
        username = var.github_username
        password_secret_version = google_secret_manager_secret_version.artifactory_password-basic.name
      }
    }
  }
}

resource "google_secret_manager_secret" "artifactory_password" {
  secret_id = "artifactory-password"

  replication {
    auto {}
  }

  depends_on = [google_project_service.secret-manager-api]
}


resource "google_secret_manager_secret_version" "artifactory_password-basic" {
  secret = google_secret_manager_secret.artifactory_password.id

  secret_data = var.github_private_token
}
