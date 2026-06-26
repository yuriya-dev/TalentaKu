package db

import (
	"log"
	"os"
	"strings"
	"time"

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
		if os.Getenv("VERCEL") == "1" {
			dbPath = "/tmp/talentaku.db"
		} else {
			dbPath = "talentaku.db" // Local SQLite
		}
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

	// Configure connection pooling (recommended for production databases like Supabase)
	sqlDB, err := DB.DB()
	if err == nil {
		sqlDB.SetMaxIdleConns(5)
		sqlDB.SetMaxOpenConns(20)
		sqlDB.SetConnMaxLifetime(time.Hour)
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
