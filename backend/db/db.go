package db

import (
	"log"
	"os"

	"backend/models"
	"gorm.io/driver/sqlite"
	"gorm.io/gorm"
)

var DB *gorm.DB

func InitDB() *gorm.DB {
	var err error
	dbPath := os.Getenv("DATABASE_URL")
	if dbPath == "" {
		dbPath = "talentaku.db" // Local SQLite
	}

	log.Printf("Connecting to database: %s", dbPath)

	DB, err = gorm.Open(sqlite.Open(dbPath), &gorm.Config{})
	if err != nil {
		log.Fatalf("Failed to connect to database: %v", err)
	}

	// Auto Migrate
	log.Println("Running database migrations...")
	err = DB.AutoMigrate(
		&models.Setting{},
		&models.Variable{},
		&models.Indicator{},
		&models.IndicatorVariable{},
		&models.Criterion{},
		&models.CriterionIndicator{},
		&models.Child{},
		&models.Consultation{},
		&models.ConsultationAnswer{},
		&models.ConsultationResult{},
		&models.AdminUser{},
	)
	if err != nil {
		log.Fatalf("Database migration failed: %v", err)
	}

	// Run Seeding
	log.Println("Checking seed data...")
	SeedData(DB)

	return DB
}
