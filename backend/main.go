package main

import (
	"log"
	"os"

	"backend/db"
	"backend/handlers"
	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
	"github.com/gofiber/fiber/v2/middleware/logger"
)

func main() {
	// 1. Initialize Database
	db.InitDB()

	// 2. Set up Fiber app
	app := fiber.New(fiber.Config{
		AppName: "TalentaKu Expert System API v1.0",
	})

	// 3. Middlewares
	app.Use(logger.New())
	app.Use(cors.New(cors.Config{
		AllowOrigins: "*", // Adjust for production if needed
		AllowHeaders: "Origin, Content-Type, Accept, Authorization",
		AllowMethods: "GET, POST, PUT, DELETE, OPTIONS",
	}))

	// 4. Register Routes
	api := app.Group("/api")

	// Public Routes
	api.Post("/admin/login", handlers.AdminLogin)
	api.Get("/variables", handlers.GetVariables)
	api.Post("/intake", handlers.StartIntake)
	api.Get("/consultations", handlers.GetHistory)
	api.Get("/consultation/:id", handlers.GetConsultation)
	api.Get("/consultation/:id/questions", handlers.GetConsultationQuestions)
	api.Post("/consultation/:id/submit", handlers.SubmitAnswers)
	api.Get("/consultation/:id/results", handlers.GetResults)

	// Admin Config & Simulation
	api.Get("/admin/stats", handlers.GetAdminStats)
	api.Get("/admin/rules", handlers.GetRules)
	api.Post("/admin/rules/simulate", handlers.SimulateInference)
	api.Get("/admin/settings", handlers.GetSettings)
	api.Post("/admin/settings", handlers.UpdateSettings)

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
