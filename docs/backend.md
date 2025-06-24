# Backend

The backend is implemented as a reactive Spring Boot application using Kotlin coroutines.

### 🌍 Tech Stack
- **Framework**: Spring Boot 3 (Reactive Coroutines)
- **Testing**: SonarQube, MockK, Testcontainers, WireMock
- **Language**: Kotlin

### 🔧 Configuration

Admin UIDs from the identity provider (IDP) must be allowlisted to access admin endpoints.  
This can be configured via the `room-finder.admin-ids` property.

To enable OSM-based extraction, the node IDs of supported buildings must be defined in the `application.yml` under `room-finder.osm.building-way-ids`.

Each list entry requires the following attributes:

| Attribute    | Description                                           |
|--------------|-------------------------------------------------------|
| `regex`      | Regex used to map a room name to this building        |
| `buildingId` | Node ID of the building in OpenStreetMap              |
| `name`       | Display name of the building                          |

#### 🧾 Example Configuration

```yaml
room-finder:
  osm:
    building-way-ids:
      # Rosenheim Campus
      # Main Building
      - regex: "A\\d\\.\\d{0,2}\\w?"
        buildingId: 28400949 # Building A
        name: "A"

      # Special case: AZ rooms are physically in Building B
      - regex: "AZ\\d\\.\\d{0,2}\\w?"
        buildingId: 28401106 # Building B
        name: "A"

      - regex: "B\\d\\.\\d{0,2}\\w?"
        buildingId: 28401106 # Building B
        name: "B"

      # Building S
      - regex: "S\\d\\.\\d{0,3}\\w?"
        buildingId: 28401224
        name: "S"
```

### 🐶 Bruno Collection

To test or develop the backend locally, you can use the **Bruno** collection located in the `bruno` folder at the root of the repository.

**Important:**  
To use the Bruno collection successfully, add a `.env` file in the `bruno` folder.

_Hint:_ You can rename the provided `.env.sample` file to `.env` and fill in the required values.
