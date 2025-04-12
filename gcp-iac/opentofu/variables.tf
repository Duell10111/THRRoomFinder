variable "github_username" {
  type = string
  description = "Github username used for artifactory access"
}

variable "github_private_token" {
  type = string
  sensitive = true
  description = "the GitHub personal access token used for artifactory access"
}

# Secrets

# Frontend

variable "maptiler_api_key" {
  type = string
}

variable "indoor_control_api_key" {
  type = string
}

# Backend

variable "database_url" {
  type = string
  description = "The database connection string"
}

variable "database_user" {
  type = string
}

variable "database_password" {
  type = string
}
