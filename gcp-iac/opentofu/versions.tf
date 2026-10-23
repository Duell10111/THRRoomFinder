terraform {
  required_providers {
    google = {
      source  = "hashicorp/google"
      version = "7.46.2"
    }
  }
}

provider "google" {
  project     = "thrrosenheim"
  region      = "europe-west4"
}
