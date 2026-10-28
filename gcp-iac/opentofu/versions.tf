terraform {
  required_providers {
    google = {
      source  = "hashicorp/google"
      version = "8.9.0"
    }
  }
}

provider "google" {
  project     = "thrrosenheim"
  region      = "europe-west4"
}
