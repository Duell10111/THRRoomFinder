terraform {
  required_providers {
    google = {
      source  = "hashicorp/google"
      version = "7.23.0"
    }
  }
}

provider "google" {
  project     = "thrrosenheim"
  region      = "europe-west4"
}
