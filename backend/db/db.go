package db

import (
	"log"
	"os"
	"strings"

	"backend/models"
	"gorm.io/driver/postgres"
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

	var dialector gorm.Dialector
	if strings.HasPrefix(dbPath, "postgres://") || strings.HasPrefix(dbPath, "postgresql://") {
		dialector = postgres.Open(dbPath)
	} else {
		dialector = sqlite.Open(dbPath)
	}

	DB, err = gorm.Open(dialector, &gorm.Config{})
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
		&models.User{},
	)
	if err != nil {
		log.Fatalf("Database migration failed: %v", err)
	}

	// Run Seeding
	log.Println("Checking seed data...")
	SeedData(DB)

	return DB
}
