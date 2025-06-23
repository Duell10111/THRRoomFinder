workspace "Name" "Description" {

    !identifiers hierarchical

    model {
        u = person "User" {
            description "Students, staff, and visitors using the RoomFinder application"
        }
        admin = person "Administrator" {
            description "Manages room data and schedules through the admin dashboard"
        }

        ss = softwareSystem "THRRoomFinder" {
            description "A web and mobile-friendly app to locate rooms and view schedules across campus buildings."

            frontend = container Frontend "Frontend (Next.js)" {
                technology "React, Next.js, Mantine UI"
                description "Provides web and mobile UI for students and staff"

                adminDashboard = component "Admin Dashboard" {
                    description "Admin Dashboard"
                }

                campusMap = component "Map" {
                    description "Campus Map"
                }

                u -> this "Uses via browser"
                admin -> this "Uses for administration"
            }

            backend = container Backend "Backend (Spring Boot)" {
                technology "Kotlin, Spring Boot"
                description "Exposes REST API for room and schedule data"

                roomService = component "Room Service" {
                    description "Handles logic for room location and OSM fetching"
                }
                osmExtractorService = component "OSM Extractor Service" {
                    description "Handles calulation of positions using the Overpass API"
                }
                scheduleService = component "StarPlan Service" {
                    description "Fetches and caches room schedules from StarPlan"
                }
                cache = component Cache "In-Memory Cache"

                roomService -> osmExtractorService "Uses"
                roomService -> scheduleService "Uses"
                roomService -> cache "Uses"
                scheduleService -> cache "Uses"
            }

            db = container "Database Schema" {
                tags "Database"
            }
        }

        mapTiler = softwareSystem "MapTiler" {
            description "Serves map tiles"
        }
        firebase = softwareSystem "Firebase Auth" {
            description "Provides identity and access management for admins"
        }
        osmAPI = softwareSystem "OpenStreetMap (Overpass)" {
            description "Provides indoor room geometry data"
        }
        starPlanAPI = softwareSystem "StarPlan" {
            description "Provides schedule information for rooms"
        }


        ss.frontend -> ss.backend "Sends API requests"
        ss.backend -> ss.db "Reads from and writes to"

        ss.frontend -> mapTiler "Loads map tiles"
        ss.frontend -> firebase "Authenticates admin"
        ss.backend -> firebase "Verifies ID token"
        ss.backend -> osmAPI "Requests data when cache/db is empty"
        ss.backend -> starPlanAPI "Requests schedule data"
    }

    views {
        systemContext ss "System-View" {
            include *
            autolayout lr
        }

        container ss "Container-View" {
            include *
            autolayout lr
        }

        component ss.frontend {
            include *
            autoLayout lr
        }

        component ss.backend {
            include *
            autoLayout lr
        }

        styles {
            element "Element" {
                color #ffffff
            }
            element "Person" {
                background #d34407
                shape person
            }
            element "Software System" {
                background #f86628
            }
            element "Container" {
                background #f88728
            }
            element "Component" {
                background #f88828
            }
            element "Database" {
                shape cylinder
            }
        }
    }

    configuration {
        scope softwaresystem
    }

}
