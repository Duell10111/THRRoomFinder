resource "google_project_service" "secret-manager-api" {
  service = "secretmanager.googleapis.com"

  disable_on_destroy = false
}
