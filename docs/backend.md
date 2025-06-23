# Backend

The backend is built as reactive Spring Boot backend written with Kotlin coroutines.

### 🌍 Tech Stack
- Framework: Spring Boot 3 (Reactive Coroutines)
- Testing: Detect, MockK, Testcontainers, Wiremock
- Language: Kotlin

### 🔧 Configurations

Admin-uids of IDP must be allowlisted to let them access admin endpoints.
This needs to be done configured under `room-finder.admin-ids`.

You need to configure the node ids of the supported buildings in the application.yml to support OSM extraction.

The configuration is done under `room-finder.osm.building-way-ids`. There you add new buildings as new entry in the list.
Each list entry has the following attributes:

| Attribute  | Description                                  |
|------------|----------------------------------------------|
| regex      | Regex used to map room name to this building |
| buildingId | Node Id of the building in Open Street Map   |
| name       | Display Name of the building                 |


_Example:_
```yaml
room-finder:
  osm:
    building-way-ids:
      # Rosenheim Standort
      # Hauptgebäude
      - regex: "A\\d\\.\\d{0,2}\\w?"
        buildingId: 28400949 # Building A
        name: "A"
        # Special case where AZ rooms are in Building B
      - regex: "AZ\\d\\.\\d{0,2}\\w?"
        buildingId: 28401106 # Building B
        name: "A"
      - regex: "B\\d\\.\\d{0,2}\\w?"
        buildingId: 28401106 # Building B
        name: "B"
      # Gebäude S
      - regex: "S\\d\\.\\d{0,3}\\w?"
        buildingId: 28401224
        name: "S"
```
