variable "region" {
  description = "The region to deploy the cloud-run function"
  default     = "europe-west1"
}

variable "project_name" {
  type        = string
}

variable "image" {
  type        = string
}

variable "port" {
  type        = string
  description = "The port the cloud-run app runs with"
}

variable "envs" {
  type = list(object({
    name  = string
    value = string
  }))
  description = "Environment variables to be deployed"
  default     = []
}

variable "envs_secrets" {
  type = list(object({
    name  = string
    secret_id = string
  }))
  description = "Environment variables to be deployed"
  default     = []
}

variable "cpu" {
  type        = string
  default = "1000m"
}

variable "memory" {
  type        = string
  default     = "512Mi"
}

variable "startup_cpu_boost" {
  type = bool
  default = false
}

