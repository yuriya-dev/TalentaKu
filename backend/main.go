package main

import (
	"bufio"
	"log"
	"os"
	"strings"
	"time"

	"backend/db"
	"backend/handlers"
	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
	"github.com/gofiber/fiber/v2/middleware/logger"
)

func loadEnv() {
	file, err := os.Open(".env")
	if err != nil {
		return // Ignore if file does not exist
	}
	defer file.Close()

	scanner := bufio.NewScanner(file)
	for scanner.Scan() {
		line := strings.TrimSpace(scanner.Text())
		if line == "" || strings.HasPrefix(line, "#") {
			continue
		}
		parts := strings.SplitN(line, "=", 2)
		if len(parts) == 2 {
			key := strings.TrimSpace(parts[0])
			val := strings.TrimSpace(parts[1])
			// Strip quotes if present
			if (strings.HasPrefix(val, "\"") && strings.HasSuffix(val, "\"")) ||
				(strings.HasPrefix(val, "'") && strings.HasSuffix(val, "'")) {
				val = val[1 : len(val)-1]
			}
			os.Setenv(key, val)
		}
	}
}

func main() {
	// 0. Load environment variables from .env
	loadEnv()

	// 1. Initialize Database
	db.InitDB()

	// 2. Set up Fiber app
	app := fiber.New(fiber.Config{
		AppName: "TalentaKu Expert System API v1.0",
	})

	// 3. Middlewares
	app.Use(logger.New())
	app.Use(cors.New(cors.Config{
		AllowOrigins: "*",
		AllowHeaders: "Origin, Content-Type, Accept, Authorization",
		AllowMethods: "GET, POST, PUT, PATCH, DELETE, OPTIONS",
	}))

	// Middleware to block requests until database migrations and seeding are complete
	app.Use(func(c *fiber.Ctx) error {
		select {
		case <-db.DBReady:
			return c.Next()
		default:
			// If not ready yet, block with a timeout
			select {
			case <-db.DBReady:
				return c.Next()
			case <-time.After(30 * time.Second):
				return c.Status(fiber.StatusServiceUnavailable).JSON(fiber.Map{
					"error": "Database initialization is taking longer than expected. Please try again later.",
				})
			}
		}
	})

	// 4. Register Routes
	api := app.Group("/api")

	// Public Routes
	api.Post("/admin/login", handlers.AdminLogin)
	api.Post("/register", handlers.UserRegister)
	api.Post("/login", handlers.UserLogin)
	api.Post("/login/google", handlers.UserGoogleLogin)
	api.Post("/consultations/claim", handlers.ClaimConsultation)
	api.Get("/variables", handlers.GetVariables)
	api.Post("/intake", handlers.StartIntake)
	api.Post("/suggestions", handlers.SubmitSuggestion)
	api.Get("/consultations", handlers.GetHistory)
	api.Get("/consultation/:id", handlers.GetConsultation)
	api.Get("/consultation/:id/questions", handlers.GetConsultationQuestions)
	api.Post("/consultation/:id/submit", handlers.SubmitAnswers)
	api.Get("/consultation/:id/results", handlers.GetResults)

	// Admin Config & Simulation (Protected)
	adminGroup := api.Group("/admin", handlers.AuthRequired)
	adminGroup.Get("/stats", handlers.GetAdminStats)
	adminGroup.Get("/rules", handlers.GetRules)
	adminGroup.Post("/rules/simulate", handlers.SimulateInference)
	adminGroup.Post("/rules", handlers.SaveRule)
	adminGroup.Get("/settings", handlers.GetSettings)
	adminGroup.Post("/settings", handlers.UpdateSettings)
	adminGroup.Post("/variables", handlers.CreateVariable)
	adminGroup.Put("/variables/:code", handlers.UpdateVariable)
	adminGroup.Delete("/variables/:code", handlers.DeleteVariable)
	adminGroup.Post("/indicators", handlers.CreateIndicator)
	adminGroup.Put("/indicators/:code", handlers.UpdateIndicator)
	adminGroup.Delete("/indicators/:code", handlers.DeleteIndicator)
	adminGroup.Post("/criteria", handlers.CreateCriterion)
	adminGroup.Put("/criteria/:code", handlers.UpdateCriterion)
	adminGroup.Delete("/criteria/:code", handlers.DeleteCriterion)
	adminGroup.Get("/suggestions", handlers.GetSuggestions)
	adminGroup.Patch("/suggestions/:id/read", handlers.MarkSuggestionRead)
	adminGroup.Delete("/suggestions/:id", handlers.DeleteSuggestion)

	// 5. Start Server
	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}

	log.Printf("Starting TalentaKu backend server on port %s...", port)
	if err := app.Listen(":" + port); err != nil {
		log.Fatalf("Server startup failed: %v", err)
	}
}
